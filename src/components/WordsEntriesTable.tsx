'use client';

import { useState, useEffect } from 'react';
import { Table, Space, Typography, Button, message, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, ReloadOutlined, UndoOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { WordEntryDocument } from '@/services/database';
import EditWordModal from './EditWordModal';
import { createCommonColumns } from './shared/wordEntriesTableColumns';

const { Text } = Typography;

export default function WordsEntriesTable() {
  const [words, setWords] = useState<WordEntryDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedExamples, setExpandedExamples] = useState<Set<string>>(new Set());
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<WordEntryDocument | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editTarget, setEditTarget] = useState<WordEntryDocument | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchWordEntries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/wordEntries');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setWords(result.data);
      } else {
        messageApi.error('Failed to fetch word entries');
      }
    } catch (error) {
      messageApi.error('Error fetching word entries');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWordEntries();
  }, []);

  const handleTableChange = (paginationConfig: { current?: number; pageSize?: number }) => {
    console.log('Pagination changed:', paginationConfig);
    setPagination({
      current: paginationConfig.current || 1,
      pageSize: paginationConfig.pageSize || 20,
    });
  };

  const showDeleteConfirm = (record: WordEntryDocument) => {
    setDeleteTarget(record);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteTarget) {
      try {
        const response = await fetch(`/api/wordEntries/${deleteTarget._id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          const result = await response.json();
          messageApi.success(result.message || 'Word entry deleted successfully');
          setDeleteModalVisible(false);
          setDeleteTarget(null);
          fetchWordEntries(); // Refresh the data
        } else {
          const errorData = await response.json();
          messageApi.error(errorData.error || 'Failed to delete word entry');
        }
      } catch (error) {
        messageApi.error('Error deleting word entry');
        console.error('Error deleting word entry:', error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
    setDeleteTarget(null);
  };

  const handleMoveToDraft = async (id: string) => {
    try {
      const response = await fetch(`/api/wordEntries/${id}/moveToDraft`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        messageApi.success(result.message || 'Word moved to draft collection');
        fetchWordEntries(); // Refresh the data
      } else {
        const errorData = await response.json();
        messageApi.error(errorData.error || 'Failed to move word to draft');
      }
    } catch (error) {
      messageApi.error('Error moving word to draft');
      console.error('Error moving word to draft:', error);
    }
  };

  const showEditModal = (record: WordEntryDocument) => {
    setEditTarget(record);
    setEditModalVisible(true);
  };

  const handleEditCancel = () => {
    setEditModalVisible(false);
    setEditTarget(null);
  };

  const handleEditSave = async (updatedRecord: Partial<WordEntryDocument>) => {
    if (editTarget) {
      try {
        const response = await fetch(`/api/wordEntries/${editTarget._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedRecord),
        });

        if (response.ok) {
          const result = await response.json();
          messageApi.success(result.message || 'Word updated successfully');
          setEditModalVisible(false);
          setEditTarget(null);
          fetchWordEntries(); // Refresh the data
        } else {
          const errorData = await response.json();
          messageApi.error(errorData.error || 'Failed to update word');
        }
      } catch (error) {
        messageApi.error('Error updating word');
        console.error('Update error:', error);
      }
    }
  };



  const commonColumns = createCommonColumns(expandedExamples, setExpandedExamples);

  const columns: ColumnsType<WordEntryDocument> = [
    ...commonColumns,
    {
      title: 'Actions',
      key: 'actions',
      width: 160,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => showEditModal(record)}
            title="Edit word"
          />
          <Button
            type="text"
            icon={<UndoOutlined />}
            size="small"
            onClick={() => handleMoveToDraft(String(record._id))}
            title="Move to draft"
            style={{ color: '#faad14' }}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => showDeleteConfirm(record)}
            title="Delete word"
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <Modal
        title="Confirm Delete"
        open={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>
          Are you sure you want to delete the word "{deleteTarget?.word}"?
        </p>
        <p>This action cannot be undone.</p>
      </Modal>

      <EditWordModal
        visible={editModalVisible}
        record={editTarget}
        onCancel={handleEditCancel}
        onSave={handleEditSave}
      />

      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Space>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={fetchWordEntries}
            loading={loading}
          >
            Refresh
          </Button>
          <Text type="secondary">Approved: {words.length} words</Text>
        </Space>

        <Table
          columns={columns}
          dataSource={words}
          rowKey="_id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} items`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1000 }}
          size="small"
        />
      </Space>
    </>
  );
}

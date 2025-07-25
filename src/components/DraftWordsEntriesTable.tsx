'use client';

import { useState, useEffect } from 'react';
import { Table, Space, Typography, Button, message, Collapse, Modal } from 'antd';
import { DeleteOutlined, ReloadOutlined, CheckOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { WordEntryDocument } from '@/services/database';
import WordUploadForm from './WordUploadForm';
import EditWordModal from './EditWordModal';
import { createCommonColumns } from './shared/wordEntriesTableColumns';

const { Text } = Typography;

interface DraftWordsEntriesTableProps {
  onApprove?: () => void;
  onRefreshMainTable?: () => void;
}

export default function DraftWordsEntriesTable({ onApprove, onRefreshMainTable }: DraftWordsEntriesTableProps) {
  const [words, setWords] = useState<WordEntryDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });
  const [expandedExamples, setExpandedExamples] = useState<Set<string>>(new Set());
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editTarget, setEditTarget] = useState<WordEntryDocument | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<WordEntryDocument | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchDraftWordEntries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/draftWordEntries');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setWords(result.data);
      } else {
        messageApi.error('Failed to fetch draft word entries');
      }
    } catch (error) {
      messageApi.error('Error fetching draft word entries');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDraftWordEntries();
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
        const response = await fetch(`/api/draftWordEntries/${deleteTarget._id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          messageApi.success('Draft word entry deleted successfully');
          setDeleteModalVisible(false);
          setDeleteTarget(null);
          fetchDraftWordEntries(); // Refresh the data
        } else {
          const errorData = await response.json();
          messageApi.error(errorData.error || 'Failed to delete draft word entry');
        }
      } catch (error) {
        messageApi.error('Error deleting draft word entry');
        console.error('Error deleting draft word entry:', error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
    setDeleteTarget(null);
  };

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/draftWordEntries/${id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
          const result = await response.json();
          messageApi.success(result.message || 'Word approved and moved to main collection');
          fetchDraftWordEntries(); // Refresh the data
          onApprove?.(); // Refresh main table
          onRefreshMainTable?.(); // Refresh main table from parent
        } else {
        const errorData = await response.json();
        messageApi.error(errorData.error || 'Failed to approve word entry');
      }
    } catch (error) {
      messageApi.error('Error approving word entry');
      console.error('Error approving word entry:', error);
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
        const response = await fetch(`/api/draftWordEntries/${editTarget._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedRecord),
        });

        if (response.ok) {
          const result = await response.json();
          messageApi.success(result.message || 'Draft word updated successfully');
          setEditModalVisible(false);
          setEditTarget(null);
          fetchDraftWordEntries(); // Refresh the data
        } else {
          const errorData = await response.json();
          messageApi.error(errorData.error || 'Failed to update draft word');
        }
      } catch (error) {
        messageApi.error('Error updating draft word');
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
      width: 120,
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
            icon={<CheckOutlined />}
            size="small"
            onClick={() => handleApprove(String(record._id))}
            title="Approve and move to main collection"
            style={{ color: '#52c41a' }}
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
          Are you sure you want to delete the draft word "{deleteTarget?.word}"?
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
        <Collapse 
          size="small" 
          defaultActiveKey={['1']}
          items={[
            {
              key: '1',
              label: (
                <Space>
                  <PlusOutlined />
                  <Text>Add New Words to Drafts</Text>
                </Space>
              ),
              children: <WordUploadForm onUploadSuccess={fetchDraftWordEntries} />,
            },
          ]}
        />

        <Space>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={fetchDraftWordEntries}
            loading={loading}
          >
            Refresh Drafts
          </Button>
          <Text type="secondary">Drafts: {words.length} words</Text>
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

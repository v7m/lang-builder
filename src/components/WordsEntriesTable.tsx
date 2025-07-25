'use client';

import { useState, useEffect } from 'react';
import { Table, Space, Tag, Typography, Button, message, Collapse, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, ReloadOutlined, DownOutlined, UpOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { WordEntryDocument } from '@/services/database';
import WordUploadForm from './WordUploadForm';
import EditWordModal from './EditWordModal';

const { Text } = Typography;

interface WordsEntriesTableProps {
  onEdit?: (record: WordEntryDocument) => void;
  onDelete?: (id: string) => void;
}

export default function WordsEntriesTable({ onDelete }: WordsEntriesTableProps) {
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
      await onDelete?.(String(deleteTarget._id));
      setDeleteModalVisible(false);
      setDeleteTarget(null);
      fetchWordEntries(); // Refresh the data in the component
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
    setDeleteTarget(null);
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

  const getPartOfSpeechColor = (partOfSpeech: string) => {
    const colors: Record<string, string> = {
      noun: 'blue',
      verb: 'green',
      adjective: 'orange',
      adverb: 'purple',
      pronoun: 'cyan',
      preposition: 'magenta',
      particle: 'lime',
      conjunction: 'geekblue',
      interjection: 'volcano',
      numeral: 'gold',
      article: 'red',
      unknown: 'default'
    };
    return colors[partOfSpeech] || 'default';
  };

  const getGenderColor = (gender: string) => {
    const colors: Record<string, string> = {
      neuter: 'green',
      masculine: 'blue',
      feminine: 'red'
    };
    return colors[gender] || 'default';
  };

  const getRegularColor = (regular: boolean) => {
    return regular ? 'green' : 'orange';
  };

  const renderForms = (forms: unknown) => {
    if (!forms) return <Text type="secondary">-</Text>;

    if (typeof forms === 'string') {
      return <Text>{forms}</Text>;
    }

    if (typeof forms === 'object' && forms !== null && 'base' in forms) {
      return <Text>{(forms as { base: string }).base}</Text>;
    }

    if (typeof forms === 'object' && forms !== null) {
      const formEntries = Object.entries(forms);
      if (formEntries.length === 0) {
        return <Text type="secondary">-</Text>;
      }

      return (
        <Space direction="vertical" size={0}>
          {formEntries.map(([key, value]) => (
            <Text key={key} style={{ lineHeight: '1.2' }}>
              <Text type="secondary">{key}: </Text>
              {value === null || value === 'null' ? '-' : String(value)}
            </Text>
          ))}
        </Space>
      );
    }

    return <Text type="secondary">-</Text>;
  };

  const columns: ColumnsType<WordEntryDocument> = [
    {
      title: 'Word',
      dataIndex: 'word',
      key: 'word',
      width: 120,
      align: 'center',
      render: (word: string) => <Text strong>{word}</Text>,
    },
    {
      title: 'Grammar',
      dataIndex: 'grammar',
      key: 'grammar',
      width: 120,
      align: 'center',
      render: (grammar: { partOfSpeech: string; gender?: string; regular: boolean }) => {
        if (!grammar) return <Text type="secondary">-</Text>;

        return (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            alignItems: 'center'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center'
            }}>
              <Tag color={getPartOfSpeechColor(grammar.partOfSpeech)}>
                {grammar.partOfSpeech}
              </Tag>
              {grammar.gender && (
                <Tag color={getGenderColor(grammar.gender)} style={{ marginLeft: '-5px' }}>
                  {grammar.gender.charAt(0).toUpperCase()}
                </Tag>
              )}
            </div>
            <Tag color={getRegularColor(grammar.regular)}>
              {grammar.regular ? 'regular' : 'irregular'}
            </Tag>
          </div>
        );
      },
    },
    {
      title: 'Translation',
      dataIndex: ['translations', 'ru'],
      key: 'translation',
      width: 200,
      align: 'center',
      render: (translation: string) => translation || <Text type="secondary">-</Text>,
    },
    {
      title: 'Forms',
      dataIndex: 'forms',
      key: 'forms',
      width: 200,
      align: 'center',
      render: renderForms,
    },
    {
      title: 'Examples',
      dataIndex: 'examples',
      key: 'examples',
      width: 200,
      align: 'center',
      render: (examples: string[], record: WordEntryDocument) => {
        if (!examples || examples.length === 0) {
          return <Text type="secondary">-</Text>;
        }

        const recordId = String(record._id);
        const isExpanded = expandedExamples.has(recordId);
        const showExamples = isExpanded ? examples : examples.slice(0, 1);
        const hasMore = examples.length > 1;

        const toggleExpanded = () => {
          const newExpanded = new Set(expandedExamples);
          if (isExpanded) {
            newExpanded.delete(recordId);
          } else {
            newExpanded.add(recordId);
          }
          setExpandedExamples(newExpanded);
        };

        return (
          <Space direction="vertical" size={0}>
            <ul style={{ 
              margin: 0, 
              padding: 0, 
              listStyle: 'none',
              lineHeight: '1.2'
            }}>
              {showExamples.map((example, index) => (
                <li key={index} style={{ margin: 0, padding: 0 }}>
                  • {example}
                </li>
              ))}
            </ul>
            {hasMore && (
              <Button
                type="text"
                size="small"
                icon={isExpanded ? <UpOutlined /> : <DownOutlined />}
                onClick={toggleExpanded}
                style={{ padding: 0, height: 'auto', fontSize: '11px' }}
              >
                {isExpanded ? 'Show less' : `+${examples.length - 1} more`}
              </Button>
            )}
          </Space>
        );
      },
    },
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
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => showDeleteConfirm(record)}
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
        <Collapse 
          size="small" 
          defaultActiveKey={['1']}
          items={[
            {
              key: '1',
              label: (
                <Space>
                  <PlusOutlined />
                  <Text>Add New Words</Text>
                </Space>
              ),
              children: <WordUploadForm onUploadSuccess={fetchWordEntries} />,
            },
          ]}
        />

        <Space>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={fetchWordEntries}
            loading={loading}
          >
            Refresh
          </Button>
          <Text type="secondary">Total: {words.length} words</Text>
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

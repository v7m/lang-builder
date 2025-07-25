'use client';

import { useCallback, useState, useEffect } from 'react';
import { Layout, Typography, Space, message } from 'antd';
import { DatabaseOutlined } from '@ant-design/icons';
import WordsEntriesTable from '@/components/WordsEntriesTable';
import LoadingScreen from '@/components/LoadingScreen';
import { WordEntryDocument } from '@/services/database';

const { Header, Content } = Layout;
const { Title } = Typography;

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    setMounted(true);
  }, []);

  const refreshTable = useCallback(() => {
    // This will be called by the table component to refresh data
    console.log('Table refresh requested');
  }, []);

  const handleEdit = (record: WordEntryDocument) => {
    console.log('Edit record:', record);
    // TODO: Implement edit functionality
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/wordEntries/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        messageApi.success('Word entry deleted successfully');
        refreshTable(); // Trigger table refresh
      } else {
        const errorData = await response.json();
        messageApi.error(errorData.error || 'Failed to delete word entry');
      }
    } catch (error) {
      messageApi.error('Error deleting word entry');
      console.error('Error deleting word entry:', error);
    }
  };

  if (!mounted) {
    return <LoadingScreen />;
  }

  return (
    <>
      {contextHolder}
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ 
          display: 'flex', 
          alignItems: 'center', 
          background: '#001529',
          padding: '0 24px'
        }}>
          <DatabaseOutlined style={{ fontSize: '24px', color: 'white', marginRight: '12px' }} />
          <Title level={3} style={{ color: 'white', margin: 0 }}>
            Language Builder
          </Title>
        </Header>
        
        <Content style={{ padding: '24px' }}>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto',
            width: '100%'
          }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Title level={2}>German Words Database</Title>
              <p>Welcome to your language learning database!</p>
              <WordsEntriesTable 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
              />
            </Space>
          </div>
        </Content>
      </Layout>
    </>
  );
}

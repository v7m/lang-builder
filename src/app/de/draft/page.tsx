'use client';

import { useState } from 'react';
import { Space, Typography } from 'antd';
import DraftWordsEntriesTable from '@/components/DraftWordsEntriesTable';

const { Title } = Typography;

export default function DraftPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefreshMainTable = () => {
    // This will trigger a refresh of the approved table when user navigates back
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}>Draft German Words</Title>
      <p>Review and approve words before adding to the main collection.</p>
      <DraftWordsEntriesTable 
        key={refreshKey}
        onRefreshMainTable={handleRefreshMainTable} 
      />
    </Space>
  );
}

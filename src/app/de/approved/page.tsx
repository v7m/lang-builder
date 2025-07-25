'use client';

import { useState } from 'react';
import { Space, Typography } from 'antd';
import WordsEntriesTable from '@/components/WordsEntriesTable';

const { Title } = Typography;

export default function ApprovedPage() {
  const [mainTableKey] = useState(0);

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}>Approved German Words</Title>
      <p>Verified and approved words in the main collection.</p>
      <WordsEntriesTable key={mainTableKey} />
    </Space>
  );
}

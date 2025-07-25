import { useState } from 'react';
import { Space, Typography, Button, message, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface WordUploadFormProps {
  onUploadSuccess?: () => void;
}

export default function WordUploadForm({ onUploadSuccess }: WordUploadFormProps) {
  const [newWordsText, setNewWordsText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleUploadWords = async () => {
    if (!newWordsText.trim()) {
      messageApi.warning('Please enter some words');
      return;
    }

    setUploading(true);
    try {
      const response = await fetch('/api/draftWordEntries/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputWordsText: newWordsText }),
      });

      if (response.ok) {
        const result = await response.json();
        messageApi.success(result.message || 'Words uploaded successfully');
        setNewWordsText('');
        onUploadSuccess?.();
      } else {
        const errorData = await response.json();
        messageApi.error(errorData.error || 'Failed to upload words');
      }
    } catch {
      messageApi.error('Error uploading words');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <Text type="secondary">
          Enter German words (one per line):
        </Text>
        <Input.TextArea
          value={newWordsText}
          onChange={(e) => setNewWordsText(e.target.value)}
          placeholder="Haus&#10;Auto&#10;Buch"
          rows={4}
          style={{ width: '100%' }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleUploadWords}
          loading={uploading}
          disabled={!newWordsText.trim()}
        >
          Load Words
        </Button>
      </Space>
    </>
  );
}

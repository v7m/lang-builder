'use client';

import { useState, useEffect } from 'react';
import { Layout, Menu, Typography } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import { FileTextOutlined, CheckCircleOutlined, DatabaseOutlined } from '@ant-design/icons';
import LoadingScreen from '@/components/LoadingScreen';

const { Header, Content } = Layout;
const { Title } = Typography;

export default function GermanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const menuItems = [
    {
      key: '/de/draft',
      icon: <FileTextOutlined />,
      label: 'Draft Word Entries',
    },
    {
      key: '/de/approved',
      icon: <CheckCircleOutlined />,
      label: 'Approved Word Entries',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    router.push(key);
  };

  if (!mounted) {
    return <LoadingScreen />;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        background: '#001529',
        padding: '0 24px'
      }}>
        <DatabaseOutlined style={{ fontSize: '24px', color: 'white', marginRight: '12px' }} />
        <Title level={3} style={{ color: 'white', margin: 0, marginRight: '48px' }}>
          Language Builder
        </Title>
        <Menu
          mode="horizontal"
          selectedKeys={[pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ 
            background: 'transparent',
            borderBottom: 'none',
            flex: 1
          }}
          theme="dark"
        />
      </Header>
      <Content style={{ padding: '24px' }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          width: '100%'
        }}>
          {children}
        </div>
      </Content>
    </Layout>
  );
}

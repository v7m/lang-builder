import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const DEFAULT_MESSAGE = 'Loading Language Builder...';

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = DEFAULT_MESSAGE }: LoadingScreenProps) {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{ textAlign: 'center' }}>
        <Spin 
          size="large" 
          indicator={<LoadingOutlined style={{ fontSize: 48, color: 'white' }} spin />}
        />
        <div style={{ 
          marginTop: '24px', 
          color: 'white', 
          fontSize: '18px',
          fontWeight: 500
        }}>
          {message}
        </div>
      </div>
    </div>
  );
}

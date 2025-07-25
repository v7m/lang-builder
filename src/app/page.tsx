'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/components/LoadingScreen';

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Redirect to draft page by default
    router.push('/de/draft');
  }, [router]);

  if (!mounted) {
    return <LoadingScreen />;
  }

  return null; // This page will redirect immediately
}

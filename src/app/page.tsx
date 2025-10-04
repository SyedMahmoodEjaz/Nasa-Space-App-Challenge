"use client";

import { useState, useEffect } from 'react';
import IntroAnimation from '@/components/intro-animation';
import ExplorePage from '@/components/explore-page';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <>
      {loading ? (
        <IntroAnimation onAnimationComplete={() => setLoading(false)} />
      ) : (
        <ExplorePage />
      )}
    </>
  );
}

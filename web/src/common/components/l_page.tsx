import React from 'react';

import { OverlayStack } from '../services/overlay';
import { View } from '.';

interface LPageProps {
  color: string;
}

export const LPage: React.FC<Partial<LPageProps>> = (p) => {
  return (
    <>
      <View className="page" style={{ background: p.color }}>
        {p.children}
      </View>
      <OverlayStack />
    </>
  );
};

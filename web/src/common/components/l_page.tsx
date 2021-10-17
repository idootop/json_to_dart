import React from 'react';

import { View } from '.';

interface LPageProps {
  color: string;
}

export const LPage: React.FC<Partial<LPageProps>> = (p) => {
  return (
    <View className="page" style={{ background: p.color }}>
      {p.children}
    </View>
  );
};

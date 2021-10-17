import React from 'react';

import { View } from '.';

interface LPageProps {
  color: string;
}

export const LPage: React.FC<Partial<LPageProps>> = (p) => {
  return <View style={{ width: '100vw', height: '100vh' }}>{p.children}</View>;
};

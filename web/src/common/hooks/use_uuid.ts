import { useMemo } from 'react';

import { randomUUID } from '../utils';

export function useUUID(length = 4): string {
  return useMemo(() => randomUUID().substr(0, length), [length]);
}

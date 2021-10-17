import { useMemo } from 'react';

let id = 0;

function getId(): number {
  return id++;
}

export function useID(): number {
  return useMemo(() => getId(), []);
}

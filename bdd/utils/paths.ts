import path from 'node:path';

export const resolveFeaturePath = (relativePath: string): string => {
  return path.resolve(__dirname, '..', relativePath);
};
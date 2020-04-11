import { existsSync } from 'fs';

const isNone = (obj: unknown): boolean => obj === undefined || obj === null;

const isFoldExist = (name: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (isNone(name)) reject(new Error('name must be provided'));
    if (existsSync(name)) reject(new Error(`${name} has existed`));
    else resolve();
  });
};

export default isFoldExist;

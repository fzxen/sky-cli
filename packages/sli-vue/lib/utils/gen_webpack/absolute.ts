import path from 'path';

export default (relative: string): string =>
  path.resolve(process.cwd(), `${relative}`);

export default interface QueryOptions {
  name: string; // 项目名称
  frame: 'vue' | 'react' | 'electron'; // 框架
  description: string; // 项目描述
  author: string;
  eslint: boolean;
  commitLint: boolean;
  codeLint: boolean;
}

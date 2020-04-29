interface Packages {
  name: string;
  version: string;
  description: string;
  main: string;
  scripts: {
    [prop: string]: string;
  };
  keywords: unknown[];
  repository: {
    type: string;
    url: string;
  };
  homepage: string;
  author: string;
  license: string;
  dependencies: { [prop: string]: string };
  devDependencies: { [prop: string]: string };

  husky: {
    hooks: { [prop: string]: string };
  };
  'lint-staged': { [prop: string]: string[] };
}

export default Packages;

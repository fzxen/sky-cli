type callback = (err: Error) => void;

interface Options {
  clone: boolean;
}

declare function download(
  repo: string,
  dest: string,
  opts?: Options,
  fn?: callback
): void;

export = download;

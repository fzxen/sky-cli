import gitSources from './git_sources';
import downloadGit from 'download-git-repo';
import QueryOptions from '../interface/create_query_options';
import ora from 'ora';

const download = (options: QueryOptions): Promise<QueryOptions> => {
  return new Promise((resolve, reject) => {
    const { name, frame } = options;

    const loading = ora();
    loading.start('downloading...');

    const source = gitSources[frame];
    if (!source.url) {
      loading.fail(`${frame} is not provided for now`);
      reject(new Error());
    }

    downloadGit(source.url, name, { clone: true }, err => {
      if (err) {
        loading.fail('download failed, please check your network');
        reject(err);
      } else {
        loading.succeed('download successfully');
        resolve(options);
      }
    });
  });
};

export default download;

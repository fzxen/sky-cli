export default (): Array<object> => {
  return [
    {
      type: 'confirm',
      message: 'Do you need initialize a git repository',
      name: 'git',
      default: false,
    },
  ];
};

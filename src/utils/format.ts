export const trimEmptyLines = (str: string) => {
  return str.trimRight().replace(/^\n+/, '');
};

export const addIndent = (str: string, indentation: string) => {
  return str.replace(/(^|\n)(?!\n|$)/g, `$1${indentation}`);
};

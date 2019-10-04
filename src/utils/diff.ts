import getDiff from 'jest-diff';

const diff = (prev: string, curr: string): string => {
  const diff = getDiff(prev, curr, {
    aAnnotation: 'Previous',
    bAnnotation: 'Current',
    ...noColorAll,
  });

  // remove ANSI colors until next `jest-diff` release.
  return (diff || '').replace(
    // eslint-disable-next-line no-control-regex
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    '',
  );
};

// https://github.com/facebook/jest/blob/95830607c0ffbab6efd1695ed0bdc217d2f37b5b/packages/jest-diff/README.md#example-of-options-for-no-colors
const noColor = (str: string) => str;
const noColorAll = {
  aColor: noColor,
  bColor: noColor,
  changeColor: noColor,
  commonColor: noColor,
  patchColor: noColor,
  trailingSpaceFormatter: noColor,
} as const;

export default diff;

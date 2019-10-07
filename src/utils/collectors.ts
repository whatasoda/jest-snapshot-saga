// https://github.com/facebook/jest/blob/d1ad66e4abdd903b0ed153c3cf71a6a8066e97f9/packages/pretty-format/src/plugins/ReactElement.ts#L23-L34
export const getReactChildren = (arg: Array<any>, children = []) => {
  if (Array.isArray(arg)) {
    arg.forEach(item => {
      getReactChildren(item, children);
    });
  } else if (arg != null && arg !== false) {
    children.push(arg);
  }
  return children;
};

export const getDOMChildren = (node: HTMLElement) => {
  // https://github.com/facebook/jest/blob/d1ad66e4abdd903b0ed153c3cf71a6a8066e97f9/packages/pretty-format/src/plugins/DOMElement.ts#L99-L106
  return Array.prototype.slice.call(node.childNodes || node.children);
};

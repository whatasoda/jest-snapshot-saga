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

export interface MockSnapshotEntry {
  order: number;
  displayName: string;
  call: any[];
  type: jest.MockResult<any>['type'] | 'instance';
  value: any;
}
export const getMockSnapshotEntriesByOrder = (functions: jest.Mock[], mockClear?: boolean) => {
  return functions.reduce<MockSnapshotEntry[]>((acc, func) => {
    const displayName = func.getMockName();
    const { invocationCallOrder, calls, results, instances } = func.mock;

    const entries = invocationCallOrder.map<MockSnapshotEntry>((order, i) => {
      const result = results[i];
      const instance = instances[i];
      const isInstance = result.value === undefined && Boolean(instance);
      const value = result.value || instance;
      return {
        order,
        displayName,
        call: calls[i],
        type: isInstance ? 'instance' : result.type,
        value,
      };
    });

    if (acc.length) {
      entries.forEach(entry => {
        const index = acc.findIndex(({ order }) => order > entry.order);
        if (index === -1) {
          acc.push(entry);
        } else {
          acc.splice(index, 0, entry);
        }
      });
    } else {
      acc.push(...entries);
    }

    if (mockClear) func.mockClear();
    return acc;
  }, []);
};

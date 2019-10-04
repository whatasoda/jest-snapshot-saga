import prettyFormat from 'pretty-format';

const MockFunction: prettyFormat.Plugin = {
  test: val => jest.isMockFunction(val),
  serialize: (func: jest.Mock<any, any>) => {
    return `[MockFunction ${func.getMockName()}]`;
  },
};

export default MockFunction;

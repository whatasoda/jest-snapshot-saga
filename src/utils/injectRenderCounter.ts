import { ComponentType, ComponentClass, FunctionComponent } from 'react';

// https://stackoverflow.com/questions/41488713/react-how-to-determine-if-component-is-stateless-functional#answer-52211951
const isFunctionalComponent = <P>(Component: ComponentType<P>): Component is FunctionComponent<P> => {
  return typeof Component === 'function' && !(Component.prototype && Component.prototype.isReactComponent);
};

const isClassComponent = <P>(Component: ComponentType<P>): Component is ComponentClass<P> => {
  return Boolean(typeof Component === 'function' && Component.prototype && Component.prototype.isReactComponent);
};

const injectRenderCounter = <P extends object>(original: ComponentType<P>) => {
  let count = 0;
  const getRenderCount = () => count;
  const staticValues = { ...original };
  if (isFunctionalComponent(original)) {
    const Injected: FunctionComponent<P> = (...args) => {
      count++;
      return original(...args);
    };
    Object.assign(Injected, staticValues);
    return { Injected, getRenderCount };
  } else if (isClassComponent(original)) {
    const { render } = original.prototype as React.Component;
    const Injected: ComponentClass<P> = class Injected extends original {};
    (Injected.prototype as React.Component).render = function(...args) {
      count++;
      return render(...args);
    };
    return { Injected, getRenderCount };
  }
  throw new Error('Unacceptable react component was passed to "injectRenderCounter"');
};

export default injectRenderCounter;

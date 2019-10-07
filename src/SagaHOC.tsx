import React, { ComponentType, Dispatch, useState, useEffect } from 'react';
import injectRenderCounter from './utils/injectRenderCounter';
import { act } from '@testing-library/react';

const SagaHOC = <P extends object>(Component: ComponentType<P>) => {
  const { Injected, getRenderCount } = injectRenderCounter(Component);
  let dispatchProps = (null as unknown) as Dispatch<P | null>;

  const Saga = () => {
    const [props, setProps] = useState<P | null>(null);
    useEffect(() => {
      dispatchProps = setProps;
    }, []);

    if (!props) return null;
    return <Injected {...props} />;
  };
  Saga.setProps = (props: P) => {
    act(() => dispatchProps(props));
  };

  Saga.unmount = () => {
    act(() => dispatchProps(null));
  };
  Saga.getRenderCount = getRenderCount;

  return Saga;
};

export default SagaHOC;

import React, { ComponentType, Dispatch, useState, useEffect, FunctionComponent } from 'react';
import { render, act } from '@testing-library/react';
import { ROOT_ELEMENT, MONOLITH_SNAPSHOT } from './utils/symbols';
import {
  StoryOptions,
  TestStoryType,
  TestStorySnapshotState,
  SnapshotSectionRecord,
  MonolithSnapshotState,
} from './decls';
import injectRenderCounter from './utils/injectRenderCounter';
import serialize from './serialize';
import pseudoEventTarget from './mock/pseudoEventTarget';

const start = <P extends object>(Component: ComponentType<P>, { Provider, extraMockFunctions }: StoryOptions = {}) => {
  const { Injected, getRenderCount } = injectRenderCounter(Component);
  let using = false;
  let used = false;

  let dispatchUnmount = (null as unknown) as Dispatch<true>;
  let dispatchProps = (null as unknown) as Dispatch<P>;

  const StoryComponent: FunctionComponent = () => {
    const [props, setProps] = useState<P | null>(null);
    const [unmount, setUnmount] = useState(false);
    useEffect(() => {
      assertUsed('render');
      assertUsing('render');
      using = true;
      dispatchUnmount = setUnmount;
      dispatchProps = setProps;
      return () => {
        used = true;
      };
    }, []);

    if (unmount || !props) return null;
    return <Injected {...props} />;
  };

  const setProps = (props: P) => {
    assertUsed('set props');
    act(() => dispatchProps(props));
  };

  const unmount = () => {
    assertUsed('unmount');
    dispatchUnmount(true);
  };

  const assertUsing = (action: string): void | never => {
    if (using) {
      throw new Error(`Cannot ${action} to a test story being used.`);
    }
  };
  const assertUsed = (action: string): void | never => {
    if (used) {
      throw new Error(`Cannot ${action} to a test story already used.`);
    }
  };

  const result = render(<StoryComponent />, { wrapper: Provider });
  const snapshotState: TestStorySnapshotState = {
    [ROOT_ELEMENT]: true,
    root: result.container,
    isMonolith: false,
    functions: extraMockFunctions ? extraMockFunctions.filter(jest.isMockFunction) : [],
    prev: { elements: '', functions: '', styles: '' },
    diff: { elements: false, functions: false, styles: false },
  };

  return { result, getRenderCount, setProps, unmount, snapshotState };
};

const createTestStory = <P extends object>(
  Component: ComponentType<P>,
  options: StoryOptions = {},
): (() => TestStoryType<P>) => {
  return () => {
    const { getRenderCount, setProps, unmount, snapshotState, result } = start(Component, options);

    const snapshot = expect(snapshotState).toMatchSnapshot;
    const setDiffState = (diff: Partial<SnapshotSectionRecord<boolean>> = {}) => {
      Object.assign(snapshotState.diff, diff);
    };

    return {
      ...pseudoEventTarget,
      setProps,
      unmount,
      snapshot,
      setDiffState,
      getRenderCount,
      result,
    };
  };
};

createTestStory.monolith = <P extends object>(
  Component: ComponentType<P>,
  options: StoryOptions = {},
): (() => TestStoryType<P> & { finish: () => void }) => {
  return () => {
    const { getRenderCount, setProps, unmount, snapshotState, result } = start(Component, options);
    snapshotState.isMonolith = true;

    const monolithSnapshotState: MonolithSnapshotState = {
      [MONOLITH_SNAPSHOT]: true,
      list: [],
    };

    const snapshot = () => {
      monolithSnapshotState.list.push(serialize(snapshotState));
      return snapshotState;
    };
    const setDiffState = (diff: Partial<SnapshotSectionRecord<boolean>> = {}) => {
      Object.assign(snapshotState.diff, diff);
    };

    const finish = expect(monolithSnapshotState).toMatchSnapshot;

    return {
      ...pseudoEventTarget,
      setProps,
      unmount,
      snapshot,
      setDiffState,
      getRenderCount,
      result,
      finish,
    };
  };
};

export default createTestStory;

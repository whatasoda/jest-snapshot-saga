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
  let dispatchProps = (null as unknown) as Dispatch<P | null>;

  const StoryComponent: FunctionComponent = () => {
    const [props, setProps] = useState<P | null>(null);
    useEffect(() => {
      dispatchProps = setProps;
    }, []);

    if (!props) return null;
    return <Injected {...props} />;
  };

  const setProps = (props: P) => {
    act(() => dispatchProps(props));
  };

  const unmount = () => {
    act(() => dispatchProps(null));
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
    const general = start(Component, options);

    const snapshot = expect(general.snapshotState).toMatchSnapshot;
    const setDiffState = (diff: Partial<SnapshotSectionRecord<boolean>> = {}) => {
      Object.assign(general.snapshotState.diff, diff);
    };

    return { ...pseudoEventTarget, ...general, snapshot, setDiffState };
  };
};

createTestStory.monolith = <P extends object>(
  Component: ComponentType<P>,
  options: StoryOptions = {},
): (() => TestStoryType<P> & { finish: () => void }) => {
  return () => {
    const general = start(Component, options);
    general.snapshotState.isMonolith = true;

    const monolithSnapshotState: MonolithSnapshotState = {
      [MONOLITH_SNAPSHOT]: true,
      list: [],
    };

    const snapshot = () => {
      monolithSnapshotState.list.push(serialize(general.snapshotState));
      return general.snapshotState;
    };
    const setDiffState = (diff: Partial<SnapshotSectionRecord<boolean>> = {}) => {
      Object.assign(general.snapshotState.diff, diff);
    };

    const finish = expect(monolithSnapshotState).toMatchSnapshot;

    return { ...pseudoEventTarget, ...general, snapshot, setDiffState, finish };
  };
};

export default createTestStory;

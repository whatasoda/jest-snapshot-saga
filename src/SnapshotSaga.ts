import React, { ComponentType } from 'react';
import { render } from '@testing-library/react';
import { SAGA_ELEMENT, SAGA_ROOT } from './utils/symbols';
import {
  SagaOptions,
  SnapshotSagaType,
  SagaElementSnapshotState,
  SnapshotSectionRecord,
  SagaRootSnapshotState,
} from './decls';
import serialize from './serialize';
import pseudoEventTarget from './mock/pseudoEventTarget';
import SagaHOC from './SagaHOC';

const SnapshotSaga = <P extends object>(
  Component: ComponentType<P>,
  { Provider, functions }: SagaOptions = {},
): (() => SnapshotSagaType<P>) => {
  return () => {
    const Saga = SagaHOC(Component);
    const { getRenderCount, setProps, unmount } = Saga;

    const result = render(React.createElement(Saga), { wrapper: Provider });
    const elementState: SagaElementSnapshotState = {
      [SAGA_ELEMENT]: true,
      root: result.container,
      getRenderCount,
      functions: functions ? functions.filter(jest.isMockFunction) : [],
      prev: { elements: '', functions: '', styles: '' },
      diff: { elements: false, functions: false, styles: false },
    };

    const rootState: SagaRootSnapshotState = {
      [SAGA_ROOT]: true,
      snapshots: [],
    };

    const snapshot = (description?: string) => {
      rootState.snapshots.push(serialize({ ...elementState, description }));
    };
    const setDiffState = (diff: Partial<SnapshotSectionRecord<boolean>> = {}) => {
      Object.assign(elementState.diff, diff);
    };

    const finish = expect(rootState).toMatchSnapshot;

    return { ...pseudoEventTarget, result, getRenderCount, setProps, unmount, snapshot, setDiffState, finish };
  };
};

export default SnapshotSaga;

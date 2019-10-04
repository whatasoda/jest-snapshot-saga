import React, { useMemo, useEffect, ComponentType } from 'react';
import { MOCK_ELEMENT } from '../utils/symbols';
import {
  MockComponentOptions,
  MockComponentType,
  MockElementType,
  MockElementSnapshotState,
  MockEffectCallback,
} from '../decls';
import pseudoEventTarget from './pseudoEventTarget';

const nameList: string[] = [];
const countMap: Record<string, number> = {};

beforeEach(() => {
  nameList.forEach(displayName => {
    countMap[displayName] = 0;
  });
});

const createMockComponent = <C extends ComponentType<any>>(name: string, options: MockComponentOptions = {}) => {
  type P = C extends ComponentType<infer P> ? P : never;
  const displayName = `MockComponent ${name}`;
  nameList.push(displayName);
  countMap[displayName] = 0;
  let effectCallback: MockEffectCallback<P> | null = null;

  const MockComponent: MockComponentType<P> = props => {
    // mock components must not re-render by any operations but when being passed new props
    const { ref, updateSnapshotState, order } = useMemo(() => {
      const order = countMap[displayName]++;
      let current: MockElementType | null = null;
      let snapshotState: MockElementSnapshotState = null as any;

      const ref = (elem: MockElementType | null) => {
        current = elem;
        updateSnapshotState();
      };

      const updateSnapshotState = (next: MockElementSnapshotState = snapshotState) => {
        snapshotState = next;
        if (!current) return;
        current[MOCK_ELEMENT] = snapshotState;
      };

      return { ref, updateSnapshotState, order };
    }, []);

    const { children: reactChildren, className, ...rest } = props;
    updateSnapshotState({ displayName, options, props: rest, reactChildren });

    useEffect(() => {
      if (effectCallback) return effectCallback(props, { order, ...pseudoEventTarget });
    });

    return (
      <div
        className={className} // provide className for jest-styled-components
        children={reactChildren} // evaluate children as normally
        ref={ref}
      />
    );
  };

  MockComponent.mockEffect = (next: MockEffectCallback<P> | null) => {
    effectCallback = next;
    return MockComponent;
  };

  return MockComponent;
};

export default createMockComponent;

import SnapshotSaga, { createMockComponent } from '../../src';

const Counter = createMockComponent<typeof import('../components/functional/Counter').default>('Counter');
jest.mock('../components/functional/Counter.tsx', () => Counter);

import CounterContainer from '../containers/functional/CounterContainer';

describe('Counter with mock component', () => {
  Counter.mockEffect(({ increment }, { setEventListener, order }) => {
    setEventListener(`${order}: increment`, increment);
  });
  const setDozen = jest.fn().mockName('setDozen');

  const start = SnapshotSaga(CounterContainer, {
    functions: [setDozen],
  });

  it('render', () => {
    const saga = start();
    saga.snapshot();

    saga.setProps({ setDozen });
    saga.snapshot(`
      'setDozen' should be called once
    `);

    Array.from({ length: 11 }).forEach(() => {
      saga.dispatch('0: increment');
    });
    saga.snapshot(`
      'setDozen must not be called
      'length' of Conunter should be 11
      render call should be 12
    `);

    saga.dispatch('0: increment');
    saga.snapshot(`
      'setDozen' should be called once more
    `);

    saga.finish();
  });
});

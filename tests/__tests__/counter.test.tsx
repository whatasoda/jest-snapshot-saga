import SnapshotSaga from '../../src';

import CounterContainer from '../containers/functional/CounterContainer';
import { act } from '@testing-library/react';

describe('Counter', () => {
  const setDozen = jest.fn().mockName('setDozen');
  const start = SnapshotSaga(CounterContainer, {
    functions: [setDozen],
  });

  it('renders', async () => {
    const saga = start();
    saga.snapshot();

    saga.setProps({ setDozen });
    saga.snapshot();

    const button = await saga.result.findByText('Add Item');
    Array.from({ length: 11 }).forEach(() => {
      act(() => button.click());
    });
    saga.snapshot();

    act(() => button.click());
    saga.snapshot();

    saga.finish();
  });
});

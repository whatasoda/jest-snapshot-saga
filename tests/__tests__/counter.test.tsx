import createTestStory from '../../src';

import CounterContainer from '../containers/functional/CounterContainer';
import { act } from '@testing-library/react';

describe('Counter', () => {
  const setDozen = jest.fn().mockName('setDozen');
  const start = createTestStory(CounterContainer, {
    functions: [setDozen],
  });

  it('renders', async () => {
    const story = start();
    story.snapshot();

    story.setProps({ setDozen });
    story.snapshot();

    const button = await story.result.findByText('Add Item');
    Array.from({ length: 11 }).forEach(() => {
      act(() => button.click());
    });
    story.snapshot();

    act(() => button.click());
    story.snapshot();

    story.finish();
  });
});

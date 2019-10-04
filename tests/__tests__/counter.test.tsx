import createTestStory from '../../src';

import CounterContainer from '../containers/functional/CounterContainer';
import { act } from '@testing-library/react';

const setDozen = jest.fn().mockName('setDozen');
describe('Counter splitted', () => {
  const start = createTestStory(CounterContainer, {
    extraMockFunctions: [setDozen],
  });

  it('render', () => {
    const story = start();
    story.snapshot();

    story.setProps({ setDozen });
    story.snapshot();
  });
});

describe('Counter', () => {
  const start = createTestStory.monolith(CounterContainer, {
    extraMockFunctions: [setDozen],
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

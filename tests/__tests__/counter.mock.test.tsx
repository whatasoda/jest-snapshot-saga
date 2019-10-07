import createTestStory, { createMockComponent } from '../../src';

const Counter = createMockComponent<typeof import('../components/functional/Counter').default>('Counter');
jest.mock('../components/functional/Counter.tsx', () => Counter);

import CounterContainer from '../containers/functional/CounterContainer';

describe('Counter splitted with mock component', () => {
  const setDozen = jest.fn().mockName('setDozen');

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

describe('Counter with mock component', () => {
  Counter.mockEffect(({ increment }, { setEventListener, order }) => {
    setEventListener(`${order}: increment`, increment);
  });
  const setDozen = jest.fn().mockName('setDozen');

  const start = createTestStory.monolith(CounterContainer, {
    extraMockFunctions: [setDozen],
  });

  it('render', () => {
    const story = start();
    story.snapshot();

    story.setProps({ setDozen });
    story.snapshot('"setDozen" should be called once');

    Array.from({ length: 11 }).forEach(() => {
      story.dispatch('0: increment');
    });
    story.snapshot('"setDozen" must not be called');

    story.dispatch('0: increment');
    story.snapshot('"setDozen" should be called once more');

    story.finish();
  });
});

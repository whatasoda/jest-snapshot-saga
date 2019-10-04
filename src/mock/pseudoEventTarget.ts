import { act } from '@testing-library/react';
import { PseudoEventTarget, PseudoEventListener } from '../decls';

type PseudoEventHandler = (acc: PseudoEventHandler[]) => PseudoEventHandler[];

const listenerMap = new Map<string, PseudoEventListener>();
const seriesMap = new Map<string, PseudoEventHandler[]>();
const cbToHandler = new Map<() => void, PseudoEventHandler>();

beforeEach(() => {
  listenerMap.clear();
  seriesMap.clear();
  cbToHandler.clear();
});

const pseudoEventTarget: PseudoEventTarget = {
  setEventListener: (type, listener, options = {}) => {
    const { once } = options;
    if (listener) {
      listenerMap.set(type, () => {
        listener();
        if (once) pseudoEventTarget.setEventListener(type, null, options);
      });
    } else {
      listenerMap.delete(type);
    }
  },
  addEventListener: (type, listener, options = {}) => {
    const { once } = options;
    const series = seriesMap.get(type) || [];
    if (!Array.isArray(series)) return;

    const handler =
      cbToHandler.get(listener) ||
      (acc => {
        listener();
        if (once) {
          pseudoEventTarget.removeEventListener(type, listener, options);
        } else {
          acc.push(handler);
        }
        return acc;
      });
    cbToHandler.set(listener, handler);

    seriesMap.set(type, [...series, handler]);
  },
  removeEventListener: (type, listener) => {
    const handler = cbToHandler.get(listener);
    if (!handler) return;
    cbToHandler.delete(listener);

    const series = seriesMap.get(type);
    if (!series) return;

    const index = series.indexOf(handler);
    if (index === -1) return;
    series.splice(index, 1);
  },
  dispatch: (type: string) => {
    const listener = listenerMap.get(type);
    const series = seriesMap.get(type);
    if (typeof listener !== 'function' && !Array.isArray(series)) return;

    act(() => {
      if (typeof listener === 'function') {
        listener();
      }

      if (Array.isArray(series)) {
        const next = series.reduce<PseudoEventHandler[]>((acc, handler) => handler(acc), []);

        if (next.length) {
          seriesMap.set(type, next);
        } else {
          seriesMap.delete(type);
        }
      }
    });
  },
};

export default pseudoEventTarget;

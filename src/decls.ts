import { MOCK_ELEMENT, SAGA_ELEMENT, SAGA_ROOT } from './utils/symbols';

export type SnapshotType = 'FULL' | 'DIFF';

export type RenderResult = import('@testing-library/react').RenderResult<typeof import('@testing-library/dom/queries')>;

type PrinterParams = Parameters<import('pretty-format').NewPlugin['serialize']>;
type CustomParams<T, U extends PrinterParams = PrinterParams> = {
  [I in keyof U]: I extends '0' ? T : U[I];
};
export type CustomPrint<T extends any, U = string> = (...args: CustomParams<T>) => U;

export interface SagaOptions {
  Provider?: React.ComponentType;
  functions?: jest.Mock[];
}
export interface SnapshotSagaType<P extends object> extends PseudoEventTarget {
  result: RenderResult;
  setProps: React.Dispatch<P>;
  unmount: () => void;
  snapshot: (description?: string) => void;
  finish: (snapshotName?: string) => SagaRootSnapshotState;
  setDiffState: (diff?: Partial<SnapshotSectionRecord<boolean>>) => void;
  getRenderCount: () => number;
}

export type PseudoEventListener = () => void;

export interface PseudoEventTarget {
  setEventListener(type: string, cb: PseudoEventListener | null, options?: PseudoEventListenerOptions): void;
  addEventListener(type: string, cb: PseudoEventListener, options?: PseudoEventListenerOptions): void;
  removeEventListener(type: string, cb: PseudoEventListener, options?: PseudoEventListenerOptions): void;
  dispatch(type: string): void;
}

export interface PseudoEventListenerOptions {
  once?: boolean;
}

export interface MockComponentOptions {
  ignoreChildren?: boolean;
}

export interface MockComponentType<P extends object> {
  (params: P): ReturnType<React.FunctionComponent>;
  mockEffect: (next: MockEffectCallback<P>) => MockComponentType<P>;
}

export type MockEffectCallback<P extends object> = (
  props: P,
  utils: MockEffectUtil,
) => ReturnType<React.EffectCallback>;
export interface MockEffectUtil extends PseudoEventTarget {
  order: number;
}
export interface MockElementType extends HTMLDivElement, Record<MOCK_ELEMENT, MockElementSnapshotState> {}
export interface MockElementSnapshotState {
  displayName: string;
  options: MockComponentOptions;
  reactChildren: any;
  props: any;
}

export type SnapshotSectionKey = 'functions' | 'styles' | 'elements';
export type SnapshotSectionRecord<T> = Record<SnapshotSectionKey, T>;

export interface SagaElementSnapshotState extends Record<SAGA_ELEMENT, true> {
  root: HTMLElement;
  functions: jest.Mock[];
  description?: string;
  getRenderCount: () => number;
  prev: SnapshotSectionRecord<string>;
  diff: SnapshotSectionRecord<boolean>;
}

export interface SagaRootSnapshotState extends Record<SAGA_ROOT, true> {
  snapshots: string[];
}

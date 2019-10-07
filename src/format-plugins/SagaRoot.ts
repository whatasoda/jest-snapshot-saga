import prettyFormat from 'pretty-format';
import { SAGA_ROOT } from '../utils/symbols';
import { SagaRootSnapshotState } from '../decls';
import { trimEmptyLines } from '../utils/format';

const label = (name: string | number) => `<< ${name} `.padEnd(48, '<');

const SagaRoot: prettyFormat.NewPlugin = {
  test: val => val && val[SAGA_ROOT],
  serialize: (state: SagaRootSnapshotState, _, indentation) => {
    return (
      state.snapshots
        .map((currentSnapshot, i) => {
          const curr = trimEmptyLines(currentSnapshot);
          return `${indentation}${label(i)}\n\n${curr}\n`;
        })
        .join('\n') + `\n${indentation}${label('END')}`
    );
  },
};

export default SagaRoot;

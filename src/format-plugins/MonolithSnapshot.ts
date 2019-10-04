import prettyFormat from 'pretty-format';
import { MONOLITH_SNAPSHOT } from '../utils/symbols';
import { MonolithSnapshotState } from '../decls';
import { trimEmptyLines } from '../utils/format';

const label = (name: string | number) => `<< ${name} `.padEnd(48, '<');

const MonolithSnapshot: prettyFormat.NewPlugin = {
  test: val => val && val[MONOLITH_SNAPSHOT],
  serialize: (state: MonolithSnapshotState, _, indentation) => {
    return (
      state.list
        .map((currentSnapshot, i) => {
          const curr = trimEmptyLines(currentSnapshot);
          return `${indentation}${label(i)}\n\n${curr}\n`;
        })
        .join('\n') + `\n${indentation}${label('END')}`
    );
  },
};

export default MonolithSnapshot;

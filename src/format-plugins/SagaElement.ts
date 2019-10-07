import prettyFormat from 'pretty-format';
import { SAGA_ELEMENT } from '../utils/symbols';
import { SagaElementSnapshotState, SnapshotSectionKey } from '../decls';
import diff from '../utils/diff';
import { trimEmptyLines, setIndent } from '../utils/format';
import printMockFunctions from './print/printMockFunctions';
import printElements from './print/printElements';

const label = (name: string) => `>>>>>> ${name} `.padEnd(32, '>');
const waveHorizon = '~'.repeat(48);

const SagaElement: prettyFormat.Plugin = {
  test: val => val && val[SAGA_ELEMENT],
  serialize: (state: SagaElementSnapshotState, config, indentation, depth, refs, printer) => {
    indentation += config.indent;
    const childIndentation = indentation + config.indent;
    const { description = '', getRenderCount } = state;

    const functions = printMockFunctions(state.functions, config, childIndentation, depth, refs, printer);
    const [styles, elements] = printElements(state.root, config, childIndentation, depth, refs, printer);

    type EntryUnion = { [K in SnapshotSectionKey]: [K, string] }[SnapshotSectionKey];
    const combined = (Object.entries({ functions, styles, elements }) as EntryUnion[])
      .map<string>(([key, curr]) => {
        const prev = state.prev[key];
        state.prev[key] = curr;
        const result = state.diff[key] ? diff(prev, curr) : curr;

        return [`${indentation}${label(key)}`, result ? `\n${result}\n` : `${childIndentation}/* none */`].join('\n');
      })
      .join('\n');

    const wave = `${indentation}${waveHorizon}`;

    const header = [
      description ? [wave, setIndent(trimEmptyLines(description), childIndentation), wave, ''].join('\n') : '',
      `${indentation}render call: ${getRenderCount()} in total`,
    ].join('\n');
    const snapshot = `${header}\n${trimEmptyLines(combined)}`;
    return trimEmptyLines(snapshot);
  },
};

export default SagaElement;

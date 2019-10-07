import prettyFormat from 'pretty-format';
import { printListItems } from 'pretty-format/build/collections';
import 'jest-styled-components'; // this line applies internal implementation to jest
import { styleSheetSerializer } from 'jest-styled-components/serializer';
import { getMockSnapshotEntriesByOrder } from '../utils/collectors';
import { SAGA_ELEMENT } from '../utils/symbols';
import { SagaElementSnapshotState, CustomPrint, SnapshotSectionKey } from '../decls';
import diff from '../utils/diff';
import { trimEmptyLines, addIndent, setIndent } from '../utils/format';

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

const printElements: CustomPrint<HTMLElement, [string, string]> = (root, config, indentation, depth, refs, printer) => {
  const raw = styleSheetSerializer.print(
    root,
    val => printer(val, config, indentation, depth, refs),
    i => i + config.indent,
    { spacing: config.spacingInner, edgeSpacing: config.spacingOuter, min: config.min },
    {} as any,
  );
  const tag = root.tagName.toLowerCase();

  if (raw === `<${tag} />`) return ['', ''];

  const [rawElements = '', styles = ''] = raw
    .trimRight()
    .slice(0, -`\n</${tag}>`.length)
    .split(new RegExp(`(^|\\n)<${tag}>\\n`))
    .filter(s => s.trim())
    .reverse(); // to support components without styled-component

  const elements = rawElements && [`${indentation}<ROOT>`, rawElements.trimRight(), `${indentation}</ROOT>`].join('\n');
  const stlyes = addIndent(styles.trim(), indentation);
  return [stlyes, elements];
};

const printMockFunctions: CustomPrint<jest.Mock[]> = (functions, config, indentation, depth, refs, printer) => {
  const childConfig: prettyFormat.Config = { ...config, min: true };

  const mockFunctions = getMockSnapshotEntriesByOrder(functions, true)
    .map<string>(({ displayName, call, type, value }, i) => {
      const args = call.length
        ? printListItems(call, childConfig, indentation, depth, refs, printer)
        : '/* no arguments */';
      const result = type === 'incomplete' ? 'none' : printer(value, config, indentation, depth, refs);

      return [
        `${indentation}${displayName} /* #${i} */ (`,
        trimEmptyLines(args),
        `${indentation}) /* ${type} */ => (${result})`,
      ].join('\n');
    })
    .join('\n\n');
  return mockFunctions;
};

export default SagaElement;
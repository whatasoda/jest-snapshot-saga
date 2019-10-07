import 'jest-styled-components'; // this line applies internal implementation to jest
import { styleSheetSerializer } from 'jest-styled-components/serializer';
import { CustomPrint } from '../../decls';
import { addIndent } from '../../utils/format';

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

export default printElements;

import prettyFormat from 'pretty-format';
import { printChildren, printElement, printProps } from 'pretty-format/build/plugins/lib/markup';
import { getReactChildren, getDOMChildren } from '../utils/collectors';
import { MOCK_ELEMENT } from '../utils/symbols';
import { MockElementType } from '../decls';

const { DOMElement } = prettyFormat.plugins;

const MockElement: prettyFormat.Plugin = {
  test: val => DOMElement.test(val) && val[MOCK_ELEMENT],
  serialize: (node: MockElementType, config, indentation, depth, refs, printer) => {
    const { displayName, options, props, reactChildren } = node[MOCK_ELEMENT];
    if (node.className) {
      props.className = node.className;
    }

    const nextIndent = indentation + config.indent;
    const DOMChildren = getDOMChildren(node);
    return printElement(
      displayName,
      printProps(Object.keys(props), props, config, nextIndent, depth, refs, printer),
      options.ignoreChildren
        ? ''
        : printChildren(
            DOMChildren.length ? DOMChildren : getReactChildren(reactChildren),
            config,
            nextIndent,
            depth,
            refs,
            printer,
          ),
      config,
      indentation,
    );
  },
};

export default MockElement;

import prettyFormat from 'pretty-format';
import { printListItems } from 'pretty-format/build/collections';
import { CustomPrint } from '../../decls';
import { trimEmptyLines } from '../../utils/format';

interface MockSnapshotEntry {
  order: number;
  displayName: string;
  call: any[];
  type: jest.MockResult<any>['type'] | 'instance';
  value: any;
}

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

const getMockSnapshotEntriesByOrder = (functions: jest.Mock[], mockClear?: boolean) => {
  return functions.reduce<MockSnapshotEntry[]>((acc, func) => {
    const displayName = func.getMockName();
    const { invocationCallOrder, calls, results, instances } = func.mock;

    const entries = invocationCallOrder.map<MockSnapshotEntry>((order, i) => {
      const { type, value } = results[i];
      const instance = instances[i];
      const didConstruct = instance instanceof func;
      return {
        order,
        displayName,
        call: calls[i],
        type: didConstruct ? 'instance' : type,
        value: didConstruct ? instance : value,
      };
    });

    if (acc.length) {
      entries.forEach(entry => {
        const index = acc.findIndex(({ order }) => order > entry.order);
        if (index === -1) {
          acc.push(entry);
        } else {
          acc.splice(index, 0, entry);
        }
      });
    } else {
      acc.push(...entries);
    }

    if (mockClear) func.mockClear();
    return acc;
  }, []);
};

export default printMockFunctions;

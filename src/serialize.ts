import { addSerializer, getSerializers, utils } from 'jest-snapshot';
import MockElement from './format-plugins/MockElement';
import MockFunction from './format-plugins/MockFuntion';
import TestStoryRoot from './format-plugins/TestStoryRoot';
import MonolithSnapshot from './format-plugins/MonolithSnapshot';
import { styleSheetSerializer } from 'jest-styled-components/serializer';

const { addSnapshotSerializer } = expect;
const addSerializerCustom: typeof addSerializer = plugin => {
  addSerializer(plugin);
  addSnapshotSerializer(plugin);
};
expect.addSnapshotSerializer = addSerializerCustom;

expect.addSnapshotSerializer(MockElement);
expect.addSnapshotSerializer(MockFunction);
expect.addSnapshotSerializer(TestStoryRoot);
expect.addSnapshotSerializer(MonolithSnapshot);
if (!getSerializers().includes(styleSheetSerializer)) {
  expect.addSnapshotSerializer(styleSheetSerializer);
}

const serialize = (utils.serialize as unknown) as (val: any) => string;

export default serialize;

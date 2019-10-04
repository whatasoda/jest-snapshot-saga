declare namespace jest {
  interface Expect {
    addSnapshotSerializer(serializer: import('pretty-format').Plugin): void;
  }
}

declare module 'jest-styled-components/serializer' {
  type OldPlugin = Exclude<import('pretty-format').Plugin, import('pretty-format').NewPlugin>;
  export const styleSheetSerializer: OldPlugin;
}

# jest-snapshot-saga

:rotating_light: **This library is NOT an alternative for E2E test.** :rotating_light:

`jest-snapshot-sage` is a utility library for testing complex react components, especially whose feature required to operate beyond re-rendering.

**Do keep watching snapshots and assess the changes are acceptable.**
**Only what `jest-snapshot-saga` does is catching the changes in behavior.**

## Basic Idea

Incidents which developers have to catch could be categorized as external and internal factors. In the case of React components, external ones are from browser and backend, and internal ones are the implementation itself of components. For external ones, we should use E2E test. But we can treat most internal factors without E2E.

The first step to catch incidents from internal factors is to keep watching the changes of component behaviors. If we know all the changes, we can judge whether they cause incidents. `jest-snapshot-saga` helps you to watch them via including almost all of the behaviors of a component to snapshot.

Since `jest-snapshot-saga` requires developers to assess snapshots correctly, it may not work with individuals or some teams, who have no code review. However, if you have enough reviews, you can reduce the cost of testing because you need no more assertion parts in test files. Also, you get another convenience in code review, that you can see behaviors of components in GitHub.

## Usage
```sh
npm i -D jest-snapshot-saga jest @testing-library/react
npm i react react-dom styled-components
```

## Development
TBD


## LICENSE

[MIT](https://github.com/whatasoda/jest-snapshot-saga/blob/master/LICENSE)

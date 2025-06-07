const { helloWorld } = require('../dist/index.js');

test('helloWorld returns correct greeting', () => {
  const result = helloWorld();
  expect(result).toBe('Hello World from fontwidth!');
});

test('helloWorld returns a string', () => {
  const result = helloWorld();
  expect(typeof result).toBe('string');
});
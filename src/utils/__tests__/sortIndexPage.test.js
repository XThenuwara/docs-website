import sortIndexPage from '../sortIndexPage';

const NAV_1 = [
  'title: Test',
  'path: /test',
  'pages:',
  '  - title: Baz',
  '    path: /test/baz',
  '  - title: Foo',
  '    path: /test/foo',
  '  - title: Bar',
  '    path: /test/bar',
].join('\n');

const NAV_2 = [
  'title: Another Test',
  'path: /another-test',
  'pages:',
  '  - title: Oranges',
  '    path: /another-test/oranges',
  '  - title: Apples',
  '    path: /another-test/apples',
  '  - title: Pumpkin',
  '    path: /another-test/pumpkin',
].join('\n');

const h2 = (text) => `<h2>${text}</h2>`;
const li = (parent) => (text) =>
  `<li><a href="/${parent}/${text.toLowerCase()}">${text}</a></li>`;
const ul = (parent, ...lis) => `<ul>${lis.map(li(parent)).join('')}</ul>`;

test('[wihtout nav] should sort lists alphabetically', async () => {
  const html = h2('Test') + ul('test', 'Foo', 'Bar', 'Baz');
  const expected = h2('Test') + ul('test', 'Bar', 'Baz', 'Foo');

  const { contents: actual } = await sortIndexPage(html).process(html);
  expect(actual).toEqual(expected);
});

test('[witout nav] should sort categories alphabetically', async () => {
  const html = [
    h2('Test'),
    ul('test', 'Foo', 'Bar', 'Baz'),
    h2('Another Test'),
    ul('another-test', 'Pumpkin', 'Apples', 'Oranges'),
  ].join('');

  const expected = [
    h2('Another Test'),
    ul('another-test', 'Apples', 'Oranges', 'Pumpkin'),
    h2('Test'),
    ul('test', 'Bar', 'Baz', 'Foo'),
  ].join('');

  const { contents: actual } = await sortIndexPage(html).process(html);
  expect(actual).toEqual(expected);
});

test('[with nav] should sort lists by navigation', async () => {
  const html = h2('Test') + ul('test', 'Foo', 'Bar', 'Baz');
  const expected = h2('Test') + ul('test', 'Baz', 'Foo', 'Bar');

  const { contents: actual } = await sortIndexPage(html, [NAV_1]).process(html);
  expect(actual).toEqual(expected);
});

test('[with nav] should sort categories by navigation', async () => {
  const html = [
    h2('Another Test'),
    ul('another-test', 'Pumpkin', 'Apples', 'Oranges'),
    h2('Test'),
    ul('test', 'Foo', 'Bar', 'Baz'),
  ].join('');

  const expected = [
    h2('Test'),
    ul('test', 'Baz', 'Foo', 'Bar'),
    h2('Another Test'),
    ul('another-test', 'Oranges', 'Apples', 'Pumpkin'),
  ].join('');

  const { contents: actual } = await sortIndexPage(html, [
    NAV_1,
    NAV_2,
  ]).process(html);
  expect(actual).toEqual(expected);
});

test('[with partial nav] should sort lists alphabetically and then by navigation', async () => {
  const html = h2('Test') + ul('test', 'Foo', 'Zed', 'Bar', 'Baz');
  const expected = h2('Test') + ul('test', 'Baz', 'Foo', 'Bar', 'Zed');

  const { contents: actual } = await sortIndexPage(html, [
    NAV_1,
    NAV_2,
  ]).process(html);
  expect(actual).toEqual(expected);
});

test('[with partial nav] should sort categories alphabetically and then by navigation', async () => {
  const html = [
    h2('Another Test'),
    ul('another-test', 'Pumpkin', 'Zed', 'Apples', 'Oranges'),
    h2('Test'),
    ul('test', 'Wow', 'Cool', 'Foo', 'Bar', 'Baz'),
  ].join('');

  const expected = [
    h2('Test'),
    ul('test', 'Baz', 'Foo', 'Bar', 'Cool', 'Wow'),
    h2('Another Test'),
    ul('another-test', 'Oranges', 'Apples', 'Pumpkin', 'Zed'),
  ].join('');

  const { contents: actual } = await sortIndexPage(html, [
    NAV_1,
    NAV_2,
  ]).process(html);
  expect(actual).toEqual(expected);
});

test('should throw without arguments', async () => {
  expect.assertions(1);
  try {
    await sortIndexPage();
  } catch (e) {
    expect(e).toEqual(Error('Missing arguments'));
  }
});

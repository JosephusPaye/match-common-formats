// @ts-check

import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { matchUri } from '../';

function filterTestCases(cases) {
  let filtered = cases.filter((c) => c.only);

  if (filtered.length === 0) {
    filtered = cases;
  }

  return filtered;
}

test('matchUri() returns null for empty and whitespace-only input', () => {
  const cases = [
    {
      input: '',
      expected: null,
    },
    {
      input: '  ',
      expected: null,
    },
    {
      input: ' \r\n ',
      expected: null,
    },
  ];

  for (const testCase of filterTestCases(cases)) {
    assert.equal(
      matchUri(testCase.input),
      testCase.expected,
      `matches ${testCase.input} correctly`
    );
  }
});

test('matchUri() matches URNs', () => {
  const cases = [
    {
      input: 'urn:',
      expected: null,
    },
    {
      input: 'urn:oasis:names:specification:docbook:dtd:xml:4.1.2',
      expected: {
        type: 'urn',
        label: 'oasis URN',
        matched: 'urn:oasis:names:specification:docbook:dtd:xml:4.1.2',
        urn: 'urn:oasis:names:specification:docbook:dtd:xml:4.1.2',
        namespaceId: 'oasis',
        namespaceString: 'names:specification:docbook:dtd:xml:4.1.2',
      },
    },
    {
      input: 'urn:isbn:0451450523',
      expected: {
        type: 'urn',
        label: 'isbn URN',
        matched: 'urn:isbn:0451450523',
        urn: 'urn:isbn:0451450523',
        namespaceId: 'isbn',
        namespaceString: '0451450523',
      },
    },
  ];

  for (const testCase of filterTestCases(cases)) {
    assert.equal(
      matchUri(testCase.input),
      testCase.expected,
      `matches ${testCase.input} correctly`
    );
  }
});

test('matchUri() matches URLs', () => {
  const cases = [
    {
      input: 'example',
      expected: null,
    },
    {
      input: 'example.unknowntld',
      expected: null,
    },
    {
      input: '/example',
      expected: null,
    },
    {
      input: '/example.com',
      expected: null,
    },
    {
      input: '//example',
      expected: null,
    },
    {
      input: '//example.com',
      expected: null,
    },
    {
      input: 'http://',
      expected: null,
    },
    {
      input: 'example.local',
      expected: {
        type: 'url',
        label: 'Web URL',
        matched: 'example.local',
        url: 'http://example.local',
        scheme: 'http',
      },
    },
    {
      input: 'localhost',
      expected: {
        type: 'url',
        label: 'Web URL',
        matched: 'localhost',
        url: 'http://localhost',
        scheme: 'http',
      },
    },
    {
      input: 'localhost:2000/path/to/resource.html?s=query#fragment',
      expected: {
        type: 'url',
        label: 'Web URL',
        matched: 'localhost:2000/path/to/resource.html?s=query#fragment',
        url: 'http://localhost:2000/path/to/resource.html?s=query#fragment',
        scheme: 'http',
      },
    },
    {
      input:
        'sub-b.sub-a.localhost:2000/path/to/resource.html?s=query#fragment',
      expected: {
        type: 'url',
        label: 'Web URL',
        matched:
          'sub-b.sub-a.localhost:2000/path/to/resource.html?s=query#fragment',
        url:
          'http://sub-b.sub-a.localhost:2000/path/to/resource.html?s=query#fragment',
        scheme: 'http',
      },
    },
    {
      input: 'example.com',
      expected: {
        type: 'url',
        label: 'Web URL',
        matched: 'example.com',
        url: 'http://example.com',
        scheme: 'http',
      },
    },
    {
      input: 'example.com:2000/path/to/resource.html?s=query#fragment',
      expected: {
        type: 'url',
        label: 'Web URL',
        matched: 'example.com:2000/path/to/resource.html?s=query#fragment',
        url: 'http://example.com:2000/path/to/resource.html?s=query#fragment',
        scheme: 'http',
      },
    },
    {
      input:
        'sub-b.sub-a.example.com:2000/path/to/resource.html?s=query#fragment',
      expected: {
        type: 'url',
        label: 'Web URL',
        matched:
          'sub-b.sub-a.example.com:2000/path/to/resource.html?s=query#fragment',
        url:
          'http://sub-b.sub-a.example.com:2000/path/to/resource.html?s=query#fragment',
        scheme: 'http',
      },
    },
    {
      input: 'HTTP://example.com',
      expected: {
        type: 'url',
        label: 'Web URL',
        matched: 'HTTP://example.com',
        url: 'HTTP://example.com',
        scheme: 'http',
      },
    },
    {
      input:
        'http://username:password@b.a.example.com/path/to/resource.html?s=query#fragment',
      expected: {
        type: 'url',
        label: 'Web URL',
        matched:
          'http://username:password@b.a.example.com/path/to/resource.html?s=query#fragment',
        url:
          'http://username:password@b.a.example.com/path/to/resource.html?s=query#fragment',
        scheme: 'http',
      },
    },
    {
      input: 'HTTPS://example.com',
      expected: {
        type: 'url',
        label: 'Web URL',
        matched: 'HTTPS://example.com',
        url: 'HTTPS://example.com',
        scheme: 'https',
      },
    },
    {
      input:
        'https://username:password@b.a.example.com/path/to/resource.html?s=query#fragment',
      expected: {
        type: 'url',
        label: 'Web URL',
        matched:
          'https://username:password@b.a.example.com/path/to/resource.html?s=query#fragment',
        url:
          'https://username:password@b.a.example.com/path/to/resource.html?s=query#fragment',
        scheme: 'https',
      },
    },
    {
      input: 'ftp://user:password@127.0.0.1',
      expected: {
        type: 'url',
        label: 'ftp URL',
        matched: 'ftp://user:password@127.0.0.1',
        url: 'ftp://user:password@127.0.0.1',
        scheme: 'ftp',
      },
    },
    {
      input: 'telnet://192.0.2.16:80/',
      expected: {
        type: 'url',
        label: 'telnet URL',
        matched: 'telnet://192.0.2.16:80/',
        url: 'telnet://192.0.2.16:80/',
        scheme: 'telnet',
      },
    },
    {
      input: 'ldap://[2001:db8::7]/c=GB?objectClass?one',
      expected: {
        type: 'url',
        label: 'ldap URL',
        matched: 'ldap://[2001:db8::7]/c=GB?objectClass?one',
        url: 'ldap://[2001:db8::7]/c=GB?objectClass?one',
        scheme: 'ldap',
      },
    },
  ];

  for (const testCase of filterTestCases(cases)) {
    assert.equal(
      matchUri(testCase.input),
      testCase.expected,
      `matches ${testCase.input} correctly`
    );
  }
});

test('matchUri() matches URIs', () => {
  const cases = [
    {
      input: 'data:',
      expected: null,
    },
    {
      input:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
      expected: {
        type: 'uri',
        label: 'data URI',
        matched:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
        uri:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
        scheme: 'data',
      },
    },
    {
      input: 'magnet:?xt=urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a',
      expected: {
        type: 'uri',
        label: 'magnet URI',
        matched: 'magnet:?xt=urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a',
        uri: 'magnet:?xt=urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a',
        scheme: 'magnet',
      },
    },
    {
      input: 'mailto:User.Name@example.com',
      expected: {
        type: 'uri',
        label: 'mailto URI',
        matched: 'mailto:User.Name@example.com',
        uri: 'mailto:User.Name@example.com',
        scheme: 'mailto',
      },
    },
    {
      input: 'tel:+1-816-555-1212',
      expected: {
        type: 'uri',
        label: 'tel URI',
        matched: 'tel:+1-816-555-1212',
        uri: 'tel:+1-816-555-1212',
        scheme: 'tel',
      },
    },
    {
      input: 'news:comp.infosystems.www.servers.unix',
      expected: {
        type: 'uri',
        label: 'news URI',
        matched: 'news:comp.infosystems.www.servers.unix',
        uri: 'news:comp.infosystems.www.servers.unix',
        scheme: 'news',
      },
    },
  ];

  for (const testCase of filterTestCases(cases)) {
    assert.equal(
      matchUri(testCase.input),
      testCase.expected,
      `matches ${testCase.input} correctly`
    );
  }
});

test.run();

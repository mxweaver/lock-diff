import { describe, it, expect } from 'vitest';
import { diff } from '../lib.js';

describe('diff', () => {
  it('returns an empty object when given two empty objects', () => {
    const oldLock = {
      dependencies: {},
    };

    const newLock = {
      dependencies: {},
    };

    const changes = diff(oldLock, newLock);

    expect(changes).toEqual({});
  });

  it('returns the correct old versions for each dependency', () => {
    const oldLock = {
      dependencies: {
        'a': { version: '0.0.1' },
        'b': { version: '0.0.2' },
        'c': { version: '0.0.3' },
      },
    };

    const newLock = {
      dependencies: {},
    };

    const changes = diff(oldLock, newLock);

    expect(changes).toEqual({
      'a': ['0.0.1', null],
      'b': ['0.0.2', null],
      'c': ['0.0.3', null],
    });
  });

  it('returns the correct new versions for each dependency', () => {
    const oldLock = {
      dependencies: {},
    };

    const newLock = {
      dependencies: {
        'a': { version: '0.0.1' },
        'b': { version: '0.0.2' },
        'c': { version: '0.0.3' },
      },
    };

    const changes = diff(oldLock, newLock);

    expect(changes).toEqual({
      'a': [null, '0.0.1'],
      'b': [null, '0.0.2'],
      'c': [null, '0.0.3'],
    });
  });

  it('returns the new and old versions for each dependency', () => {
    const oldLock = {
      dependencies: {
        'a': { version: '0.0.1' },
        'b': { version: '0.0.2' },
        'c': { version: '0.0.3' },
      },
    };

    const newLock = {
      dependencies: {
        'a': { version: '0.0.4' },
        'b': { version: '0.0.5' },
        'c': { version: '0.0.6' },
      },
    };

    const changes = diff(oldLock, newLock);

    expect(changes).toEqual({
      'a': ['0.0.1', '0.0.4'],
      'b': ['0.0.2', '0.0.5'],
      'c': ['0.0.3', '0.0.6'],
    });
  });

  it('returns an entry for each added dependencies', () => {
    const oldLock = {
      dependencies: {
        'a': { version: '0.0.1' },
        'b': { version: '0.0.2' },
        'c': { version: '0.0.3' },
      },
    };

    const newLock = {
      dependencies: {
        'a': { version: '0.0.4' },
        'b': { version: '0.0.5' },
        'c': { version: '0.0.6' },
        'd': { version: '0.0.7' },
        'e': { version: '0.0.8' },
        'f': { version: '0.0.9' },
      },
    };

    const changes = diff(oldLock, newLock);

    expect(changes).toEqual({
      'a': ['0.0.1', '0.0.4'],
      'b': ['0.0.2', '0.0.5'],
      'c': ['0.0.3', '0.0.6'],
      'd': [null, '0.0.7'],
      'e': [null, '0.0.8'],
      'f': [null, '0.0.9'],
    });
  });

  it('returns an entry for each removed dependencies', () => {
    const oldLock = {
      dependencies: {
        'a': { version: '0.0.1' },
        'b': { version: '0.0.2' },
        'c': { version: '0.0.3' },
        'd': { version: '0.0.4' },
        'e': { version: '0.0.5' },
        'f': { version: '0.0.6' },
      },
    };

    const newLock = {
      dependencies: {
        'a': { version: '0.0.7' },
        'b': { version: '0.0.8' },
        'c': { version: '0.0.9' },
      },
    };

    const changes = diff(oldLock, newLock);

    expect(changes).toEqual({
      'a': ['0.0.1', '0.0.7'],
      'b': ['0.0.2', '0.0.8'],
      'c': ['0.0.3', '0.0.9'],
      'd': ['0.0.4', null],
      'e': ['0.0.5', null],
      'f': ['0.0.6', null],
    });
  });

  it('skips dependencies that did not change', () => {
    const oldLock = {
      dependencies: {
        'a': { version: '0.0.1' },
        'b': { version: '0.0.2' },
        'c': { version: '0.0.3' },
      },
    };

    const newLock = {
      dependencies: {
        'a': { version: '0.0.4' },
        'b': { version: '0.0.2' },
        'c': { version: '0.0.6' },
      },
    };

    const changes = diff(oldLock, newLock);

    expect(changes).toEqual({
      'a': ['0.0.1', '0.0.4'],
      'c': ['0.0.3', '0.0.6'],
    });
  });
});

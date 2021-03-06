import 'jest';
import createScrollSideEffect from '../src';
import { AnyResponse } from '@curi/core';

jest.useFakeTimers();

const mockScroll = jest.fn();

describe('createScrollSideEffect', () => {
  let realScrollTo = window.scrollTo;
  let realScrollIntoView = Element.prototype.scrollIntoView;

  let mockScroll;
  let mockElementScroll;

  beforeEach(() => {
    mockScroll = jest.fn();
    mockElementScroll = jest.fn();

    window.scrollTo = mockScroll;
    Element.prototype.scrollIntoView = mockElementScroll;
  });

  afterEach(() => {
    window.scrollTo = realScrollTo;
    Element.prototype.scrollIntoView = realScrollIntoView;
  });

  it('does not scroll after POP', () => {
    const sideEffect = createScrollSideEffect();
    sideEffect(<AnyResponse>{ location: {} }, 'POP');

    jest.runAllTimers();
    expect(mockScroll.mock.calls.length).toBe(0);
  });

  it('scrolls to 0 after PUSH', () => {
    const sideEffect = createScrollSideEffect();
    sideEffect({ location: {} } as AnyResponse, 'PUSH');

    jest.runAllTimers();
    expect(mockScroll.mock.calls.length).toBe(1);
  });

  it('scrolls to 0 after REPLACE', () => {
    const sideEffect = createScrollSideEffect();
    sideEffect({ location: {} } as AnyResponse, 'REPLACE');

    jest.runAllTimers();
    expect(mockScroll.mock.calls.length).toBe(1);
  });

  it('scrolls to matching element if there is a location.hash', () => {
    const div = document.createElement('div');
    div.setAttribute('id', 'test');
    document.body.appendChild(div);

    const sideEffect = createScrollSideEffect();
    sideEffect({ location: { hash: 'test' } } as AnyResponse, 'REPLACE');

    jest.runAllTimers();
    expect(mockScroll.mock.calls.length).toBe(0);
    expect(mockElementScroll.mock.calls.length).toBe(1);

    document.body.removeChild(div);
  });

  it('scrolls to top if there is location.hash but no matching element', () => {
    const sideEffect = createScrollSideEffect();
    sideEffect({ location: { hash: 'test' } } as AnyResponse, 'REPLACE');

    jest.runAllTimers();
    expect(mockScroll.mock.calls.length).toBe(1);
    expect(mockElementScroll.mock.calls.length).toBe(0);
  });

  it('scrolls to top if location.hash is empty string', () => {
    const sideEffect = createScrollSideEffect();
    sideEffect({ location: { hash: '' } } as AnyResponse, 'REPLACE');

    jest.runAllTimers();
    expect(mockScroll.mock.calls.length).toBe(1);
    expect(mockElementScroll.mock.calls.length).toBe(0);
  });
});

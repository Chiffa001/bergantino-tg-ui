import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { openTelegramLink } from '../telegram-links';

type TestWindow = {
  Telegram?: {
    WebApp?: {
      openTelegramLink?: (url: string) => void;
    };
  };
  open: ReturnType<typeof vi.fn>;
};

describe('openTelegramLink', () => {
  let originalWindow: typeof globalThis.window | undefined;
  let testWindow: TestWindow;

  beforeEach(() => {
    originalWindow = globalThis.window;
    testWindow = {
      open: vi.fn(),
    };

    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: testWindow,
    });
  });

  afterEach(() => {
    if (originalWindow === undefined) {
      Object.defineProperty(globalThis, 'window', {
        configurable: true,
        value: undefined,
      });
    } else {
      Object.defineProperty(globalThis, 'window', {
        configurable: true,
        value: originalWindow,
      });
    }
  });

  it('uses Telegram WebApp API when available', () => {
    const telegramOpenSpy = vi.fn();

    testWindow.Telegram = {
      WebApp: {
        openTelegramLink: telegramOpenSpy,
      },
    };

    openTelegramLink('https://t.me/example');

    expect(telegramOpenSpy).toHaveBeenCalledWith('https://t.me/example');
    expect(testWindow.open).not.toHaveBeenCalled();
  });

  it('falls back to window.open when Telegram WebApp API is unavailable', () => {
    openTelegramLink('https://t.me/example');

    expect(testWindow.open).toHaveBeenCalledWith(
      'https://t.me/example',
      '_blank',
      'noopener,noreferrer',
    );
  });

  it('falls back to window.open when Telegram WebApp API throws', () => {
    testWindow.Telegram = {
      WebApp: {
        openTelegramLink: () => {
          throw new Error('boom');
        },
      },
    };

    openTelegramLink('https://t.me/example');

    expect(testWindow.open).toHaveBeenCalledWith(
      'https://t.me/example',
      '_blank',
      'noopener,noreferrer',
    );
  });
});

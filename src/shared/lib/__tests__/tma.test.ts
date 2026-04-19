import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  init: vi.fn(),
  retrieveRawInitData: vi.fn(),
  sdkCleanup: vi.fn(),
  themeMount: vi.fn(),
  themeBindCssVars: vi.fn(),
  themeUnmount: vi.fn(),
  themeCssCleanup: vi.fn(),
  miniAppMount: vi.fn(),
  miniAppBindCssVars: vi.fn(),
  miniAppUnmount: vi.fn(),
  miniAppCssCleanup: vi.fn(),
  miniAppReady: vi.fn(),
  miniAppReadyIsAvailable: vi.fn(),
  viewportMount: vi.fn(),
  viewportBindCssVars: vi.fn(),
  viewportCssCleanup: vi.fn(),
  selectionChanged: vi.fn(),
  impactOccurred: vi.fn(),
}));

type TestTelegramGlobal = typeof globalThis & {
  Telegram?: {
    WebApp?: {
      HapticFeedback?: {
        impactOccurred?: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
        selectionChanged?: () => void;
      };
    };
  };
};

function getTelegramGlobal(): TestTelegramGlobal {
  return globalThis as TestTelegramGlobal;
}

vi.mock('@tma.js/sdk-svelte', () => ({
  init: mocks.init,
  miniApp: {
    bindCssVars: mocks.miniAppBindCssVars,
    mount: mocks.miniAppMount,
    ready: Object.assign(mocks.miniAppReady, {
      isAvailable: mocks.miniAppReadyIsAvailable,
    }),
    unmount: mocks.miniAppUnmount,
  },
  themeParams: {
    bindCssVars: mocks.themeBindCssVars,
    mount: mocks.themeMount,
    unmount: mocks.themeUnmount,
  },
  retrieveRawInitData: mocks.retrieveRawInitData,
  viewport: {
    bindCssVars: mocks.viewportBindCssVars,
    mount: mocks.viewportMount,
  },
}));

import { getTelegramHash, setupTelegramSdk } from '../tma';
import { triggerImpactHaptic, triggerSelectionHaptic } from '../tma';

describe('setupTelegramSdk', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getTelegramGlobal().Telegram = {
      WebApp: {
        HapticFeedback: {
          impactOccurred: mocks.impactOccurred,
          selectionChanged: mocks.selectionChanged,
        },
      },
    };

    mocks.init.mockReturnValue(mocks.sdkCleanup);
    mocks.retrieveRawInitData.mockReturnValue('tg-hash');
    mocks.themeBindCssVars.mockReturnValue(mocks.themeCssCleanup);
    mocks.miniAppBindCssVars.mockReturnValue(mocks.miniAppCssCleanup);
    mocks.viewportBindCssVars.mockReturnValue(mocks.viewportCssCleanup);
    mocks.miniAppReadyIsAvailable.mockReturnValue(true);
  });

  it('returns raw init data for tg hash header', () => {
    expect(getTelegramHash()).toBe('tg-hash');
    expect(mocks.retrieveRawInitData).toHaveBeenCalledOnce();
  });

  it('initializes sdk and tears it down in reverse order', () => {
    const { cleanup, isInTelegram } = setupTelegramSdk();

    expect(isInTelegram).toBe(true);
    expect(mocks.init).toHaveBeenCalledOnce();
    expect(mocks.themeMount).toHaveBeenCalledOnce();
    expect(mocks.themeBindCssVars).toHaveBeenCalledOnce();
    expect(mocks.miniAppMount).toHaveBeenCalledOnce();
    expect(mocks.miniAppBindCssVars).toHaveBeenCalledOnce();
    expect(mocks.viewportMount).toHaveBeenCalledOnce();
    expect(mocks.viewportBindCssVars).toHaveBeenCalledOnce();
    expect(mocks.miniAppReadyIsAvailable).toHaveBeenCalledOnce();
    expect(mocks.miniAppReady).toHaveBeenCalledOnce();

    cleanup();

    expect(mocks.viewportCssCleanup).toHaveBeenCalledOnce();
    expect(mocks.miniAppCssCleanup).toHaveBeenCalledOnce();
    expect(mocks.themeCssCleanup).toHaveBeenCalledOnce();
    expect(mocks.miniAppUnmount).toHaveBeenCalledOnce();
    expect(mocks.themeUnmount).toHaveBeenCalledOnce();
    expect(mocks.sdkCleanup).toHaveBeenCalledOnce();
  });

  it('skips mini app ready when it is unavailable', () => {
    mocks.miniAppReadyIsAvailable.mockReturnValue(false);

    const { isInTelegram } = setupTelegramSdk();

    expect(isInTelegram).toBe(true);
    expect(mocks.miniAppReady).not.toHaveBeenCalled();
  });

  it('returns a noop teardown when initialization throws', () => {
    mocks.init.mockImplementation(() => {
      throw new Error('init failed');
    });

    const { cleanup, isInTelegram } = setupTelegramSdk();

    expect(isInTelegram).toBe(false);
    expect(() => cleanup()).not.toThrow();
    expect(mocks.themeMount).not.toHaveBeenCalled();
    expect(mocks.miniAppMount).not.toHaveBeenCalled();
    expect(mocks.viewportMount).not.toHaveBeenCalled();
  });

  it('triggers selection haptic when Telegram WebApp is available', () => {
    triggerSelectionHaptic();

    expect(mocks.selectionChanged).toHaveBeenCalledOnce();
  });

  it('triggers impact haptic with provided style when Telegram WebApp is available', () => {
    triggerImpactHaptic('medium');

    expect(mocks.impactOccurred).toHaveBeenCalledWith('medium');
  });

  it('does nothing for haptics outside Telegram', () => {
    delete getTelegramGlobal().Telegram;

    expect(() => {
      triggerSelectionHaptic();
      triggerImpactHaptic();
    }).not.toThrow();
  });
});

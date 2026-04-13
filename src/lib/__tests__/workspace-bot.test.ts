import { describe, expect, it } from 'vitest';

import { buildWorkspaceMiniAppUrl, normalizeBotUsername, normalizeMiniAppUrl } from '../workspace-bot';

describe('normalizeBotUsername', () => {
  it('trims whitespace', () => {
    expect(normalizeBotUsername('  ClinicBot  ')).toBe('ClinicBot');
  });

  it('removes a leading @', () => {
    expect(normalizeBotUsername('@ClinicBot')).toBe('ClinicBot');
  });

  it('keeps inner characters untouched', () => {
    expect(normalizeBotUsername('Clinic_Bot')).toBe('Clinic_Bot');
  });
});

describe('buildWorkspaceMiniAppUrl', () => {
  it('builds a bot url when shortname is missing', () => {
    expect(buildWorkspaceMiniAppUrl('ClinicBot')).toBe('https://t.me/ClinicBot');
  });

  it('normalizes the username before building the url', () => {
    expect(buildWorkspaceMiniAppUrl('  @ClinicBot  ')).toBe('https://t.me/ClinicBot');
  });

  it('builds a mini app url when shortname is provided', () => {
    expect(buildWorkspaceMiniAppUrl('ClinicBot', 'miniapp')).toBe('https://t.me/ClinicBot/miniapp');
  });

  it('reuses a full t.me path without duplicating the username', () => {
    expect(buildWorkspaceMiniAppUrl('ClinicBot', 'https://t.me/ClinicBot/miniapp')).toBe(
      'https://t.me/ClinicBot/miniapp',
    );
  });
});

describe('normalizeMiniAppUrl', () => {
  it('trims whitespace', () => {
    expect(normalizeMiniAppUrl('  https://t.me/ClinicBot/miniapp  ')).toBe(
      'https://t.me/ClinicBot/miniapp',
    );
  });
});

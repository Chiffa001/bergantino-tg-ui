import { describe, expect, it } from 'vitest';

import { buildWorkspaceMiniAppUrl, normalizeBotUsername } from '../workspace-bot';

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
  it('builds a t.me url from username', () => {
    expect(buildWorkspaceMiniAppUrl('ClinicBot')).toBe('https://t.me/ClinicBot');
  });

  it('normalizes the username before building the url', () => {
    expect(buildWorkspaceMiniAppUrl('  @ClinicBot  ')).toBe('https://t.me/ClinicBot');
  });
});

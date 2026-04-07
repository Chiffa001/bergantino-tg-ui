import { describe, expect, it, vi } from 'vitest';

import { copyTextToClipboard } from '../copy-to-clipboard';

describe('copyTextToClipboard', () => {
  it('uses clipboard api when available', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);

    await copyTextToClipboard('https://example.com/invite', {
      clipboard: { writeText },
    });

    expect(writeText).toHaveBeenCalledOnce();
    expect(writeText).toHaveBeenCalledWith('https://example.com/invite');
  });

  it('falls back to textarea copy when clipboard api is unavailable', async () => {
    const select = vi.fn();
    const setAttribute = vi.fn();
    const appendToBody = vi.fn();
    const removeFromBody = vi.fn();
    const execCopy = vi.fn().mockReturnValue(true);

    const textarea = {
      value: '',
      style: {
        left: '',
        position: '',
      },
      select,
      setAttribute,
    };

    await copyTextToClipboard('https://example.com/invite', {
      appendToBody,
      createTextarea: () => textarea,
      execCopy,
      removeFromBody,
    });

    expect(textarea.value).toBe('https://example.com/invite');
    expect(setAttribute).toHaveBeenCalledWith('readonly', '');
    expect(textarea.style.position).toBe('absolute');
    expect(textarea.style.left).toBe('-9999px');
    expect(appendToBody).toHaveBeenCalledWith(textarea);
    expect(select).toHaveBeenCalledOnce();
    expect(execCopy).toHaveBeenCalledOnce();
    expect(removeFromBody).toHaveBeenCalledWith(textarea);
  });

  it('throws when fallback copy fails and still removes textarea', async () => {
    const removeFromBody = vi.fn();
    const textarea = {
      value: '',
      style: {
        left: '',
        position: '',
      },
      select: vi.fn(),
      setAttribute: vi.fn(),
    };

    await expect(
      copyTextToClipboard('https://example.com/invite', {
        appendToBody: vi.fn(),
        createTextarea: () => textarea,
        execCopy: vi.fn().mockReturnValue(false),
        removeFromBody,
      }),
    ).rejects.toThrow('copy_failed');

    expect(removeFromBody).toHaveBeenCalledWith(textarea);
  });
});

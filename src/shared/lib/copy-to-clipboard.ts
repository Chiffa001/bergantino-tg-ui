type ClipboardApi = {
  writeText?: (text: string) => Promise<void>;
};

type TextareaLike = {
  value: string;
  style: {
    left: string;
    position: string;
  };
  select: () => void;
  setAttribute: (name: string, value: string) => void;
};

type CopyToClipboardDeps = {
  clipboard?: ClipboardApi;
  createTextarea?: () => TextareaLike;
  appendToBody?: (node: TextareaLike) => void;
  removeFromBody?: (node: TextareaLike) => void;
  execCopy?: () => boolean;
};

export async function copyTextToClipboard(
  text: string,
  deps: CopyToClipboardDeps = {},
): Promise<void> {
  const clipboard = deps.clipboard ?? globalThis.navigator?.clipboard;

  if (clipboard?.writeText) {
    await clipboard.writeText(text);
    return;
  }

  const createTextarea =
    deps.createTextarea ??
    (() => document.createElement('textarea') as unknown as TextareaLike);
  const appendToBody = deps.appendToBody ?? ((node) => document.body.appendChild(node as never));
  const removeFromBody = deps.removeFromBody ?? ((node) => document.body.removeChild(node as never));
  const execCopy = deps.execCopy ?? (() => document.execCommand('copy'));

  const textarea = createTextarea();
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';

  appendToBody(textarea);
  textarea.select();

  try {
    if (!execCopy()) {
      throw new Error('copy_failed');
    }
  } finally {
    removeFromBody(textarea);
  }
}

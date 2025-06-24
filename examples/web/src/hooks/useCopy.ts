import { useState } from "react";

/**
 * Returns a function to copy text to the clipboard as well as a boolean that
 * will be true for a short period of time after the text is copied
 */
export function useCopy(): {
  copy: (text: string) => void;
  /**
   * A boolean that will be true for a short period of time after the text is
   * copied. Useful for showing temporary feedback to the user.
   */
  copied: boolean;
} {
  const [copied, setCopied] = useState(false);

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1200);
  }

  return { copy, copied };
}

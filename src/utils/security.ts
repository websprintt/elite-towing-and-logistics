import { TouchEvent, MouseEvent, FocusEvent } from 'react';

// Base64 lookup tokens
// '+17869107239' -> 'KzE3ODY5MTA3MjM5'
// '17869107239' -> 'MTc4NjkxMDcyMzk='
// 'info@elitetowinglogistics.com' -> 'aW5mb0BlbGl0ZXRvd2luZ2xvZ2lzdGljcy5jb20='

export const ENCODED_PHONE_TEL = 'KzE3ODY5MTA3MjM5';
export const ENCODED_PHONE_WA = 'MTc4NjkxMDcyMzk=';
export const ENCODED_EMAIL = 'aW5mb0BlbGl0ZXRvd2luZ2xvZ2lzdGljcy5jb20=';

/**
 * Decodes a Base64 string safely at runtime
 */
export function getDecodedValue(encoded: string): string {
  try {
    return atob(encoded);
  } catch (error) {
    console.error('Failed to decode security token:', error);
    return '';
  }
}

/**
 * Returns the decoded direct URI for standard href fallback (if loaded on event)
 */
export function getDecodedUri(type: 'tel' | 'whatsapp' | 'email', extra: string = ''): string {
  if (type === 'tel') {
    return `tel:${getDecodedValue(ENCODED_PHONE_TEL)}`;
  }
  if (type === 'whatsapp') {
    const rawVal = getDecodedValue(ENCODED_PHONE_WA);
    return `https://api.whatsapp.com/send?phone=${rawVal}${extra ? `&text=${extra}` : ''}`;
  }
  if (type === 'email') {
    return `mailto:${getDecodedValue(ENCODED_EMAIL)}`;
  }
  return '#';
}

/**
 * Dynamically updates the anchor href attribute ONLY on user interaction.
 * Triggered on pointer over, hover, touch start, focus, context menu, etc.
 * This completely thwarts scrapers because the HTML starts with empty/hash hrefs.
 */
export function hydrateSecureHref(
  e: TouchEvent<HTMLAnchorElement> | MouseEvent<HTMLAnchorElement> | FocusEvent<HTMLAnchorElement>,
  type: 'tel' | 'whatsapp' | 'email',
  extra: string = ''
) {
  const target = e.currentTarget;
  if (!target) return;
  
  const decoded = getDecodedUri(type, extra);
  if (target.getAttribute('href') !== decoded) {
    target.setAttribute('href', decoded);
  }
}

/**
 * Shared state between the navbar (which owns the menu) and the PageShell
 * wrapper in the layout (which pushes the whole page down when the menu
 * opens).
 *
 * The menu sheet is portaled to `document.body` so it stays pinned to the
 * top of the viewport while the page — navbar included — is transformed down
 * by exactly MENU_HEIGHT. The push and the sheet share this one value so
 * they can never drift apart.
 *
 * A tiny module store beats React context here: PageShell is an ancestor of
 * the navbar in the layout, but the navbar renders deep inside `children`,
 * so passing state down would require lifting the menu out of every page.
 */
export const MENU_HEIGHT = "60dvh";

let open = false;
let height = MENU_HEIGHT;
const openListeners = new Set<(open: boolean) => void>();
const heightListeners = new Set<(height: string) => void>();

export function setMenuOpenState(value: boolean) {
  open = value;
  openListeners.forEach((listener) => listener(value));
}

export function subscribeMenuOpen(listener: (open: boolean) => void) {
  openListeners.add(listener);
  return () => {
    openListeners.delete(listener);
  };
}

/** The sheet auto-fits its content (measured in the navbar), so its height
 * is not constant. Publish each measurement so the page push, the navbar's
 * own ride-down and the click-away backdrop all track the same value. */
export function setMenuHeight(value: string) {
  height = value;
  heightListeners.forEach((listener) => listener(value));
}

export function getMenuHeight() {
  return height;
}

export function subscribeMenuHeight(listener: (height: string) => void) {
  heightListeners.add(listener);
  return () => {
    heightListeners.delete(listener);
  };
}
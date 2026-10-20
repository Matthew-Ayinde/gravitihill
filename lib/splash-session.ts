/**
 * Once-per-tab flag for the home splash.
 *
 * sessionStorage is scoped to a single tab and survives reloads within it,
 * but is cleared when the tab closes — exactly the lifetime the splash wants.
 * Lives outside SplashScreen (a client module) so the server-rendered root
 * layout can read the key as a plain string for its boot script.
 */
export const SPLASH_SEEN_KEY = "gh:splash-seen";

/**
 * Runs during HTML parsing, before first paint: if this tab has already seen
 * the splash, marks <html> so CSS hides the server-rendered gate before it can
 * flash on a reload.
 */
export const SPLASH_BOOT = `(function(){try{if(sessionStorage.getItem(${JSON.stringify(SPLASH_SEEN_KEY)}))document.documentElement.setAttribute("data-splash-seen","")}catch(e){}})()`;

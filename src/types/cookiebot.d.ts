// Ambient (script) declaration — no imports/exports so it applies globally
// regardless of how the typechecker includes module files.
interface Window {
  /** Cookiebot CMP API, present once uc.js has loaded. */
  Cookiebot?: {
    /** Reopen the consent banner so the visitor can change or withdraw consent. */
    renew: () => void;
  };
}

//#region src/auth/context.ts
/**
* The auth surface passed to every tool handler as its second argument. It wraps
* the verified per-request auth context in a private field, so the context — and
* the bearer token inside it — can't be read, enumerated, spread, or
* `JSON.stringify`'d off the instance; the accessors below are the only way out.
* `getToken()` is the single intentional escape hatch for the raw bearer.
*/
var ToolContext = class {
	#auth;
	constructor(auth) {
		this.#auth = auth;
	}
	/** Whether the in-flight tool call carries a verified auth context. */
	isAuthenticated() {
		return this.#auth !== void 0;
	}
	/** The verified bearer token, or `undefined` when unauthenticated. Pass it to downstream APIs; never return or log it. */
	getToken() {
		return this.#auth?.bearer.token;
	}
	/** The verified user id (the token `sub`), or `undefined`. */
	getUserId() {
		return this.#auth?.principal.sub;
	}
	/** The verified user email, or `undefined` when absent. */
	getUserEmail() {
		return this.#auth?.principal.email;
	}
	/** The verified OAuth `client_id`, or `undefined`. */
	getClientId() {
		return this.#auth?.principal.clientId;
	}
	/** The verified OAuth scopes, or `undefined` when unauthenticated. */
	getScopes() {
		return this.#auth?.principal.scopes;
	}
	/** The verified token issuer, or `undefined`. */
	getIssuer() {
		return this.#auth?.principal.issuer;
	}
	/**
	* The full verified JWT claims, or `undefined`. Use this for app/business
	* authorization on issuer-specific claims that have no dedicated accessor.
	*/
	getClaims() {
		return this.#auth?.principal.claims;
	}
};
//#endregion
//#region src/core/errors.ts
const TOOL_ERROR_BRAND = Symbol.for("@lovable.dev/mcp-js/tool-error");
/** Error whose message is meant for the remote MCP caller; thrown from a handler
*  it becomes an `isError` result carrying exactly `message`. */
var ToolError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "ToolError";
		Object.defineProperty(this, TOOL_ERROR_BRAND, { value: true });
	}
};
function isToolError(err) {
	return err instanceof Error && Object.getOwnPropertyDescriptor(err, TOOL_ERROR_BRAND)?.value === true;
}
/** The caller-visible message of a thrown ToolError, or undefined for anything
*  else — including when inspecting the value itself throws (fail closed). */
function resolveToolErrorMessage(err) {
	try {
		return isToolError(err) ? String(err.message) : void 0;
	} catch {
		return;
	}
}
const MAX_ERROR_SUMMARY = 500;
/** Bounded name+message line for local logs; never for wire responses. */
function errorSummary(err) {
	try {
		const text = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
		return text.length > MAX_ERROR_SUMMARY ? `${text.slice(0, MAX_ERROR_SUMMARY)}…` : text;
	} catch {
		return "unprintable error";
	}
}
//#endregion
export { ToolContext as i, errorSummary as n, resolveToolErrorMessage as r, ToolError as t };

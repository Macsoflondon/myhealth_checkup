import { i as log, r as describeError } from "./logger-3-kwsF-5.js";
import { i as ToolContext, n as errorSummary, r as resolveToolErrorMessage } from "./errors-DSe96Ffd.js";
import { d as nowMs, i as createRequestAuthorizer, n as withCors, t as corsPreflightResponse, u as createNoopRecorder } from "./cors-D1m2Ud44.js";
import { t as extractTextContent } from "./content-D5LJAHyM.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
//#region src/protocols/mcp/protocol.ts
const STATELESS_ALLOW_METHODS = "POST, OPTIONS";
function statelessMethodNotAllowed() {
	return Response.json({
		jsonrpc: "2.0",
		id: null,
		error: {
			code: -32e3,
			message: "Method not allowed: stateless server offers no standalone SSE stream (GET) or session (DELETE)."
		}
	}, {
		status: 405,
		headers: {
			Allow: STATELESS_ALLOW_METHODS,
			"Cache-Control": "no-store"
		}
	});
}
/**
* Adapt a Lovable tool to the SDK's tool callback. The boundary cast bridges
* our SDK-decoupled content-block types to the SDK's; they match structurally.
*/
function adaptToolToSdkCallback(tool, auth, recorder) {
	const endUserId = auth?.principal.sub;
	return (async (first) => {
		const args = tool.inputSchema ? first ?? {} : {};
		const start = nowMs();
		let result;
		try {
			result = await tool.handler(args, new ToolContext(auth));
		} catch (err) {
			const callerMessage = resolveToolErrorMessage(err);
			if (callerMessage === void 0) {
				await recorder.emit({
					tool: tool.name,
					method: "tools/call",
					outcome: "handler_error",
					durationMs: nowMs() - start,
					errorText: errorSummary(err),
					endUserId
				});
				return {
					content: [{
						type: "text",
						text: "tool execution failed"
					}],
					isError: true
				};
			}
			result = {
				content: [{
					type: "text",
					text: callerMessage
				}],
				isError: true
			};
		}
		if (result == null) {
			await recorder.emit({
				tool: tool.name,
				method: "tools/call",
				outcome: "handler_error",
				durationMs: nowMs() - start,
				endUserId
			});
			return {
				content: [{
					type: "text",
					text: `tool "${tool.name}" returned no result`
				}],
				isError: true
			};
		}
		await recorder.emit({
			tool: tool.name,
			method: "tools/call",
			outcome: result.isError ? "tool_error" : "ok",
			durationMs: nowMs() - start,
			errorText: result.isError ? extractTextContent(result.content) : void 0,
			endUserId
		});
		return {
			content: result.content ?? [],
			structuredContent: result.structuredContent,
			isError: result.isError
		};
	});
}
/**
* Build a Web-Standard request handler that serves the MCP protocol over
* streamable HTTP. A fresh `McpServer` + transport is constructed per
* request — the transport is stateless, so this is cheap and there is no
* cross-request state to leak. The per-request `recorder` is supplied by the
* caller (the stack handler) so telemetry reads the runtime env in-flight.
*/
function createMcpProtocolHandler(mcp, options = {}) {
	const authorizer = createRequestAuthorizer(mcp, options);
	const handle = async (request, authResult, recorder) => {
		try {
			const server = new McpServer({
				name: mcp.name,
				version: mcp.version,
				title: mcp.title
			}, { instructions: mcp.instructions });
			for (const tool of mcp.tools) server.registerTool(tool.name, {
				title: tool.title,
				description: tool.description,
				inputSchema: tool.inputSchema,
				outputSchema: tool.outputSchema,
				annotations: tool.annotations
			}, adaptToolToSdkCallback(tool, authResult.auth, recorder));
			const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: void 0 });
			await server.connect(transport);
			return await transport.handleRequest(request);
		} catch (err) {
			await recorder.emit({
				tool: null,
				method: "transport",
				outcome: "transport_error",
				durationMs: 0,
				endUserId: authResult.auth?.principal.sub
			});
			log.error("mcp.transport_error", {
				...describeError(err),
				outcome: "500 internal error"
			});
			return Response.json({
				jsonrpc: "2.0",
				id: null,
				error: {
					code: -32603,
					message: "internal error"
				}
			}, { status: 500 });
		}
	};
	return async (request, recorder = createNoopRecorder()) => {
		if (request.method === "OPTIONS") return corsPreflightResponse(STATELESS_ALLOW_METHODS);
		const authResult = await authorizer.authorize(request, recorder);
		if (!authResult.ok) return withCors(authResult.response);
		if (request.method !== "POST") return withCors(statelessMethodNotAllowed());
		return withCors(await handle(request, authResult, recorder));
	};
}
//#endregion
export { createMcpProtocolHandler as t };

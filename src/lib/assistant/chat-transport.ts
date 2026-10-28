/** The server returns a generic error; the header identifies recoverable chat resets. */
export class ChatHistoryRejectedError extends Error {
  constructor() {
    super("Chat restarted.");
    this.name = "ChatHistoryRejectedError";
  }
}

export const assistantChatFetch: typeof fetch = async (input, init) => {
  const response = await fetch(input, init);
  if (
    response.status === 400 &&
    response.headers.get("X-Chat-Restart") === "true"
  )
    throw new ChatHistoryRejectedError();
  return response;
};

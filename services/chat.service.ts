import api from "@/lib/axios";

import {
  chatResponseSchema,
  type ChatRequest,
  type ChatResponse,
} from "@/lib/chat-schema";

export async function sendChatMessage(
  payload: ChatRequest,
  signal?: AbortSignal
): Promise<ChatResponse> {
  const response = await api.post(
    "/chat",
    payload,
    { signal }
  );

  return chatResponseSchema.parse(
    response.data
  );
}
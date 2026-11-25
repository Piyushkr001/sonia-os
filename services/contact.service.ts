import api from "@/lib/axios";

import {
  contactResponseSchema,
  type ContactRequest,
  type ContactResponse,
} from "@/lib/contact-schema";

export async function submitConnectionRequest(
  payload: ContactRequest,
  signal?: AbortSignal
): Promise<ContactResponse> {
  const response = await api.post(
    "/contact",
    payload,
    { signal }
  );

  return contactResponseSchema.parse(
    response.data
  );
}
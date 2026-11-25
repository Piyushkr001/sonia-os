import api from "@/lib/axios";

import {
  contactResponseSchema,
  type ContactRequest,
  type ContactResponse,
} from "@/lib/contact-schema";

export async function submitConnectionRequest(
  payload: ContactRequest
): Promise<ContactResponse> {
  const response = await api.post(
    "/contact",
    payload
  );

  return contactResponseSchema.parse(
    response.data
  );
}
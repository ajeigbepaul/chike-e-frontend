import api from "../api";

export interface ContactPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  topic?: string;
  subject?: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

const contactService = {
  async sendMessage(payload: ContactPayload): Promise<ContactResponse> {
    const res = await api.post("/contact", payload, { withCredentials: true });
    return res.data;
  },
};

export default contactService;

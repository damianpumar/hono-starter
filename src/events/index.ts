import { SSEStreamingApi } from "hono/streaming";

interface Client {
  userId: string;
  stream: SSEStreamingApi;
}

const clients: Client[] = [];

// await sendEvent(user.id, "message", {
//   name: "John Doe",
//   age: 30,
// });
export const sendEvent = async (
  userId: string,
  event: string,
  data: unknown
) => {
  const client = clients.find((c) => c.userId === userId);

  if (client) {
    await client.stream.writeSSE({
      id: Date.now().toString(),
      event,
      data: JSON.stringify(data),
    });
  }
};

export const addClient = (userId: string, stream: SSEStreamingApi) => {
  const existingClient = clients.find((c) => c.userId === userId);

  if (existingClient) return;

  clients.push({
    userId,
    stream,
  });
};

export const removeClient = (userId: string) => {
  const index = clients.findIndex((c) => c.userId === userId);

  if (index === -1) return;

  clients.splice(index, 1);
};

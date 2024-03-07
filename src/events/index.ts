import { SSEStreamingApi } from "hono/streaming";
import { env } from "../config";

type Subscriber = {
  subscriber: string;
  stream: SSEStreamingApi;
};

const subscribers: Subscriber[] = [];

function send(
  event: EventTypes,
  data: Object | Array<unknown>,
  receiver: "*"
): Promise<void>;
function send(
  event: EventTypes,
  data: Object | Array<unknown>,
  receiver: string
): Promise<void>;
async function send(event: any, data: any, receiver: any) {
  const receivers = subscribers.filter(
    (c) => receiver === "*" || c.subscriber === receiver
  );

  if (!env.IS_PROD) {
    console.log(
      `🕊️ Sending event to ${receiver} with data: ${JSON.stringify(data)}`
    );
  }

  const promises = receivers.map((receiver) =>
    receiver.stream.writeSSE({
      id: Date.now().toString(),
      event,
      data: JSON.stringify(data),
    })
  );

  await Promise.all(promises);
}

const subscribe = (subscriber: string, stream: SSEStreamingApi) => {
  if (!env.IS_PROD) {
    console.log(
      `🌈 New subscriber ${subscriber} connected to the event stream`
    );
  }

  subscribers.push({
    subscriber: subscriber,
    stream,
  });
};

const remove = (subscriber: string) => {
  const index = subscribers.findIndex((c) => c.subscriber === subscriber);

  if (index === -1) return;

  if (!env.IS_PROD) {
    console.log(
      `💀 Subscriber ${subscriber} dis  connected from the event stream`
    );
  }

  subscribers.splice(index, 1);
};

export const Event = {
  send,
  subscribe,
  remove,
};

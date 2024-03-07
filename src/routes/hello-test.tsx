import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { html, raw } from "hono/html";
import { z } from "zod";

const schema = z.object({
  hello: z.string(),
  counter: z.number(),
});

const routes = new Hono();
const name = "ssr";

routes.post("/data", zValidator("json", schema), (c) => {
  const body = c.req.valid("json");
  return c.json({ ok: true, body });
});

const Header =
  () => html` <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script>
      const { createApp, ref } = Vue;

      const counter = ref(0);
    </script>`;

const Counter = () => html`
  <div id="counter">
    <button @click="increment">Clicked {{ counter }} times</button>
  </div>

  <script>
    createApp({
      setup() {
        const increment = () => {
          counter.value++;
        };

        return { counter, increment };
      },
    }).mount("#counter");
  </script>
`;

const DataLoader = () => html`
  <div id="data-loader" style="margin-top: 20px">
    <button @click="loadData">Load data</button>
    <p>{{ data }}</p>
  </div>

  <script>
    createApp({
      setup() {
        const data = ref("No data");

        const loadData = () => {
          fetch("/ssr/data", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ hello: "world", counter: counter.value }),
          })
            .then((res) => res.json())
            .then((res) => {
              data.value = JSON.stringify(res);
            });
        };

        return { data, loadData };
      },
    }).mount("#data-loader");
  </script>
`;

routes.get("/", (c) => {
  return c.html(
    <html>
      <body>
        <Header />

        <h2>Backend rendering!</h2>

        <Counter />

        <DataLoader />
      </body>
    </html>
  );
});

export { name, routes };

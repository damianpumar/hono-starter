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

const Counter = () => html`
  <button @click="counter++">Clicked {{ counter }} times</button>
`;

routes.get("/", (c) => {
  return c.html(
    <html>
      <body>
        <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>

        <div id="app">
          <h2>Backend rendering!</h2>

          <Counter />

          {raw(`<button @click="loadData">Load data</button>`)}

          {raw(`<p>{{ data }}</p>`)}

          <script>
            {raw(`
              const { createApp, ref } = Vue;

              createApp({
                setup() {
                  const counter = ref(0);
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
                  }

                  return { counter, data, loadData };
                },
              }).mount("#app");
            `)}
          </script>
        </div>
      </body>
    </html>
  );
});

export { name, routes };

//Praktikum 1, 2, 3

import { Elysia, t } from "elysia";
import { openapi } from "@elysiajs/openapi";

const app = new Elysia()
.use(openapi())
.post(
  "/request",
  ({ body }) => {
    return {
      message: "Success",
      data: body
    };
  },
  {
    body: t.Object({
      name: t.String({ minLength: 3 }),
      email: t.String({ format: "email" }),
      age: t.Number({ minimum: 18 })
    })
  }
)

.get("/products/:id", ({ params, query }) => {
    return {
        id: params.id,
        sort: query.sort
    }
}, {
    params: t.Object({
        id: t.Number() // Ketentuan: Id harus berupa number 
    }),
    query: t.Object({
        sort: t.Optional(
            t.String({ 
                pattern: "^(asc|desc)$" // Ketentuan: Sort hanya boleh "asc" atau "desc" 
            })
        )
    })
})

.get("/stats", () => {
    return {
        total: 100,
        active: 50
    }
}, {
    response: t.Object({
        total: t.Number(),
        active: t.Number()
    })
})

.listen(3000);
console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`);
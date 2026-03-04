// Praktikum 4, 5, 6

import { Elysia, t } from "elysia";
import { openapi } from "@elysiajs/openapi";

const app = new Elysia()
  .use(openapi())
  .get(
    "/admin",
    () => {
      return { stats: 99 };
    },
    {beforeHandle({ headers, set }) {
        if (headers.authorization !== "Bearer 123") {
          set.status = 401;
          return {
            success: false,
            message: "Unauthorized" };
        }
      }
    }
  )


    app.onAfterHandle(({ response }) => {
    return {
      success: true,
      message: "data tersedia",
      data: response
    }
  })

  app.get("/product", () => {
    return { id: 1, name: "Laptop" }
  })

  app.post("/login", ({ body }) => body, {
    body: t.Object({
      email: t.String({ format: "email" }),
      password: t.String({ minLength: 8 })
    })
  })

  app.onError(({ code, error, set }) => {
    if (code === "VALIDATION") {
      set.status = 400
      return {
        success: false,
        error: "Validation Error"
      }
    }
    
    if (code === "NOT_FOUND") {
      set.status = 404
      return { message: "Route not found" }
    }
  })

  .listen(3000);

console.log(`Server running at ${app.server?.hostname}:${app.server?.port}`);
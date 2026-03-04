import { Elysia, t } from "elysia";
import { openapi } from "@elysiajs/openapi";

const app = new Elysia()
  .use(openapi())
  
  // PRAKTIKUM 6: Custom Validation Error (onError)
  .onError(({ code, set }) => {
    if (code === "VALIDATION") {
      set.status = 400;
      return {
        success: false,
        error: "Validation Error"
      };
    }
  })

  // PRAKTIKUM 5: afterHandle
  .onAfterHandle(({ response, set }) => {
    if (set.status === 200 || set.status === 201) {
      return {
        success: true,
        message: "data tersedia",
        data: response
      };
    }
    return response;
  })

  // PRAKTIKUM 4: beforeHandle (Auth Guard)
  .get(
    "/admin",
    () => {
      return { stats: 99 };
    },
    {
      beforeHandle({ headers, set }) {
        if (headers.authorization !== "Bearer 123") {
          set.status = 401;
          return {
            success: false,
            message: "Unauthorized"
          };
        }
      }
    }
  )

  // Endpoint pengujian Praktikum 5
  .get("/product", () => {
    return { id: 1, name: "Laptop" };
  })

  // Endpoint pengujian Praktikum 6
  .post("/login", ({ body }) => body, {
    body: t.Object({
      email: t.String({ format: "email" }),
      password: t.String({ minLength: 8 }) 
    })
  })

  .listen(3000);

console.log(`Server running at ${app.server?.hostname}:${app.server?.port}`);
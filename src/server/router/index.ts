// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { protectedExampleRouter } from "./protected-example-router";
import { userRouter } from "./users";
import { PostRouter } from "./posts";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("user.", userRouter)
  .merge("post.", PostRouter)
  .merge("auth.", protectedExampleRouter);

// export type definition of API
export type AppRouter = typeof appRouter;

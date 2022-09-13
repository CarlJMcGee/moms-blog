import { createRouter } from "./context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const userRouter = createRouter()
  .query("getAll", {
    async resolve({ ctx }) {
      const User = ctx.prisma.user;

      const users = await User.findMany();

      return users;
    },
  })
  .mutation("getOne", {
    input: z.object({
      userId: z.string().trim(),
    }),
    async resolve({ ctx, input }) {
      const User = ctx.prisma.user;

      const user = await User.findFirst({
        where: { id: input.userId },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `User not found with user id ${input.userId}`,
        });
      }

      return user;
    },
  });

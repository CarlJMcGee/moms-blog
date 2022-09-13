import { createRouter } from "./context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";

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

      const user = await User.findUnique({
        where: { id: input.userId },
        include: {
          _count: {
            select: {
              posts: true,
              comments: true,
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `User not found with user id ${input.userId}`,
        });
      }

      return user;
    },
  })
  .mutation("addUser", {
    input: z.object({
      username: z.string().trim(),
      email: z.string().trim(),
      password: z.string().trim(),
    }),
    async resolve({ ctx, input }) {
      const { email, username, password } = input;
      const User = ctx.prisma.user;

      const cookedPass = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        data: {
          name: username,
          email: email,
          password: cookedPass,
        },
      });

      return newUser;
    },
  })
  .mutation("loginTemp", {
    input: z.object({
      email: z.string().trim(),
      pass: z.string().trim(),
    }),
    async resolve({ ctx, input }) {
      const user = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });
      if (user) {
        return bcrypt.compare(input.pass, user.password);
      }
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `User not found`,
      });
    },
  });

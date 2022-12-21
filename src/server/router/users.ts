import { createRouter } from "./context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import { triggerEvent } from "../../utils/pusherStore";

export const userRouter = createRouter()
  .query("getAll", {
    async resolve({ ctx }) {
      const User = ctx.prisma.user;

      const users = await User.findMany();

      const usersSafe = users.map((user) => {
        const { password, ...userSafe } = user;
        return userSafe;
      });

      return usersSafe;
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

      const { password, ...userSafe } = user;
      return userSafe;
    },
  })

  .query("me", {
    async resolve({ ctx }) {
      if (!ctx.session?.user) {
        return undefined;
      }

      const me = await ctx.prisma.user.findUniqueOrThrow({
        where: { id: ctx.session?.user?.id },
        include: {
          posts: true,
          likedPosts: true,
          comments: true,
          likedComments: true,
        },
      });

      const { password, ...meSafe } = me;
      return meSafe;
    },
  })

  .mutation("addUser", {
    input: z.object({
      username: z.string().trim(),
      email: z.string().trim(),
      password: z.string().trim(),
      imageSrc: z.string().trim().optional(),
    }),
    async resolve({ ctx, input }) {
      const { email, username, password, imageSrc } = input;
      const User = ctx.prisma.user;

      const cookedPass = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        data: {
          name: username,
          email: email,
          password: cookedPass,
          image: imageSrc === "" ? undefined : imageSrc,
        },
      });

      const { password: pass, ...newUserSafe } = newUser;

      return newUserSafe;
    },
  })

  .mutation("updateName", {
    input: z.object({
      name: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { name } = input;
      const User = ctx.prisma.user;

      const user = await User.update({
        where: {
          id: ctx.session?.user?.id,
        },
        data: {
          name: name,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `User not found`,
        });
      }

      triggerEvent("main", "updated_info", `changed name to ${user.name}`);
      return user;
    },
  })

  .mutation("updatePfp", {
    input: z.object({
      imageSrc: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { imageSrc } = input;
      const User = ctx.prisma.user;

      const user = await User.update({
        where: {
          id: ctx.session?.user?.id,
        },
        data: {
          image: imageSrc,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `User not found`,
        });
      }

      triggerEvent("main", "updated_info", `changed profile picture`);
      return user;
    },
  });

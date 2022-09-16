import { createRouter } from "./context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const PostRouter = createRouter()
  .query("getAll", {
    async resolve({ ctx }) {
      const Post = ctx.prisma.post;

      const posts = await Post.findMany({
        orderBy: { updatedAt: "desc" },
        take: 10,
        include: {
          user: true,
          comments: {
            include: {
              user: true,
            },
          },
        },
      });

      return posts;
    },
  })
  .mutation("new", {
    input: z.object({
      title: z.string().trim(),
      content: z.string().trim(),
      imgLink: z.string().trim(),
    }),
    async resolve({ ctx, input }) {
      const Post = ctx.prisma.post;
      const { title, content, imgLink } = input;

      if (!ctx.session?.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: `User is not logged in!`,
        });
      }
      const newPost = await Post.create({
        data: {
          title: title,
          content: content,
          image: imgLink,
          userId: ctx.session.user.id ?? "",
        },
      });
      return newPost;
    },
  });

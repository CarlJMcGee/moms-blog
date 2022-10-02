import { createRouter } from "./context";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const CommentRouter = createRouter()
  .query("getAll", {
    async resolve({ ctx }) {
      const Comment = ctx.prisma.comment;

      const comments = await Comment.findMany({
        include: {
          user: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      });
      return comments;
    },
  })
  .mutation("add", {
    input: z.object({
      content: z.string().trim(),
      postId: z.string().trim(),
    }),
    async resolve({ ctx, input }) {
      const Comment = ctx.prisma.comment;
      const { content, postId } = input;

      const newComment = await Comment.create({
        data: {
          content: content,
          userId: ctx.session?.user?.id ?? "",
          postId: postId,
        },
      });

      if (!newComment) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to post comment",
        });
      }

      return `User made a comment on post`;
    },
  })
  .mutation("update", {
    input: z.object({
      content: z.string().trim(),
      postId: z.string().trim(),
    }),
    async resolve({ ctx, input }) {
      const Comment = ctx.prisma.comment;

      return await Comment.update({
        where: {
          id: input.postId,
        },
        data: {
          content: input.content,
        },
      });
    },
  });

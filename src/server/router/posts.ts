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
            take: 5,
            orderBy: { createdAt: "desc" },
          },
          _count: {
            select: {
              userLikes: true,
            },
          },
        },
      });

      const postsSafe = posts.map((post) => {
        const { user, comments, ...postdata } = post;
        const { password, ...userSafe } = user;
        const commentsSafe = comments.map((comment) => {
          const {
            user: { password, ...userSafe },
            ...commentData
          } = comment;
          return { userSafe, ...commentData };
        });
        return { userSafe, commentsSafe, ...postdata };
      });

      return postsSafe;
    },
  })
  .mutation("getOne", {
    input: z.object({
      postId: z.string().trim(),
    }),
    async resolve({ ctx, input }) {
      const post = await ctx.prisma.post.findUniqueOrThrow({
        where: {
          id: input.postId,
        },
        include: {
          user: true,
        },
      });

      const {
        user: { password, ...userSafe },
        ...postData
      } = post;
      return { userSafe, ...postData };
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
  })
  .mutation("update", {
    input: z.object({
      postId: z.string().trim(),
      title: z.string().trim(),
      content: z.string().trim(),
      imgLink: z.string().trim(),
    }),
    async resolve({ ctx, input }) {
      const Post = ctx.prisma.post;
      const { title, content, imgLink, postId } = input;

      const update = await Post.update({
        data: {
          title: title,
          content: content,
          image: imgLink,
        },
        where: {
          id: postId,
        },
      });

      if (ctx.session?.user?.id !== update.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: `User is not logged in!`,
        });
      }

      return `User updated post`;
    },
  })
  .mutation("addLike", {
    input: z.object({
      userId: z.string().trim(),
      postId: z.string().trim(),
    }),
    async resolve({ ctx, input }) {
      const Likes = ctx.prisma.usersLikedPosts;
      const { postId, userId } = input;

      const likePost = await Likes.create({
        data: {
          postId: postId,
          userId: userId,
        },
      });

      if (!likePost) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "like post operation failed",
        });
      }

      return `User liked post`;
    },
  })
  .mutation("removeLike", {
    input: z.object({
      userId: z.string().trim(),
      postId: z.string().trim(),
    }),
    async resolve({ ctx, input }) {
      const Likes = ctx.prisma.usersLikedPosts;
      const { postId, userId } = input;

      const likePost = await Likes.delete({
        where: {
          userId_postId: {
            postId: postId,
            userId: userId,
          },
        },
      });

      if (!likePost) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "remove post operation failed",
        });
      }

      return `User unliked post`;
    },
  });

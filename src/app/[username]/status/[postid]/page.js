import PostPage from "@/components/client/PostPage";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Comment from "@/components/Comment";
import { ForceRefresh } from "@/components/ForceRefresh";

const Page = async ({ params }) => {
  const { postid } = params;

  const session = await getServerSession(authOptions);
  const profile = await prisma.profile.findUnique({
    where: {
      email: session.user.email,
    },
  });
  const post = await prisma.post.findUnique({
    where: {
      id: postid,
    },
  });
  console.log(post);
  const author = await prisma.profile.findUnique({
    where: { id: post.authorId },
  });
  const liked = await prisma.like.findFirst({
    where: {
      userId: profile.id,
      postId: post.id,
    },
  });
  const bookmarked = await prisma.bookmark.findFirst({
    where: {
      userId: profile.id,
      postId: post.id,
    },
  });
  const retweeted = await prisma.retweet.findFirst({
    where: {
      userId: profile.id,
      postId: post.id,
    },
  });

  const likes = await prisma.like.findMany({
    where: {
      postId: post.id,
    },
  });
  const comments = await prisma.post.findMany({
    where: {
      parentId: post.id,
    },
  });
  const bookmarks = await prisma.bookmark.findMany({
    where: {
      postId: post.id,
    },
  });
  const retweets = await prisma.retweet.findMany({
    where: {
      postId: post.id,
    },
  });
  post.retweets = retweets;
  post.likes = likes;
  post.comments = comments;
  post.bookmarks = bookmarks;

  console.log(post);

  return (
    <div>
      <ForceRefresh />
      <PostPage
        post={post}
        author={author}
        profile={profile}
        bookmarked={bookmarked}
        liked={liked}
        retweeted={retweeted}
      >
        {post.comments.map((comment) => {
          return <Comment key={comment.id} comment={comment} />;
        })}
      </PostPage>
    </div>
  );
};

export default Page;

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Post from "@/components/client/Post";

const Comment = async ({ comment }) => {
  const session = await getServerSession(authOptions);
  const profile = await prisma.profile.findUnique({
    where: {
      email: session.user.email,
    },
  });
  const authorPromise = prisma.profile.findUnique({
    where: {
      id: comment.authorId,
    },
  });
  const likedPromise = prisma.like.findFirst({
    where: {
      userId: profile.id,
      postId: comment.id,
    },
  });
  const bookmarkedPromise = prisma.bookmark.findFirst({
    where: {
      userId: profile.id,
      postId: comment.id,
    },
  });
  const retweetedPromise = prisma.retweet.findFirst({
    where: {
      userId: profile.id,
      postId: comment.id,
    },
  });
  const likesPromise = prisma.like.findMany({
    where: {
      postId: comment.id,
    },
  });
  const commentsPromise = prisma.post.findMany({
    where: {
      parentId: comment.id,
    },
  });
  const bookmarksPromise = prisma.bookmark.findMany({
    where: {
      postId: comment.id,
    },
  });
  const retweetsPromise = prisma.retweet.findMany({
    where: {
      postId: comment.id,
    },
  });

  const [
    author,
    liked,
    bookmarked,
    retweeted,
    likes,
    comments,
    bookmarks,
    retweets,
  ] = await Promise.all([
    authorPromise,
    likedPromise,
    bookmarkedPromise,
    retweetedPromise,
    likesPromise,
    commentsPromise,
    bookmarksPromise,
    retweetsPromise,
  ]);
  comment.retweets = retweets;
  comment.likes = likes;
  comment.comments = comments;
  comment.bookmarks = bookmarks;
  console.log(comment);
  console.log(author);
  console.log(profile);
  console.log(bookmarked);
  console.log(liked);
  console.log(retweeted);

  return (
    <div>
      <Post
        post={comment}
        author={author}
        profile={profile}
        bookmarked={bookmarked}
        liked={liked}
        retweeted={retweeted}
      />
    </div>
  );
};

export default Comment;

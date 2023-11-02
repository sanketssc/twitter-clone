import React from "react";
import PostInput from "../components/client/PostInput";
import Link from "next/link";
import prisma from "@/lib/prisma";
import Post from "../components/client/Post";
import MobilePost from "../components/client/MobilePost";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ForceRefresh } from "@/components/ForceRefresh";

export async function generateMetadata() {
  return {
    title: "Home - Twitter",
  };
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  const profile = await prisma.profile.findUnique({
    where: {
      email: session.user.email,
    },
  });
  const posts1 = await prisma.post.findMany({
    where: { authorId: { not: profile.id } },
    orderBy: { createdAt: "desc" },
  });
  const followed = await prisma.follows.findMany({
    where: {
      followerId: profile.id,
    },
  });
  const followedIds = followed.map((follow) => {
    return follow.followingId;
  });
  console.log("2", followedIds);
  const posts = [];
  // posts1.forEach((post) => {
  //   if (followedIds.includes(post.authorId)) {
  //     posts.push(post);
  //   }
  // });
  console.log("1", posts);

  return (
    <div className="w-full h-full">
      <ForceRefresh />
      <Link
        href={"/"}
        className="h-20 z-10 bg-black/60 backdrop-blur-sm fixed w-[37.35rem] border-r border-b px-4 py-2 text-2xl text-white font-bold"
      >
        Home
      </Link>
      <div className="pt-24 border-b hidden xs:block">
        <PostInput />
      </div>
      <div className="pt-20 xs:pt-3"></div>
      {posts1 &&
        posts1.map(async (post) => {
          const authorPromise = prisma.profile.findUnique({
            where: { id: post.authorId },
          });
          const likedPromise = prisma.like.findFirst({
            where: {
              userId: profile.id,
              postId: post.id,
            },
          });
          const bookmarkedPromise = prisma.bookmark.findFirst({
            where: {
              userId: profile.id,
              postId: post.id,
            },
          });
          const retweetedPromise = prisma.retweet.findFirst({
            where: {
              userId: profile.id,
              postId: post.id,
            },
          });

          const likesPromise = prisma.like.findMany({
            where: {
              postId: post.id,
            },
          });
          const commentsPromise = prisma.post.findMany({
            where: {
              parentId: post.id,
            },
          });
          const bookmarksPromise = prisma.bookmark.findMany({
            where: {
              postId: post.id,
            },
          });
          const retweetsPromise = prisma.retweet.findMany({
            where: {
              postId: post.id,
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
          post.retweets = retweets;
          post.likes = likes;
          post.comments = comments;
          post.bookmarks = bookmarks;

          return (
            <div key={post.id}>
              {" "}
              <Post
                post={post}
                author={author}
                profile={profile}
                bookmarked={bookmarked}
                liked={liked}
                retweeted={retweeted}
              />{" "}
            </div>
          );
        })}
      <div className="xs:hidden">
        <MobilePost />
      </div>
    </div>
  );
}

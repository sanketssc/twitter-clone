import React from "react";
import PostInput from "../components/client/PostInput";
import Link from "next/link";
import prisma from "@/lib/prisma";
import Post from "../components/client/Post";
import MobilePost from "../components/client/MobilePost";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
console.log("2",followedIds)
  const posts = []
  posts1.forEach((post) => {
    if(followedIds.includes(post.authorId)){
      posts.push(post)
    }
  });
  console.log("1",posts)

  return (
    <div className="w-full h-full">
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
      {posts &&
        posts.map(async (post) => {
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

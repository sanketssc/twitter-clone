import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
export async function POST(request) {
  const session = await getServerSession(authOptions);
  console.log(session);

  if (!session) {
    return new NextResponse({ msg: "Not logged in" });
  }
  const { content, imageUrl } = await request.json();
  const profile = await prisma.profile.findUnique({
    where: { email: session.user.email },
  });

  try {
    const userWithPosts = await prisma.profile.findUnique({
      where: { id: profile.id },
      include: {
        posts: true,
      },
    });

    if (userWithPosts) {
      console.log(`Posts created by user ${userWithPosts.name}:`);
      console.log(userWithPosts.posts);
    } else {
      console.log("User not found.");
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
  const post = await prisma.post.create({
    data: { content, imageUrl, author: { connect: { id: profile.id } } },
  });

  return NextResponse.json({success: true});
}

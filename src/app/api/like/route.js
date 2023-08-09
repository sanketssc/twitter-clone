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

  try {
    const { postId } = await request.json();
    const profile = await prisma.profile.findUnique({
      where: { email: session.user.email },
    });
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });
    const like = await prisma.like.findFirst({
      where: {
        userId: profile.id,
        postId: post.id,
      },
    });
    if (like) {
      await prisma.like.delete({
        where: {
          id: like.id,
        },
      });
    } else {
      await prisma.like.create({
        data: {
          userId: profile.id,
          postId: post.id,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ success: false });
  }
}

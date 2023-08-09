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
        const retweet = await prisma.retweet.findFirst({
            where: {
                userId: profile.id,
                postId: post.id,
            },
        });
        if (retweet) {
            await prisma.retweet.delete({
                where: {
                    id: retweet.id,
                },
            });
        }
        else {
            await prisma.retweet.create({
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
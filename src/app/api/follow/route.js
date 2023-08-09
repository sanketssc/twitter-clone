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
        const {userId } = await request.json();
        const profile = await prisma.profile.findUnique({
            where: { email: session.user.email },
        });
        const profiletofollow = await prisma.profile.findUnique({
            where: { id: userId },
        });
        const follow = await prisma.follows.findFirst({
            where: {
                followerId: profile.id,
                followingId: profiletofollow.id
            },
        });
        if (follow) {
            await prisma.follows.delete({
                where: {
                    id: follow.id,
                },
            });
        }
        else {
            await prisma.follows.create({
                data: {
                    followerId: profile.id,
                    followingId: profiletofollow.id
                },
            });
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false });
        
    }

}
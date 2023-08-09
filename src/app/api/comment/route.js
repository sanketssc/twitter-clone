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
  const { content, imageUrl, parentId } = await request.json();
  const profile = await prisma.profile.findUnique({
    where: { email: session.user.email },
  });
  try{
    const post = await prisma.post.create({
      data: {
        content,
        imageUrl,
        authorId: profile.id,
        parentId,
      },
    });
  }
    catch(err){
        console.log(err)
    }
    

  

  return NextResponse.json({success: true});
}

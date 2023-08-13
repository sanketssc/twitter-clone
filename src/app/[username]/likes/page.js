import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import Comment from "@/components/Comment";
import BackButton from "@/components/client/BackButton";
import { ForceRefresh } from "@/components/ForceRefresh";

const page = async () => {
  const session = await getServerSession(authOptions);
  const profile = await prisma.profile.findUnique({
    where: {
      email: session.user.email,
    },
  });

  const likes = await prisma.like.findMany({
    where: {
      userId: profile.id,
    },
    include: {
      post: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <ForceRefresh />
      <div className="flex flex-col w-full h-full">
        <div className="flex border-b items-center">
          <div className="px-4 py-4 border-r border-gray-400">
            <BackButton />
          </div>
          <h1 className="text-2xl font-bold px-4 py-2">Likes</h1>
        </div>
        {likes.map((like) => (
          <Comment key={like.post.id} comment={like.post} />
        ))}
      </div>
    </div>
  );
};

export default page;

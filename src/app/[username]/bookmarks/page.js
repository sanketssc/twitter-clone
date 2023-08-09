import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import prisma from "@/lib/prisma"
import Comment from "@/components/Comment"
import BackButton from "@/components/client/BackButton"

const page = async () => {
  const session = await getServerSession(authOptions)
  const profile = await prisma.profile.findUnique({
    where: {
      email: session.user.email,
    },
  });

  const bookmarks = await prisma.bookmark.findMany({
    where: {
      userId: profile.id,
    },
    include: {
      post: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  



  return (
    <div>
      <div className="flex flex-col w-full h-full">
        <div className="flex border-b items-center">
          <div className="px-4 py-4 border-r border-gray-400">
            <BackButton />
          </div>
          <h1 className="text-2xl font-bold px-4 py-2">Bookmarks</h1>
        </div>
      {bookmarks.map((bookmark) => (
        <Comment key={bookmark.post.id} comment={bookmark.post} />
      ))}
      </div>
    </div>
  )
}

export default page
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Post from "@/components/client/Post"


const Comment = async ({comment}) => {
    const session = await getServerSession(authOptions)
    const profile = await prisma.profile.findUnique({
        where: {
            email: session.user.email
        }
    })
    const author = await prisma.profile.findUnique({
        where: {
            id: comment.authorId
        }
    })
    const liked = await prisma.like.findFirst({
        where: {
            userId: profile.id,
            postId: comment.id
        }
    })
    const bookmarked = await prisma.bookmark.findFirst({
        where: {
            userId: profile.id,
            postId: comment.id
        }
    })
    const retweeted = await prisma.retweet.findFirst({
        where: {
            userId: profile.id,
            postId: comment.id
        }
    })
    const likes = await prisma.like.findMany({
        where: {
            postId: comment.id
        }
    })
    const comments = await prisma.post.findMany({
        where: {
            parentId: comment.id
        }
    })
    const bookmarks = await prisma.bookmark.findMany({
        where: {
            postId: comment.id
        }
    })
    const retweets = await prisma.retweet.findMany({
        where: {
            postId: comment.id
        }

    })
    comment.retweets = retweets
    comment.likes = likes
    comment.comments = comments
    comment.bookmarks = bookmarks
    console.log(comment)
    console.log(author)
    console.log(profile)
    console.log(bookmarked)
    console.log(liked)
    console.log(retweeted)


  return (
    <div>
        <Post post={comment} author={author} profile={profile} bookmarked={bookmarked} liked={liked} retweeted={retweeted}/>
    </div>
  )
}

export default Comment
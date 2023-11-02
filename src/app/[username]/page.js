import prisma from "@/lib/prisma";
import ProfilePage from "../../components/client/ProfilePage";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import ExporePage from "@/components/ExplorePage";

const UserProfilePage = async ({ params }) => {
  const session = await getServerSession(authOptions);
  const sessionUser = await prisma.profile.findUnique({
    where: {
      email: session.user.email,
    },
  });

  const { username } = params;
  if (username === "explore") {
    return <ExporePage />;
  }
  const profile = await prisma.profile.findUnique({
    where: { username: username },
  });
  const userPosts = await prisma.post.findMany({
    where: { authorId: profile.id },
    orderBy: { createdAt: "desc" },
  });

  let userPosts1 = [];

  for (let i = 0; i < userPosts.length; i++) {
    const authorPromise = prisma.profile.findUnique({
      where: { id: userPosts[i].authorId },
    });
    const likedPromise = prisma.like.findFirst({
      where: {
        userId: profile.id,
        postId: userPosts[i].id,
      },
    });
    const bookmarkedPromise = prisma.bookmark.findFirst({
      where: {
        userId: profile.id,
        postId: userPosts[i].id,
      },
    });
    const retweetedPromise = prisma.retweet.findFirst({
      where: {
        userId: profile.id,
        postId: userPosts[i].id,
      },
    });

    const likesPromise = prisma.like.findMany({
      where: {
        postId: userPosts[i].id,
      },
    });
    const commentsPromise = prisma.post.findMany({
      where: {
        parentId: userPosts[i].id,
      },
    });
    const bookmarksPromise = prisma.bookmark.findMany({
      where: {
        postId: userPosts[i].id,
      },
    });
    const retweetsPromise = prisma.retweet.findMany({
      where: {
        postId: userPosts[i].id,
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
    userPosts[i].retweets = retweets;
    userPosts[i].likes = likes;
    userPosts[i].comments = comments;
    userPosts[i].bookmarks = bookmarks;

    userPosts1.push({
      post: userPosts[i],
      author,
      bookmarked,
      liked,
      retweeted,
    });
  }

  const followersPromise = prisma.follows.findMany({
    where: {
      followingId: profile.id,
    },
  });
  const followingPromise = prisma.follows.findMany({
    where: {
      followerId: profile.id,
    },
  });

  const [followers, following] = await Promise.all([
    followersPromise,
    followingPromise,
  ]);
  console.log(userPosts1);

  profile.followers = followers;
  profile.following = following;
  if (profile.id === sessionUser.id) {
    profile.isSessionUser = true;
  } else {
    profile.isSessionUser = false;
  }

  console.log(profile);
  return (
    <ProfilePage
      profile={profile}
      userPosts={userPosts1}
      sessionUser={sessionUser}
    />
  );
};

export default UserProfilePage;

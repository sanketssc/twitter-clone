"use client";
import Image from "next/image";
import Post from "@/components/client/Post";
import BackButton from "./BackButton";

const ProfilePage = ({ profile, userPosts, sessionUser }) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const year = profile.createdAt.getFullYear();
  const month = months[profile.createdAt.getMonth()];
  console.log(userPosts);

  const followUser = async () => {
    const res = await fetch("/api/follow", {
      method: "POST",
      body: JSON.stringify({ userId: profile.id }),
    });
    const data = await res.json();
    console.log(data);
    if (data.success) {
      window.location.reload();
    }
  };

  return (
    <div>
      <div className="flex flex-col">
        <div className="flex cursor-pointer">
          <div className="w-12 h-12 flex justify-center items-center">
            <BackButton />
          </div>
          <div className="flex flex-col">
            <div className="">{profile.firstname + " " + profile.lastname}</div>
            <div className="text-sm">{userPosts.length} Tweets</div>
          </div>
        </div>
        <div className="flex flex-col pb-4 border-b ">
          <div className="h-[200px] bg-blue-400"></div>
          <div className="px-4">
            <div className="flex justify-between pt-3">
              <div className="bg-green-400 w-36 h-36 overflow-hidden -mt-[15%] border-2 border-black rounded-full flex items-center justify-center">
                <Image
                  src={profile.image}
                  className=" w-full h-full object-cover"
                  width={100}
                  height={100}
                  alt=""
                />
              </div>
              <div className="flex gap-2">
                {profile.isSessionUser ? (
                  <button className="bg-blue-400 text-white border px-4 py-2 font-semibold h-fit rounded-full">
                    Edit Profile
                  </button>
                ) : profile.followers.filter(follower => follower.followerId === sessionUser.id).length > 0 ? (
                  <button className="bg-black text-white border font-semibold px-4 py-2 h-fit rounded-full" onClick={followUser}>
                    
                    Following
                  </button>
                ) : (
                  <button
                    onClick={followUser}
                    className="bg-blue-600 font-bold text-white border px-4 py-2 h-fit rounded-full"
                  >
                    Follow
                  </button>
                )}
              </div>
            </div>
            <h2 className="text-xl font-bold pt-4">
              {profile.firstname} {profile.lastname}
            </h2>
            <h3 className="text-sm text-gray-400 -mt-0.5">
              @{profile.username}
            </h3>
            <div className="text-gray-400 pt-2 ">
              Joined {month} {year}
            </div>
            <div className="flex gap-4 mt-2">
              <div>{profile.followers.length} followers</div>
              <div>{profile.following.length} following</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          {userPosts.map((post) => {
            return (
              <Post
                key={post.post.id}
                post={post.post}
                author={post.author}
                profile={profile}
                liked={post.liked}
                bookmarked={post.bookmarked}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

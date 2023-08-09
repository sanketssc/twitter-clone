"use client";
import Image from "next/image";
import Link from "next/link";
import {
  FaRegComment,
  FaRetweet,
  FaRegBookmark,
  FaBookmark,
} from "react-icons/fa";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FiShare } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import BackButton from "./BackButton";
import CommentInput from "./CommentInput";
const PostPage = ({ post, profile, author, bookmarked, liked, retweeted, children }) => {
  const router = useRouter();
  const [isBookmarked, setisBookmarked] = useState(bookmarked ? true : false);
  const [isLiked, setisLiked] = useState(liked ? true : false);
  const [isRetweeted, setisRetweeted] = useState(retweeted ? true : false);
  const [bookmarkdisabled, setBookmarkdisabled] = useState(false);
  const [likeDisabled, setLikeDisabled] = useState(false);
  const [retweetDisabled, setRetweetDisabled] = useState(false);

  console.log(author);
  const created_date = post.createdAt;
  var months = [
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
  var year = created_date.getFullYear();
  var month = months[created_date.getMonth()];
  var date = created_date.getDate();
  var hour = created_date.getHours();
  var min = created_date.getMinutes();
  var time = hour + ":" + min;
  const date_string = month + " " + date + ", " + year;

  const likeTweet = () => {
    setLikeDisabled(true);
    console.log("like tweet");
    if (isLiked) {
      setisLiked(false);
      post.likes = post.likes.filter((like) => like.userId !== profile.id);
    } else {
      setisLiked(true);
      post.likes.push({ userId: profile.id });
    }

    fetch("/api/like", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: post.id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          if (isLiked) {
            setisLiked(false);
            post.likes = post.likes.filter(
              (like) => like.userId !== profile.id
            );
          } else {
            setisLiked(true);
            post.likes.push({ userId: profile.id });
          }
        }
        setLikeDisabled(false);
      });
  };

  const bookmarkTweet = () => {
    setBookmarkdisabled(true);
    console.log("bookmark tweet");
    if (isBookmarked) {
      setisBookmarked(false);
      post.bookmarks = post.bookmarks.filter(
        (bookmark) => bookmark.userId !== profile.id
      );
    } else {
      setisBookmarked(true);
      post.bookmarks.push({ userId: profile.id });
    }

    fetch("/api/bookmark", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: post.id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          if (isBookmarked) {
            setisBookmarked(false);
            post.bookmarks = post.bookmarks.filter(
              (bookmark) => bookmark.userId !== profile.id
            );
          } else {
            setisBookmarked(true);
            post.bookmarks.push({ userId: profile.id });
          }
        }
        setBookmarkdisabled(false);
      });
  };

  const retweetTweet = () => {
    setRetweetDisabled(true);
    console.log("retweet tweet");
    if (isRetweeted) {
      setisRetweeted(false);
      post.retweets = post.retweets.filter(
        (retweet) => retweet.userId !== profile.id
      );
    } else {
      setisRetweeted(true);
      post.retweets.push({ userId: profile.id });
    }

    fetch("/api/retweet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: post.id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          if (isRetweeted) {
            setisRetweeted(false);
            post.retweets = post.retweets.filter(
              (retweet) => retweet.userId !== profile.id
            );
          } else {
            setisRetweeted(true);
            post.retweets.push({ userId: profile.id });
          }
        }
        setRetweetDisabled(false);
      });
  };

  return (
    <div>
      <div className="flex">
        <div className="flex cursor-pointer border-b w-full border-gray-500">
          <div className="w-12 h-12 flex justify-center items-center">
            <BackButton />
          </div>
          <div className="flex items-center font-bold text-2xl border-gray-700 border-l px-4">
            <div>Tweet</div>
          </div>
        </div>
      </div>
      <div className="">
        <div className="px-4 flex text-lg flex-col border-b">
          <div className="flex flex-col pt-2">
            <div className="w-full gap-2 items-center flex">
              <Link
                className="w-[44px] h-10 rounded-full overflow-hidden"
                href={`/${author.username}`}
              >
                <Image
                  className="w-10 h-10"
                  src={author.image}
                  alt=""
                  width={40}
                  height={40}
                />
              </Link>
              <div className="flex w-full justify-between">
                <div className="flex flex-col">
                  <Link href={`/${author.username}`}>
                    <span className="font-bold text-[15px] text-gray-200">
                      {author.firstname} {author.lastname}
                    </span>
                  </Link>
                  <Link className="-mt-2" href={`/${author.username}`}>
                    <span className="text-[15px] text-gray-400 ">
                      @{author.username}
                    </span>
                  </Link>
                </div>
                <div className="">...</div>
              </div>
            </div>
            <div className="pb-3 flex flex-col w-full">
              <div className="flex flex-col gap-2 pt-3 text-gray-200 border-b border-gray-500 pb-2">
                <span>{post.content}</span>
                {post.imageUrl && (
                  <Image
                    className="w-full rounded-3xl mt-3"
                    src={post.imageUrl}
                    alt=""
                    width={999}
                    height={999}
                  />
                )}
                <div className="border-b border-gray-500">
                  <span className="text-gray-400 text-[15px]">
                    {time} · {date_string}
                  </span>
                </div>
                <div className="py-3 flex gap-3 text-base text-gray-400">
                  <div>{post.retweets.length} Retweets </div>
                  <div>{post.likes.length} Likes </div>
                  <div>{post.bookmarks.length} Bookmarks</div>
                </div>
              </div>
              <div className="flex justify-around w-full pt-1 pb-4 items-center mt-3 border-b border-gray-500  text-gray-500">
                <button className="flex items-center gap-2">
                  <FaRegComment size={25}/>
                </button>
                <button
                  onClick={retweetTweet}
                  className="flex items-center gap-2"
                  disabled={retweetDisabled}
                >
                  {isRetweeted ? <FaRetweet color="green" size={25} /> : <FaRetweet size={25} />}{" "}
                </button>
                <button
                  onClick={likeTweet}
                  className="flex items-center gap-2"
                  disabled={likeDisabled}
                >
                  {isLiked ? <AiFillHeart color="red" size={25} /> : <AiOutlineHeart size={25} />}{" "}
                </button>
                <button
                  onClick={bookmarkTweet}
                  className="flex items-center gap-2"
                  disabled={bookmarkdisabled}
                >
                  {isBookmarked ? (
                    <FaBookmark color="blue" size={25} />
                  ) : (
                    <FaRegBookmark size={25} />
                  )}
                </button>
                <button className="flex items-center gap-2">
                  <FiShare size={25} />
                </button>
              </div>
              <div className="">
                <CommentInput postid={post.id} />
              </div>
              
            </div>
            
          </div>
        </div>

        {children}
      </div>
    </div>
  );
};

export default PostPage;

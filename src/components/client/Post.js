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

const Post = ({ post, profile, author, bookmarked, liked, retweeted }) => {
  const router = useRouter();
  const [isBookmarked, setisBookmarked] = useState(bookmarked ? true : false);
  const [isLiked, setisLiked] = useState(liked ? true : false);
  const [isRetweeted, setisRetweeted] = useState(retweeted ? true : false);
  const [bookmarkdisabled, setBookmarkdisabled] = useState(false);
  const [likeDisabled, setLikeDisabled] = useState(false);
  const [retweetDisabled, setRetweetDisabled] = useState(false);

  const handleClick = (e) => {
    if (!e.target.closest("button") && !e.target.closest("a")) {
      console.log("open post");
      router.push(`/${author.username}/status/${post.id}`);
    }
  };

  console.log(author);
  const date = new Date();
  const max_time_diff = 1000 * 60 * 60 * 23;
  const diff = date - post.createdAt;
  let postCreationTime;
  if (diff < 60 * 1000) {
    postCreationTime = `${Math.ceil(diff / 1000)}s`;
  } else if (diff < 60 * 60 * 1000) {
    postCreationTime = `${Math.ceil(diff / (1000 * 60))}m`;
  } else if (diff < max_time_diff) {
    postCreationTime = `${Math.ceil(diff / (1000 * 60 * 60))}hrs`;
  } else {
    postCreationTime = post.createdAt
      .toDateString()
      .slice(4, -4)
      .trim()
      .split(" ")
      .join(", ");
  }

  const likeTweet = () => {
    setLikeDisabled(true);
    console.log("like tweet");
    if(isLiked) {
      setisLiked(false);
      post.likes = post.likes.filter((like) => like.userId !== profile.id);
    } else {
      setisLiked(true);
      post.likes.push({userId: profile.id})
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
        if(!data.success) {
          if(isLiked) {
            setisLiked(false);
            post.likes = post.likes.filter((like) => like.userId !== profile.id);
          } else {
            setisLiked(true);
            post.likes.push({userId: profile.id})
          }
        }
        setLikeDisabled(false);
      });
  };

  const bookmarkTweet = () => {
    setBookmarkdisabled(true);
    console.log("bookmark tweet");
    if(isBookmarked) {
      setisBookmarked(false);
      post.bookmarks = post.bookmarks.filter((bookmark) => bookmark.userId !== profile.id);
    } else {
      setisBookmarked(true);
      post.bookmarks.push({userId: profile.id})
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
        if(!data.success) {
          if(isBookmarked) {
            setisBookmarked(false);
            post.bookmarks = post.bookmarks.filter((bookmark) => bookmark.userId !== profile.id);
          } else {
            setisBookmarked(true);
            post.bookmarks.push({userId: profile.id})
          }
        }
        setBookmarkdisabled(false);

      });
  };

  const retweetTweet = () => {
    setRetweetDisabled(true);
    console.log("retweet tweet");
    if(isRetweeted) {
      setisRetweeted(false);
      post.retweets = post.retweets.filter((retweet) => retweet.userId !== profile.id);
    } else {
      setisRetweeted(true);
      post.retweets.push({userId: profile.id})
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
        if(!data.success) {
          if(isRetweeted) {
            setisRetweeted(false);
            post.retweets = post.retweets.filter((retweet) => retweet.userId !== profile.id);
          } else {
            setisRetweeted(true);
            post.retweets.push({userId: profile.id})
          }
        }
        setRetweetDisabled(false);

      });
  };



  return (
    <div
      className="px-4 flex cursor-pointer flex-col border-b"
      onClick={(e) => handleClick(e)}
    >
      <div className="pt-3"></div>
      <div className="flex items-start">
        <div className="min-w-[40px] mr-3">
          <Link href={`/${author.username}`}>
            <Image
              className="w-10 h-10 rounded-full"
              src={author.image}
              alt=""
              width={10}
              height={10}
            />
          </Link>
        </div>
        <div className="pb-3 flex flex-col w-full">
          <div className="fex fex-col justify-center">
            <div className="text-xs -mt-2 -mb-2">{post.parentId && <span>replied to a post</span>}</div>
          <div className="flex justify-between mb-0.5">
            <div className="flex gap-2">
              <Link href={`/${author.username}`}>
                <span className="font-bold text-gray-200">{author.firstname} {author.lastname}</span>
              </Link>
              <Link href={`/${author.username}`}>
                <span className="text-sm text-gray-400">
                  @{author.username}
                </span>
              </Link>
              <div className="text-gray-400">.</div>
              <div className="text-gray-400">{postCreationTime}</div>
            </div>
            <div className="">...</div>
          </div>
          </div>
          <div className=" text-gray-200">
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
          </div>
          <div className="flex justify-between py-1 text-lg mt-3 text-gray-500">
            <button className="flex items-center gap-2">
              <FaRegComment />{" "}
              <span className="text-base">{post.comments.length}</span>
            </button>
            <button onClick={retweetTweet} className="flex items-center gap-2" disabled={retweetDisabled}>
              {isRetweeted ? <FaRetweet color="green" />:<FaRetweet />}{" "}
              <span className={isRetweeted ? "text-green-600":"text-base"}>{post.retweets.length}</span>
            </button>
            <button onClick={likeTweet} className="flex items-center gap-2" disabled={likeDisabled}>
              {isLiked ? <AiFillHeart color="red" /> : <AiOutlineHeart />}{" "}
              <span className={isLiked ? "text-red-600":"text-base"}>
                {post.likes.length}
              </span>
            </button>
            <button onClick={bookmarkTweet} className="flex items-center gap-2" disabled={bookmarkdisabled}>
              {isBookmarked ? <FaBookmark color="blue" /> : <FaRegBookmark />}
              <span className={isBookmarked ? "text-blue-600": "text-base"}>
                {post.bookmarks.length}
              </span>
            </button>
            <button className="flex items-center gap-2">
              {" "}
              <FiShare />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;

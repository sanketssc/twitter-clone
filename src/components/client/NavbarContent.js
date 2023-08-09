"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BiHomeCircle, BiSolidHomeCircle, BiSolidSearch, BiSearch } from "react-icons/bi";
import { BsPersonFill, BsPerson, BsTwitter } from "react-icons/bs";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { SignOut } from "./buttons";
import { GoSignOut } from "react-icons/go";

const NavbarContent = ({ profile }) => {
  const pathname = usePathname();
  return (
    <div className="w-full min-h-full flex flex-col justify-between">
      <div className="flex xs:flex-col text-2xl xs:text-3xl w-full justify-between border-t xs:border-t-0 items-center xl:items-start gap-8 px-4 py-4">
        <Link className="hidden xs:flex pl-8" href={`/`}>
          <div className="flex gap-2 ">
            <BsTwitter className="" />
          </div>
        </Link>

        <Link href="/">
          <div className="flex gap-2 items-center hover:bg-gray-700/90 xl:px-6 px-3 py-3 rounded-full">
            {pathname === "/" ? (
              <BiSolidHomeCircle className="font-light" />
            ) : (
              <BiHomeCircle />
            )}
            <div className="font-light hidden xl:flex text-2xl">
              <span className={pathname === "/" ? "font-bold" : ""}>Home</span>
            </div>
          </div>
        </Link>
        <Link href="/explore">
          <div className="flex gap-2 items-center hover:bg-gray-700/90 xl:px-6 px-3 py-3 rounded-full">
            {pathname === "/explore" ? (
              <BiSolidSearch  />
            ) : (
              <BiSearch  />
            )}
            <div className="font-light hidden xl:flex text-2xl">
              <span className={pathname === "/explore" ? "font-bold" : ""}>
                Explore
              </span>
            </div>
          </div>
        </Link>
        <Link href={`/${profile.username}/likes`}>
          <div className="flex gap-2 items-center hover:bg-gray-700/90 xl:px-6 px-3 py-3 rounded-full">
            {pathname === `/${profile.username}/likes` ? (
              <AiFillHeart className="font-light" />
            ) : (
              <AiOutlineHeart />
            )}
            <div className="font-light hidden xl:flex text-2xl">
                <span className={pathname === `/${profile.username}/likes` ? "font-bold" : ""}>Likes</span>
                </div>
          </div>
        </Link>

        <Link href={`/${profile.username}/bookmarks`}>
          <div className="flex gap-2 items-center hover:bg-gray-700/90 xl:px-6 px-3 py-3 rounded-full">
            {pathname === `/${profile.username}/bookmarks` ? (
              <FaBookmark className="font-light" />
            ) : (
              <FaRegBookmark />
            )}
            <div className="font-light hidden xl:flex text-2xl">
                <span className={pathname === `/${profile.username}/bookmarks` ? "font-bold" : ""}>Bookmarks</span>
            </div>
          </div>
        </Link>
        <Link href={`/${profile.username}`}>
          <div className="flex gap-2 items-center hover:bg-gray-700/90 xl:px-6 px-3 py-3 rounded-full">
            {pathname === `/${profile.username}` ? (
              <BsPersonFill className="font-light" />
            ) : (
              <BsPerson />
            )}
            <div className="font-light hidden xl:flex text-2xl">
                <span className={pathname === `/${profile.username}` ? "font-bold" : ""}>Profile</span>
            </div>
          </div>
        </Link>
      </div>
      <div className="hidden xs:flex gap-2">
        <SignOut GoSignOut={GoSignOut} />
      </div>
    </div>
  );
};

export default NavbarContent;

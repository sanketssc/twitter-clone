import React from "react";
import NavbarContent from "./client/NavbarContent";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { BsTwitter } from "react-icons/bs";

const Navbar = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <Link
        className="hidden text-4xl xs:flex justify-between items-center px-5 py-5"
        href={`/`}
      >
        <div className="flex gap-2 ">
          <BsTwitter className="" />
        </div>
      </Link>
    );
  }

  const profile = await prisma.profile.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!profile) {
    return (
      <Link
        className="hidden text-4xl xs:flex justify-between items-center px-5 py-5"
        href={`/`}
      >
        <div className="flex gap-2 ">
          <BsTwitter className="" />
        </div>
      </Link>
    );
  }

  return <NavbarContent profile={profile} />;
};

export default Navbar;

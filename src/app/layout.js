import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "../components/Navbar";
import prisma from "@/lib/prisma";
import GetUserName from "../components/client/getUserName";

import { NextAuthProvider } from "../components/client/SessionProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import { SignIn, SignOut } from "../components/client/buttons";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);
  console.log(session);
  let profile = null;
  if(session){
    profile = await prisma.profile.findUnique({
      where: {
        email: session.user.email,
      },
    });

  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <div className="flex justify-center min-h-screen max-h-screen">
            <div className="fixed xs:relative bg-black  bottom-0 w-screen h-16 xs:h-screen  xl:max-w-[300px] xl:min-w-[300px] xs:max-w-[88px] xs:min-w-[88px] overflow-x-hidden">
              <Navbar />
            </div>
            <div className="max-w-[598px] w-full max-h-screen overflow-y-scroll h-[2000px] sm:border-r  sm:border-l ">
              {session ? 
                profile ?
                children : <GetUserName email={session.user.email} />
               : (
                <div className="absolute">
                  Not signed in <br />
                  <SignIn provider={"google"} />
                </div>
              )}
            </div>
            <div className="hidden sticky max-h-screen  lg:block lg:min-w-[350px]">
              right
            </div>
          </div>
        </NextAuthProvider>
      </body>
    </html>
  );
}

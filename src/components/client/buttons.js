"use client"

import { signIn, signOut } from "next-auth/react"



export const SignOut = ({GoSignOut}) => {

    return <button className="flex gap-2 text-3xl items-center justify-center hover:bg-gray-700/90  px-6 py-3 rounded-full" onClick={() => signOut()}>
        <GoSignOut />
        <div className="hidden xl:flex text-xl ">Sign out
        </div></button>
}

export const SignIn = ({provider}) => {
    return <button onClick={() => signIn(provider)}>Sign IN</button>
}
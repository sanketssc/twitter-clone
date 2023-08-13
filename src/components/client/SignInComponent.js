import React from "react";
import { SignIn } from "./buttons";

const SignInComponent = () => {
  return (
    <div className="flex flex-col gap-10 justify-center items-center w-4/5 border mx-auto h-96 mt-64 rounded-3xl px-10 py-10">
      <h1 className="text-7xl">Welcome</h1>
      <span className="text-2xl"> You are Not signed in </span>

      <div className=" text-xl border px-8 py-2 rounded-full hover:bg-neutral-900">
        <SignIn provider={"google"} />
      </div>
    </div>
  );
};

export default SignInComponent;

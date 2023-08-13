"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AiOutlineClose } from "react-icons/ai";
import { BsTwitter } from "react-icons/bs";

const GetUserName = () => {
  const [userName, setUserName] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const router = useRouter();

  const getImageUrl = async () => {
    const data = new FormData();
    let validImage = null;
    const xx = ["image/jpeg", "image/jpg", "image/png"].forEach((type) => {
      if (type === image.type) {
        validImage = image;
      }
    });
    if (validImage === null) {
      alert("\nPlease upload valid Image file\nUpload a jpg/png file");
    } else {
      data.append("file", validImage);
      data.append("upload_preset", "unsigned-upload");

      try {
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/sanket-images/image/upload",
          {
            method: "post",
            body: data,
          }
        );
        const rjson = await res.json();
        return rjson.secure_url;
      } catch (err) {
        console.log(err);
      }
    }
  };

  const updateUserName = async () => {
    setLoading(true);

    let url = "";
    if (image) {
      url = await getImageUrl();
    }
    if (userName.trim().length < 4) {
      setError("Username must be atleast 4 characters long");
      return;
    }
    console.log(userName, firstname, lastname, url);
    const res = await fetch("/api/check", {
      method: "post",
      body: JSON.stringify({
        username: userName.trim(),
        firstname,
        lastname,
        image: url,
      }),
    });
    const { success, error } = await res.json();
    if (error) {
      setError(error);
      setLoading(false);
      return;
    }
    console.log(success);
    if (success) {
      router.refresh();
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center text-7xl">
        <BsTwitter size={200} />
      </div>
    );
  }

  return (
    <div>
      <form className="flex flex-col gap-10 justify-center items-center w-11/12 border mx-auto h-fit mt-32 rounded-3xl px-10 py-10">
        <h1 className="text-5xl">Welcome</h1>
        <div className="flex gap-8 items-center text-xl">
          <label htmlFor="username">Username</label>
          <input
            className="bg-black border px-4 py-2 rounded-lg"
            id="username"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Username"
          />
        </div>
        <div className="flex gap-8 items-center text-xl">
          <label htmlFor="firstname">First Name</label>
          <input
            className="bg-black border px-4 py-2 rounded-lg"
            id="firstname"
            type="text"
            placeholder="First Name"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />
        </div>
        <div className="flex gap-8 items-center text-xl">
          <label htmlFor="lastname">Last Name</label>
          <input
            className="bg-black border px-4 py-2 rounded-lg"
            id="lastname"
            type="text"
            placeholder="Last Name"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
        </div>
        <div className=" flex gap-8 items-center text-xl">
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <label
            htmlFor="imageInput"
            className="cursor-pointer border  px-4 py-2 rounded-lg"
          >
            Profile Picture
          </label>
          {image && (
            <div className="relative mt-8">
              <button
                className="absolute rounded-full opacity-75 bg-[#152025] px-2 py-2 font-bold right-4 top-4  text-2xl"
                onClick={() => {
                  setImage(null);
                }}
              >
                <AiOutlineClose size={20} />
              </button>
              <Image
                src={URL.createObjectURL(image)}
                alt=""
                className="w-full object-cover max-h-fit"
                width={500}
                height={500}
              ></Image>
            </div>
          )}
        </div>

        <button
          type="button"
          className="rounded-full border px-20 py-2 text-2xl"
          onClick={updateUserName}
        >
          Submit
        </button>
      </form>
      {error && (
        <div className="text-red-600 text-center mt-10 text-xl">{error}</div>
      )}
    </div>
  );
};

export default GetUserName;

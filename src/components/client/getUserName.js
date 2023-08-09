"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AiOutlineClose } from "react-icons/ai";

const GetUserName = () => {
  const [userName, setUserName] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");

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
    let url = ''
    if (image) {
      url = await getImageUrl();
    }
    if (userName.trim().length < 4) {
      setError("Username must be atleast 4 characters long");
      return;
    }
    console.log(userName, firstname, lastname, url)
    const res = await fetch("/api/check", {
      method: "post",
      body: JSON.stringify({ username: userName.trim(), firstname, lastname, image: url  }),
    });
    const { success, error } = await res.json();
    if (error) {
      setError(error);
      return;
    }
    console.log(success);
    if (success) {
      router.refresh();
    }
  };

  return (
    <div className=" ">
      <form>
        <h1>Welcome</h1>
        <div>
          <label htmlFor="username">Username</label>
          <input
            className="bg-black border"
            id="username"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Username"
          />
        </div>
        <br />
        <div>
          <label htmlFor="firstname">First Name</label>
          <input
            className="bg-black border"
            id="firstname"
            type="text"
            placeholder="First Name"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="lastname">Last Name</label>
          <input
            className="bg-black border"
            id="lastname"
            type="text"
            placeholder="Last Name"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
        </div>
        <div className="">
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <label htmlFor="imageInput" className="cursor-pointer">
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
          )
                }
        </div>
        <br />
        <br />

        <button type="button" onClick={updateUserName}>
          Submit
        </button>
      </form>
      {error && <div className="text-red-800">{error}</div>}
    </div>
  );
};

export default GetUserName;

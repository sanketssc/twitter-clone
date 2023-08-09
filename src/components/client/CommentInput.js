"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import {  AiOutlineClose } from "react-icons/ai";
import { LiaImage } from "react-icons/lia";
import { useRouter } from "next/navigation";

const PostInput = ({postid}) => {
  // const post = React.useRef(null);
  const [test, setTest] = React.useState("");
  const [image, setImage] = React.useState(null);
  const length = test.length > 140 ? 140 - test.length : test.length;
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

  const postTweet = async () => {
    let url = "";
    if (image) {
      url = await getImageUrl();
      
    }
    console.log(url);
    const res = await fetch("/api/comment", {
      method: "post",
      body: JSON.stringify({ content: test, imageUrl: url, parentId: postid }),
    });
    const success = res.json();
    if (success) {
      setImage(null);
      setTest("");
      document.getElementById('editable').innerText = ''
      router.refresh();

    }
  };
  function removeFile() {
    const fileInput = document.getElementById("fileInput");
    fileInput.value = "";
  }
  useEffect(() => {
    const handleImagePaste = (e) => {
      const inputType = e.inputType;
      console.log(inputType);
      if (inputType === "insertFromDrop" || inputType === "insertFromPaste") {
        console.log(1);

        if (e.target.children.length) {
          console.log(2);
          for (const x of e.target.children) {
            if (x.tagName === "IMG") {
              fetch(x.src)
                .then((res) => res.blob())
                .then((blob) => {
                  const file = new File([blob], "clipboard_image.png", blob);
                  setImage(file);
                });
              x.remove();
            }
          }
        }
      }
      setTest(e.target.innerText)
    };
    document
      .getElementById("editable")
      .addEventListener("input", handleImagePaste);
      
  }, []);


  
  
  return (
    <div className="mx-auto px-5">
      <div
        className="whitespace-pre-wrap text-xl px-1 pt-4 font-semibold focus:outline-none cursor-text"
        // ref={post}
        contentEditable
        id="editable"
        placeholder="Post a Reply"
        onInput={e =>{
          setTest(e.target.innerText)
        }}
      ></div>
      {/* <button onClick={handleClick}>print text to console</button> */}
      <div className="relative -mb-8">
        <div
          className={
            length > 120
              ? "text-yellow-500" + " absolute right-4"
              : length < 0
              ? "text-red-600" + " absolute right-4"
              : "text-blue-500" + " absolute right-1/2"
          }
        >
          {test.trim() !== "" ? length : 0}/{140}
        </div>
      </div>
      {image && (
        <div className="relative mt-8">
          <button
            className="absolute rounded-full opacity-75 bg-[#152025] px-2 py-2 font-bold right-4 top-4  text-2xl"
            onClick={() => {
              setImage(null);
              removeFile();
            }}
          >
            <AiOutlineClose size={20} />
          </button>
          <Image
            src={URL.createObjectURL(image)}
            alt=""
            className="w-full h-full max-h-fit"
            width={500}
            height={500}
          ></Image>
        </div>
      )}
      <br />
      <div className="flex justify-between items-center">
        <div className=" flex justify-center items-center">
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              console.log(e)
              if (e.target.files.length > 0) {
                setImage(e.target.files[0]);
              }
              console.log(image);
            }}
          ></input>
          <label htmlFor="fileInput" className="px-4 py-2 cursor-pointer m-1">
            <LiaImage size={23} color="rgb(29, 155, 240)" />
          </label>
        </div>
        <button
          className="bg-blue-600 disabled:bg-blue-400 px-4 py-2 rounded-full m-1"
          disabled={length <= 0 && image === null}
          onClick={postTweet}
        >
          {/* {console.log((length <= 0 && image === null), length, image)} */}
          Tweet
        </button>
      </div>
    </div>
  );
};

export default PostInput;

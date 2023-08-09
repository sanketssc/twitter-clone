"use client";
import React, { useState, useEffect } from "react";
import { BiLogoTwitter } from "react-icons/bi";
import Image from "next/image";
import {  AiOutlineClose } from "react-icons/ai";
import { LiaImage } from "react-icons/lia";
import {CiTwitter} from 'react-icons/ci'

const MobilePost = () => {
  const [state, setState] = useState(false);
  const handleClick = () => {
    setState(true);
  };


  const [text, setText] = React.useState("");
  const [image, setImage] = React.useState(null);
  const [postSuccess, setPostSuccess] = useState(false);
  const length = text.length > 140 ? 140 - text.length : text.length;

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
        )
        const rjson = await res.json();

        
        
        return rjson.secure_url
        
        
      } catch (err) {
        console.log(err);
      }
    }
  };

  const postTweet = async () => {
    setState(false)
    let url = ''
    if (image) {
      url = await getImageUrl();
    }

    
    const res = await fetch("/api/create", {
      method: "post",
      body: JSON.stringify({ content: text, imageUrl: url }),
    });
    const success = res.json();
    if (success) {
      setImage(null);
      setText("");
      setPostSuccess(true);
      setTimeout(() =>{
        setPostSuccess(false)
      }, 1000)
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
      setText(e.target.innerText)
    };

        const x = document
        .getElementById("mobileEditable")
        console.log(x)
        
        if(x){
            x.addEventListener("input", handleImagePaste);
            x.innerText = ""

        }

      
  }, [state]);



  if (state) {
    return (
      <div className="fixed top-0 w-screen h-screen bg-black z-10">
        <div className="flex justify-between h-20 items-center ">
          <button className="ml-6 text-2xl mb-3" onClick={() => setState(false)}>
            <AiOutlineClose />
          </button>
          <button className=" mr-11 px-8 py-1 bg-blue-600 disabled:bg-blue-400 rounded-full" onClick={postTweet} disabled={length <= 0 && image === null}>
            Tweet
          </button>
        </div>
        <div className="mx-auto px-5">
      <div
        className="whitespace-pre-wrap text-xl px-1 py-5 h-full font-semibold focus:outline-none cursor-text border-b border-gray-600 border-dashed"
        // ref={post}
        contentEditable
        id="mobileEditable"
        placeholder="Whats Happening?!"
        
      ></div>
      {/* <button onClick={handleClick}>print text to console</button> */}
      <div className="relative">
        <div
          className={
            length > 120
              ? "text-yellow-500" + " absolute right-4"
              : length < 0
              ? "text-red-600" + " absolute right-4"
              : "text-blue-500" + " absolute right-4"
          }
        >
          {text.trim() !== "" ? length : 0}/{140}
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
            id="fileInputMob"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              console.log(e)
              console.log(e.target.files.length)
              if (e.target.files.length > 0) {
                setImage(e.target.files[0]);
                console.log(e.target.files[0])
              }
              console.log(image);
            }}
          ></input>
          <label htmlFor="fileInputMob" className="px-4 py-2 cursor-pointer m-1">
            <LiaImage size={23} color="rgb(29, 155, 240)" />
          </label>
        </div>
        
      </div>
    </div>
        
      </div>
    );
  }
  return (
    <>
    {postSuccess && (<div className=" absolute top-10 w-1/2 right-1/4 h-12 text-xl font-semibold border-blue-500 border-2 text-blue-500  px-2 py-2 bg-gray-400/10 backdrop-blur-sm z-20 rounded-full text-center flex justify-center items-center"> <CiTwitter size={30}/> Tweet success</div>)}
    <div
      className="absolute bottom-24 w-20 h-20 bg-blue-600 text-white rounded-full cursor-pointer right-12 flex items-center justify-center  text-5xl"
      onClick={handleClick}
    >
      <div className="">
        <BiLogoTwitter />
      </div>
    </div>
    
    </>
  );
};

export default MobilePost;

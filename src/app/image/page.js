"use client";
import Image from "next/image";
import { useState } from "react";

const ImagePage = () => {
  const [image, setImage] = useState();
  const [url, setUrl] = useState("");
  const handleClick = async () => {
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
        setUrl(rjson.secure_url);

        console.log(rjson.secure_url);
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <>
      <input type="file" onChange={(e) => setImage(e.target.files[0])}></input>
      {image && (
        <Image
          src={URL.createObjectURL(image)}
          width={100}
          height={100}
          alt=""
        />
      )}
      <button onClick={handleClick}>upload</button>
      {url && <Image src={url} alt="" width={200} height={200} />}
    </>
  );
};

export default ImagePage;

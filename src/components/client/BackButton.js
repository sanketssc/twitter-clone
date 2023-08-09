"use client";
import { AiOutlineArrowLeft } from "react-icons/ai";

const BackButton = () => {
  return (
    <button onClick={() => window.history.back()}>
      <AiOutlineArrowLeft />
    </button>
  );
};

export default BackButton;

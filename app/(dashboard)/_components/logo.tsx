"use client";//added
import React from "react";
import Image from "next/image";

export const Logo = () => {
  return (
    <Image
      src="/img/Logo.png"
      alt="Logo"
      width={70}
      height={70}
      layout="intrinsic"
    />
  );
};
//
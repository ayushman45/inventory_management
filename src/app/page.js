"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation"
import { getToken } from "./helper/token";

export default function Home() {
  const navigate = useRouter();
  useEffect(()=>{
    if(getToken()){
        navigate.push("/dashboard");

    }
    else{
      navigate.push("/login");

    }

  }, [])
  return (
    <div>

    </div>
  );
}

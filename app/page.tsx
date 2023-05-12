"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

export default function Login() {
  const idRef = useRef<HTMLInputElement>(null);
  const pwdRef = useRef<HTMLInputElement>(null);

  const logIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const idValue = idRef.current?.value;
    const pwdValue = pwdRef.current?.value;

    if (idValue === "jangmi" && pwdValue === "123") {
      window.location.replace("/chatList");
    } else {
      alert("아이디 혹은 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <>
      <header className="bg-white p-4 mt-32 text-center">
        <Image alt="logo" src={"/images/small_logo.png"} width={500} height={200} priority={true} />
        <h1 className="text-2xl font-bold">Welcome to TalkTalk</h1>
      </header>

      <form method="post" id="login-form" className="p-4" onSubmit={logIn}>
        <input
          name="username"
          type="text"
          placeholder="Enter your ID"
          className="border p-2 mb-2 w-full rounded-md"
          autoComplete="off"
          ref={idRef}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="border p-2 mb-2 w-full rounded-md "
          autoComplete="off"
          ref={pwdRef}
        />
        <input
          type="submit"
          value="Log In"
          className="bg-blue-700 mb-3 rounded-md text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer w-full"
        />
        <div className="flex justify-end">
          <a href="/signUp" className="text-blue-500 ml-auto">
            If you don't have an account, go sign up!
          </a>
        </div>
      </form>
    </>
  );
}

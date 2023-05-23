"use client";
import axios from "axios";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useCookies } from "react-cookie";

export default function Login() {
  const [cookies] = useCookies(["Authentication"]);
  const authenticationCookie = cookies["Authentication"];
  const idRef = useRef<HTMLInputElement>(null);
  const pwdRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (authenticationCookie && authenticationCookie.accessToken) {
      window.location.replace("/chatList");
    }
  }, []);

  const logIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const idValue = idRef.current?.value;
    const pwdValue = pwdRef.current?.value;

    const userInfo = {
      id: idValue,
      password: pwdValue,
    };

    axios
      .post("/api/logIn", userInfo)
      .then((response) => {
        window.location.replace("/chatList");
      })
      .catch((error) => {
        alert("아이디 또는 비밀번호를 확인해주세요.");
      });
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

"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import axios from "axios";
import { User } from "../component/types";

export default function SignUp() {
  // input값
  const nameRef = useRef<HTMLInputElement>(null);
  const idRef = useRef<HTMLInputElement>(null);
  const pwdRef = useRef<HTMLInputElement>(null);
  const confirmPwdRef = useRef<HTMLInputElement>(null);

  // 유효성 에러 체크용
  const [nameValid, setNameValid] = useState<string>("");
  const [idValid, setIdValid] = useState<string>("");
  const [pwdValid, setPwdValid] = useState<string>("");
  const [confirmPwdValid, setConfirmPwdValid] = useState<string>("");

  // 비밀번호 일치 체크
  const passwordCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    const pwdValue = pwdRef.current?.value || "";
    const confirmValue = confirmPwdRef.current?.value || "";

    if (pwdValue === confirmValue) {
      setConfirmPwdValid("");
    }
  };

  // 아이디 중복체크
  const isDuplicateId = async (userInfo: User) => {
    try {
      const response = await axios.post("/api/isDuplicate", userInfo);
      return response.data;
    } catch (error) {
      alert(error);
      return false;
    }
  };

  const signUp = async (event: React.FormEvent<HTMLFormElement>) => {
    console.log("들어오냐");
    event.preventDefault();

    const nameValue = nameRef.current?.value || "";
    const idValue = idRef.current?.value || "";
    const pwdValue = pwdRef.current?.value || "";
    const confirmValue = confirmPwdRef.current?.value || "";

    if (!nameValue) {
      setNameValid("error");
      nameRef.current?.focus();
      return false;
    } else {
      setNameValid("");
    }

    if (!idValue) {
      setIdValid("emptyError");
      idRef.current?.focus();
      return false;
    } else {
      setIdValid("");
    }

    if (!pwdValue) {
      setPwdValid("error");
      pwdRef.current?.focus();
      return false;
    } else {
      setPwdValid("");
    }

    if (!confirmValue) {
      setConfirmPwdValid("emptyError");
      confirmPwdRef.current?.focus();
      return false;
    } else {
      setConfirmPwdValid("");
    }

    if (pwdValue !== confirmValue) {
      setConfirmPwdValid("notMatch");
      confirmPwdRef.current?.focus();
      return false;
    }

    const userInfo: User = {
      id: idValue,
      password: pwdValue,
      name: nameValue,
    };

    const isDuplicate = await isDuplicateId(userInfo);
    console.log(isDuplicate);
    if (isDuplicate) {
      setIdValid("duplicate");
      idRef.current?.focus();
      return false;
    }

    // 유효성 다 통과하면 회원가입 form 전달
    axios
      .post("/api/signUp", userInfo)
      .then((response) => {
        alert("회원가입이 완료되었습니다. 로그인페이지로 이동합니다.");
        window.location.replace("/");
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <div className="bg-grey-lighter max-h-screen flex flex-col mt-[10%]">
      <div className="container max-w-sm mx-auto mt-8 flex flex-col items-center justify-center px-2">
        <Image
          alt="logo"
          placeholder="blur"
          blurDataURL={"/images/small_logo.png"}
          src={"/images/small_logo.png"}
          width={300}
          height={100}
        />
        <div className="bg-white px-6 py-1 rounded text-black w-full h-[400px] ">
          <form method="post" onSubmit={signUp}>
            <input
              type="text"
              className="block border border-grey-light w-full p-3 rounded mb-3"
              name="fullname"
              placeholder="Name"
              maxLength={10}
              ref={nameRef}
            />
            {nameValid !== "error" ? (
              ""
            ) : (
              <div className="bg-white px-2 text-black w-full mb-2 text-rose-600 text-sm">
                <p>이름을 입력하세요</p>
              </div>
            )}
            <input
              type="text"
              className="block border border-grey-light w-full p-3 rounded mb-3"
              name="id"
              placeholder="ID"
              minLength={4}
              maxLength={15}
              ref={idRef}
            />
            {idValid == "emptyError" ? (
              <div className="bg-white px-2 text-black w-full mb-2 text-rose-600 text-sm">
                <p>아이디를 입력하세요</p>
              </div>
            ) : idValid == "duplicate" ? (
              <div className="bg-white px-2 text-black w-full mb-2 text-rose-600 text-sm">
                <p>중복된 아이디입니다.</p>
              </div>
            ) : (
              ""
            )}
            <input
              type="password"
              autoComplete="password"
              className="block border border-grey-light w-full p-3 rounded mb-3"
              name="password"
              placeholder="Password"
              minLength={4}
              maxLength={20}
              ref={pwdRef}
            />
            {pwdValid !== "error" ? (
              ""
            ) : (
              <div className="bg-white px-2 text-black w-full mb-2 text-rose-600 text-sm">
                <p>비밀번호를 입력하세요</p>
              </div>
            )}
            <input
              type="password"
              autoComplete="confirm_password"
              className="block border border-grey-light w-full p-3 rounded mb-3"
              name="confirm_password"
              placeholder="Confirm Password"
              minLength={4}
              maxLength={20}
              ref={confirmPwdRef}
              onChange={passwordCheck}
            />
            {confirmPwdValid === "emptyError" ? (
              <div className="bg-white px-2 text-black w-full mb-2 text-rose-600 text-sm">
                <p>비밀번호를 한번 더 입력하세요</p>
              </div>
            ) : confirmPwdValid === "notMatch" ? (
              <div className="bg-white px-2 text-black w-full mb-2 text-rose-600 text-sm">
                <p>비밀번호가 일치하지 않습니다.</p>
              </div>
            ) : (
              ""
            )}

            <button
              type="submit"
              className="w-full text-center bg-blue-700 py-3 rounded bg-green text-white hover:bg-green-dark focus:outline-none my-1"
            >
              Create Account
            </button>
          </form>

          <div className="text-center text-sm text-grey-dark mt-4">
            By signing up, you agree to
            <br /> the
            {/* <a className="no-underline border-b border-grey-dark text-grey-dark" href="#"> */}
            Terms of Service
            {/* </a>{" "} */}
            and
            {/* <a className="no-underline border-b border-grey-dark text-grey-dark" href="#"> */}
            Privacy Policy
            {/* </a> */}
          </div>
        </div>

        <div className="text-blue-500 mt-6">
          Already have an account?
          <a className="no-underline border-b border-blue text-blue" href="/">
            Log in
          </a>
          .
        </div>
      </div>
    </div>
  );
}

"use client";
import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import BottomNav from "../component/bottomNav";
import { UserInfo } from "../component/types";
import { AuthContext, AuthContextType } from "../component/authContext";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function chatList() {
  const [profileImg, setProfileImg] = useState<File>();
  const [newProfileImg, setNewProfileImg] = useState("");
  const [image, setImage] = useState("/images/basicProfile.png");
  const profileRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const [nameValid, setNameValid] = useState<string>("");
  const [pwdValid, setPwdValid] = useState<string>("");
  const [confirmPwdValid, setConfirmPwdValid] = useState<string>("");

  const authContext = useContext<AuthContextType>(AuthContext);
  const [user, setUser] = useState<UserInfo>({} as UserInfo);
  const router = useRouter();

  useEffect(() => {
    authContext
      .getAuthUser()
      .then((userData) => {
        if (userData) {
          setUser(userData);
        }
      })
      .catch((error) => {
        console.log("Error fetching user:", error);
      });
  }, []);

  // https://falsy.me/nextjs-api-routes%EB%A5%BC-%ED%86%B5%ED%95%B4-api-%EC%84%9C%EB%B2%84%EB%A1%9C-%ED%8C%8C%EC%9D%BC-%EB%B3%B4%EB%82%B4%EA%B8%B0/
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    const nameValue = nameRef.current?.value!;
    const pwdValue = passwordRef.current?.value!;
    const profileValue = profileRef.current?.value!;
    const confirmPwdValue = confirmPasswordRef.current?.value!;

    if (!nameValue) {
      setNameValid("error");
      nameRef.current?.focus();
      return false;
    } else {
      setNameValid("");
    }

    if (!pwdValue) {
      setPwdValid("error");
      passwordRef.current?.focus();
      return false;
    } else {
      setPwdValid("");
    }

    if (!confirmPwdValue) {
      setConfirmPwdValid("emptyError");
      confirmPasswordRef.current?.focus();
      return false;
    } else {
      setConfirmPwdValid("");
    }

    if (pwdValue !== confirmPwdValue) {
      setConfirmPwdValid("notMatch");
      confirmPasswordRef.current?.focus();
      return false;
    } else {
      setConfirmPwdValid("");
    }

    // 이미지 파일을 formData에 담아서 서버에 보내기
    if (profileImg) {
      formData.append("profileImg", profileImg);
    }
    formData.append("originalName", profileValue);
    formData.append("id", user.id);
    formData.append("name", nameValue);
    formData.append("password", pwdValue);

    try {
      const imageRes = await axios.post("/api/upload/myPage", formData, {
        // 헤더에 보낼 파일의 타입이 multipart라 말해줘야 한다. 이미지 파일은 크기 때문에 부분으로 나눠서 보내기 때문
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("수정 완료되었습니다. :)");
      router.push("/friendList");
      // 반환받은 이미지 URL, 원하는 곳에 사용하면 된다. 나 같은 경우 회원가입 할 때, 회원정보와 같이 한 번에 서버로 보내줬다.
      // const image_URL = imageRes.data.imageURL;
    } catch (e) {
      console.error(e);
    }
  };

  // 프로파일 바뀔때마다 수정하기
  // const handleChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
  //   const fileList = event.target.files;
  //   if (fileList && fileList.length > 0) {
  //     const file = fileList[0];
  //     console.log(file);
  //     setProfileImg(file);
  //   }
  // };

  // https://velog.io/@cloud_oort/Next.js-%ED%94%84%EB%A1%9C%ED%95%84-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EC%97%85%EB%A1%9C%EB%93%9C
  // 사진 이미지를 프로필이미지에 보여지게 하기위해
  const handleImage = async (e: any) => {
    // 내가 받을 파일은 하나기 때문에 index 0값의 이미지를 가짐
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (reader.readyState === FileReader.DONE) {
        // 파일 onLoad가 성공하면 2, 진행 중은 1, 실패는 0 반환
        const imageURL = e.target?.result as string;
        setImage(imageURL);
        setProfileImg(file);
        setNewProfileImg(imageURL);
      }
    };
  };

  return (
    <>
      <header className="screen-header flex justify-between px-6 items-center my-4">
        <h1 className="screen-header__title text-3xl">MyPage</h1>
      </header>

      <div className="max-w-sm mx-auto bg-white py-8 px-6">
        <form onSubmit={submit}>
          <div className="flex items-center space-x-6 ">
            <div className="shrink-0">
              <Image
                className="h-16 w-16 object-cover rounded-full"
                // src={!user.profileImg ? image : user.profileImg}
                src={!user.profileImg ? image : newProfileImg ? newProfileImg : user.profileImg}
                width={50}
                height={50}
                alt="Current profile photo"
              />
            </div>
            <label className="block">
              <span className="sr-only">Choose profile photo</span>
              <input
                type="hidden"
                value={user.profileImg ? user.profileImg : ""}
                ref={profileRef}
              />
              <input
                type="file"
                className="block w-full text-sm text-slate-500 file:text-sm file:font-semibold file:py-2 file:px-4 file:bg-violet-50 file:text-violet-700 file:rounded-full file:border-0 file:mr-4 hover:file:bg-violet-100"
                onChange={handleImage}
              />
            </label>
          </div>

          <div className="mt-6">
            <label className="block">
              <span className="block text-sm font-medium mb-3 text-slate-700">Your ID</span>
              <input
                type="text"
                defaultValue={user.id || ""}
                readOnly
                className="p-6 border-slate-300 border bg-slate-100 mb-3 rounded-md h-10 w-full placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500"
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium mb-3 text-slate-700">Your Name</span>
              <input
                type="text"
                defaultValue={user.name || ""}
                ref={nameRef}
                className="p-6 border-slate-300 border mb-3 rounded-md h-10 w-full placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500"
              />
            </label>
            {nameValid !== "error" ? (
              ""
            ) : (
              <div className="bg-white px-2 text-black w-full mb-2 text-rose-600 text-sm">
                <p>이름을 입력하세요</p>
              </div>
            )}
            <label className="block">
              <span className="block text-sm font-medium mb-3 text-slate-700">Your Password</span>
              <input
                ref={passwordRef}
                type="password"
                className="p-6 border-slate-300 border mb-3 rounded-md h-10 w-full placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500"
              />
            </label>
            {pwdValid !== "error" ? (
              ""
            ) : (
              <div className="bg-white px-2 text-black w-full mb-2 text-rose-600 text-sm">
                <p>비밀번호를 입력하세요</p>
              </div>
            )}
            <label className="block">
              <span className="block text-sm font-medium mb-3 text-slate-700">
                Confirm Password
              </span>
              <input
                ref={confirmPasswordRef}
                type="password"
                className="p-6 border-slate-300 border mb-3 rounded-md h-10 w-full placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500"
              />
            </label>
            {confirmPwdValid === "emptyError" ? (
              <div className="bg-white px-2 text-black w-full mb-2 text-rose-600 text-sm">
                <p>비밀번호를 한번더 입력하세요</p>
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
              className="w-full rounded-md text-center bg-blue-700 py-3 rounded bg-green text-white hover:bg-green-dark focus:outline-none my-1"
            >
              Modify Account
            </button>
          </div>
        </form>
      </div>
      <BottomNav />
    </>
  );
}

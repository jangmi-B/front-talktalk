"use client";
import { ChangeEvent, useRef, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { FaEllipsisH } from "react-icons/fa";
import Image from "next/image";
import BottomNav from "../component/bottomNav";

export default function chatList() {
  const [profileImg, setProfileImg] = useState<File>();
  const [image, setImage] = useState("/images/upload/basicProfile.png");
  const nameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  // https://falsy.me/nextjs-api-routes%EB%A5%BC-%ED%86%B5%ED%95%B4-api-%EC%84%9C%EB%B2%84%EB%A1%9C-%ED%8C%8C%EC%9D%BC-%EB%B3%B4%EB%82%B4%EA%B8%B0/
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    const nameValue = nameRef.current?.value!;
    const pwdValue = passwordRef.current?.value!;

    if (profileImg) {
      formData.append("profileImg", profileImg);
    }
    formData.append("name", nameValue);
    formData.append("password", pwdValue);

    console.log(formData.get("profileImg"));
    console.log(formData.get("name"));
    console.log(formData.get("password"));

    // const res = await fetch("/api/upload", {
    //   method: "POST",
    //   body: formData,
    // });
    // console.log(res);
  };

  // 프로파일 바뀔때마다 수정하기
  const handleChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      console.log(file);
      setProfileImg(file);
    }
  };

  // https://velog.io/@cloud_oort/Next.js-%ED%94%84%EB%A1%9C%ED%95%84-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EC%97%85%EB%A1%9C%EB%93%9C
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
      }
    };

    // console.log(reader);
    // console.log(image);
    // // 이미지 파일을 formData에 담아서 서버에 보내고, 서버는 받은 이미지 파일을 S3에 저장하고 받은 URL 값을 클라이언트로 반환해준다.
    // const formData = new FormData()
    // formData.append('image', file)
    // try {
    //   //
    // 	const imageRes = await (/*api 부분은 생략*/).post('/image', formData, {
    //       // 헤더에 보낼 파일의 타입이 multipart라 말해줘야 한다. 이미지 파일은 크기 때문에 부분으로 나눠서 보내기 때문
    //     	headers: { "Content-Type": "multipart/form-data" }
    //     })
    //     // 반환받은 이미지 URL, 원하는 곳에 사용하면 된다. 나 같은 경우 회원가입 할 때, 회원정보와 같이 한 번에 서버로 보내줬다.
    //     const image_URL = imageRes.data.imageURL
    // } catch (e) {
    // 	console.error(e.response)
    // }
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
                src={image}
                width={50}
                height={50}
                // src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1361&q=80"
                alt="Current profile photo"
              />
            </div>
            <label className="block">
              <span className="sr-only">Choose profile photo</span>
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
                readOnly
                className="p-6 border-slate-300 border bg-slate-100 mb-3 rounded-md h-10 w-full placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500"
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium mb-3 text-slate-700">Your Name</span>
              <input
                ref={nameRef}
                className="p-6 border-slate-300 border mb-3 rounded-md h-10 w-full placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500"
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium mb-3 text-slate-700">Your Password</span>
              <input
                ref={passwordRef}
                type="password"
                className="p-6 border-slate-300 border mb-3 rounded-md h-10 w-full placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500"
              />
            </label>
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

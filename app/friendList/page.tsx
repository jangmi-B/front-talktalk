"use client";
import Image from "next/image";
import BottomNav from "../component/bottomNav";

export default function FriendList() {
  return (
    <>
      <header className="screen-header flex justify-between px-6 items-center my-4">
        <h1 className="screen-header__title text-3xl">Friends</h1>
        <div className="screen-header__icons ml-6">
          <span>
            <i className="fa-solid fa-magnifying-glass fa-lg"></i>
          </span>
          <span>
            <i className="fa-regular fa-comment-dots fa-lg"></i>
          </span>
          <span>
            <i className="fa-solid fa-music fa-lg"></i>
          </span>
          <span>
            <i className="fa-solid fa-gear fa-lg"></i>
          </span>
        </div>
      </header>

      <div className="my-2 bg-gray-100 h-[3px]"></div>
      <div className="main-ontents  h-[600px]">
        <ul role="list" className="mx-auto max-w-md bg-white p-2 ">
          <li className="group/item relative flex items-center justify-between rounded-xl p-4 hover:bg-slate-100 shadow mb-2">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Image
                  src={"/images/example.jpeg"}
                  width={50}
                  height={50}
                  alt=""
                  className="rounded-full"
                />
              </div>
              <div className="w-full text-sm leading-6 flex items-center justify-between">
                <a href="#" className="font-semibold text-slate-900">
                  <span className="absolute inset-0 rounded-xl" aria-hidden="true"></span>
                  나는 고양이
                </a>
              </div>
            </div>
            <a
              href="#"
              className="group/edit invisible relative flex items-center whitespace-nowrap rounded-full py-1 pl-4 pr-3 text-sm text-slate-500 transition hover:bg-slate-200 group-hover/item:visible"
            >
              <span className="font-semibold transition group-hover/edit:text-gray-700">Go</span>
              <svg
                className="mt-px h-5 w-5 text-slate-400 transition group-hover/edit:translate-x-0.5 group-hover/edit:text-slate-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              ></svg>
            </a>
          </li>
          <li className="group/item relative flex items-center justify-between rounded-xl p-4 hover:bg-slate-100 shadow">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Image
                  src={"/images/angry.jpg"}
                  width={50}
                  height={50}
                  alt=""
                  className="rounded-full"
                />
              </div>
              <div className="w-full text-sm leading-6 flex items-center justify-between">
                <a href="#" className="font-semibold text-slate-900">
                  <span className="absolute inset-0 rounded-xl" aria-hidden="true"></span>
                  나는 화난 고양이
                </a>
              </div>
            </div>
            <a
              href="#"
              className="group/edit invisible relative flex items-center whitespace-nowrap rounded-full py-1 pl-4 pr-3 text-sm text-slate-500 transition hover:bg-slate-200 group-hover/item:visible"
            >
              <span className="font-semibold transition group-hover/edit:text-gray-700">Go</span>
              <svg
                className="mt-px h-5 w-5 text-slate-400 transition group-hover/edit:translate-x-0.5 group-hover/edit:text-slate-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              ></svg>
            </a>
          </li>
        </ul>
      </div>
      <BottomNav />
    </>
  );
}

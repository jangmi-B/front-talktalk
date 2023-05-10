"use client";
import Image from "next/image";
import { useState } from "react";
import { FaWifi } from "react-icons/fa";
import { FaBatteryFull } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { FaEllipsisH } from "react-icons/fa";

export default function chatList() {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      <header className="screen-header flex justify-between px-6 items-center my-4">
        <h1 className="screen-header__title text-3xl">Chats</h1>
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

      <div className="main-ontents h-[600px]">
        <ul role="list" className="mx-auto max-w-md bg-white p-2 ">
          <li className="group/item relative flex items-center justify-between rounded-xl p-4 hover:bg-slate-100 shadow">
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
              <div className="w-full text-sm leading-6">
                <a href="#" className="font-semibold text-slate-900">
                  <span className="absolute inset-0 rounded-xl" aria-hidden="true"></span>
                  나는 고양이
                </a>
                <div className="text-slate-500">집에가고 싶어...</div>
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
                <img
                  className="h-12 w-12 rounded-full"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
              </div>
              <div className="w-full text-sm leading-6">
                <a href="#" className="font-semibold text-slate-900">
                  <span className="absolute inset-0 rounded-xl" aria-hidden="true"></span>Hector
                  Adams
                </a>
                <div className="text-slate-500">VP, Marketing</div>
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
                <img
                  className="h-12 w-12 rounded-full"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
              </div>
              <div className="w-full text-sm leading-6">
                <a href="#" className="font-semibold text-slate-900">
                  <span className="absolute inset-0 rounded-xl" aria-hidden="true"></span>Blake
                  Alexander
                </a>
                <div className="text-slate-500">Account Coordinator</div>
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
      {isDropdownOpen && (
        <div className="dropdown absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-[999]">
          <ul className="dropdown__menu">
            <li className="dropdown__item">
              <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                로그아웃
              </a>
            </li>
            <li className="dropdown__item">
              <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                테스트
              </a>
            </li>
          </ul>
        </div>
      )}
      <nav className="nav fixed bottom-0 w-full bg-gray-50 py-5 px-10 border-t border-gray-200">
        <ul className="nav__list flex justify-between">
          <li className="nav__btn">
            <a className="nav__link" href="friends.html">
              <FaRegUser size={24} />
            </a>
          </li>
          <li className="nav__btn">
            <a className="nav__link" href="chats.html">
              <FaRegComment size={24} />
            </a>
          </li>

          <li className="nav__btn relative">
            <button className="nav__link" onClick={toggleDropdown}>
              <FaEllipsisH size={24} />
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}

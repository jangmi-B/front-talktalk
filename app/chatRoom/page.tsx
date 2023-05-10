"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { FaBars } from "react-icons/fa";
import { FaRegPlusSquare } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";

export default function chatRoom() {
  const isSidebarOpen = useRef(false);
  const submenuRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);

  const toggleSidebar = () => {
    isSidebarOpen.current = !isSidebarOpen.current;
  };

  useEffect(() => {
    const toggleDropdown = () => {
      const submenu = submenuRef.current;
      const arrow = arrowRef.current;
      if (submenu && arrow) {
        submenu.classList.toggle("hidden");
        arrow.classList.toggle("rotate-0");
      }
    };

    toggleDropdown();
  }, []);

  const openSidebar = () => {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) {
      sidebar.classList.toggle("hidden");
    }
  };

  return (
    <div id="chat-screen" className="bg-slate-100">
      <header className="alt-header flex p-4 items-center justify-center ">
        <div className="alt-header__column w-1/3">
          <a href="./chats.html">
            <FaChevronLeft />
          </a>
        </div>
        <div className="alt-header__column w-1/3">
          <h1 className="alt-header__title text-base font-medium text-xl font-semibold">
            채팅방이름
          </h1>
        </div>
        <div className="alt-header__column ml-auto flex items-center">
          <span className="alt-header__column-icon mr-4">
            <FaSearch />
          </span>
          <span className="alt-header__column-icon" onClick={openSidebar}>
            <FaBars />
          </span>
        </div>
      </header>

      <main className="main-screen main-chat items-center px-6 h-[630px]">
        <div className="chat__timestamp bg-slate-400 text-white rounded-full py-2.5 px-4 my-5 mx-8 text-center font-base">
          Tuesday, June 30, 2020
        </div>
        <div className="message-row w-full flex mb-6">
          <Image
            src={"/images/example.jpeg"}
            alt=""
            width={50}
            height={50}
            className="object-cover w-12 h-12 rounded-lg mr-2.5"
          />
          <div className="message-row__content">
            <span className="message-row__author">Anonymous</span>
            <div className="message-row__info flex mb-1 items-end">
              <span className="message-row__bubble bg-white px-4 py-3 rounded-xl text-lg mr-2">
                Hi!
              </span>
              <span className="message-row__time opacity-75 text-sm">21:27</span>
            </div>
          </div>
        </div>
        <div className="message-row message-row-own justify-end">
          <div className="message-row__content">
            <div className="message-row__info flex mb-1 items-end justify-end">
              <span className="message-row__time opacity-75 text-sm">21:27</span>
              <span className="message-row__bubble bg-yellow-500 px-4 py-3 rounded-xl text-lg ml-2 mr-0">
                Hi! nice to meet you!
              </span>
            </div>
          </div>
        </div>
      </main>
      <form className="reply bg-white fixed flex w-full justify-between px-1 py-6 box-border items-center">
        <div className="reply__column flex items-center justify-center w-1/6">
          <button>
            <FaRegPlusSquare size={24} />
          </button>
        </div>
        <div className="reply__column flex items-center w-11/12 justify-center">
          <input type="text" placeholder="write a message" className="border p-2 w-full" />
          <button className="bg-yellow-500 border-none w-10 h-10 text-center">
            <FaArrowUp className="m-auto" />
          </button>
        </div>
      </form>

      <div
        className={`sidebar fixed top-0 bottom-0 lg:left-0 p-2 w-[300px] overflow-y-auto text-center bg-gray-900 ${
          isSidebarOpen ? "" : "hidden"
        }`}
      >
        <div className="text-gray-100 text-xl">
          <div className="p-2.5 mt-1 flex items-center">
            <h1 className="font-bold text-gray-200 text-[15px] ml-3">Member(3)</h1>
            <i className="bi bi-x cursor-pointer ml-28 lg:hidden" onClick={toggleSidebar}></i>
          </div>
          <div className="my-2 bg-gray-600 h-[1px]"></div>
        </div>
        <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white">
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
            <div className="w-full text-sm leading-6 flex items-center justify-center">
              <a href="#" className="font-semibold text-slate-900 text-white">
                나는 고양이
              </a>
            </div>
          </div>
        </div>
        <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white">
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
            <div className="w-full text-sm leading-6 flex items-center justify-center">
              <a href="#" className="font-semibold text-slate-900 text-white">
                너도 고양이?!
              </a>
            </div>
          </div>
        </div>
        <div className="my-2 bg-gray-600 h-[1px]"></div>
        {/* <div className="my-4 bg-gray-600 h-[1px]"></div>
        <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white">
          <i className="bi bi-chat-left-text-fill"></i>
          <div className="flex justify-between w-full items-center">
            <span className="text-[15px] ml-4 text-gray-200 font-bold">Chatbox</span>
            <span className="text-sm rotate-180" id="arrow" ref={arrowRef}>
              <i className="bi bi-chevron-down"></i>
            </span>
          </div>
        </div>
        <div
          className="text-left text-sm mt-2 w-4/5 mx-auto text-gray-200 font-bold"
          id="submenu"
          ref={submenuRef}
        >
          <h1 className="cursor-pointer p-2 hover:bg-blue-600 rounded-md mt-1">Social</h1>
          <h1 className="cursor-pointer p-2 hover:bg-blue-600 rounded-md mt-1">Personal</h1>
          <h1 className="cursor-pointer p-2 hover:bg-blue-600 rounded-md mt-1">Friends</h1>
        </div> */}
        <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white">
          <i className="bi bi-box-arrow-in-right"></i>
          <span className="text-[15px] ml-4 text-gray-200 font-bold">채팅방 나가기</span>
        </div>
      </div>
    </div>
  );
}

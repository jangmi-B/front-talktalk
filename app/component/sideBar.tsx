"use client";
import Image from "next/image";
import { FaSignOutAlt } from "react-icons/fa";
import { useRef } from "react";

export default function SideBar() {
  const isSidebarOpen = useRef(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const submenuRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);

  const addFriend = () => {
    if (window.confirm("친구를 초대하시겠습니까?")) {
      console.log("초대됨");
      openSidebar();
    }
  };

  const toggleDropdown = () => {
    const submenu = submenuRef.current;
    const arrow = arrowRef.current;
    if (submenu && arrow) {
      submenu.classList.toggle("hidden");
      arrow.classList.toggle("rotate-0");
    }
  };
  const toggleSidebar = () => {
    isSidebarOpen.current = !isSidebarOpen.current;
  };

  const openSidebar = () => {
    const sidebar = sidebarRef.current;
    if (sidebar) {
      sidebar.classList.toggle("hidden");
    }
  };

  return (
    <div id="chat-screen" className="bg-slate-100">
      {/* 사이드바 */}
      <div
        className={`sidebar fixed top-0 bottom-0 lg:left-0 p-2 w-[300px] overflow-y-auto text-center bg-white ${
          isSidebarOpen ? "hidden" : ""
        }`}
        ref={sidebarRef}
      >
        <div className="text-gray-100 text-xl">
          <div className="p-2.5 mt-1 flex items-center">
            <h1 className="font-bold text-gray-500 text-[15px] ml-3">대화상대(3)</h1>
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
              <a href="#" className="font-semibold text-gray-500 ">
                나는 고양이
              </a>
            </div>
          </div>
        </div>
        <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600">
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
              <a href="#" className="font-semibold text-gray-500">
                너도 고양이?!
              </a>
            </div>
          </div>
        </div>
        <div className="my-2 bg-gray-600 h-[1px]"></div>
        <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white">
          <span className="text-[15px] ml-4 text-gray-500 font-bold flex items-center justify-center">
            채팅방 나가기 <FaSignOutAlt className="ml-3" />
          </span>
        </div>
        <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white">
          <i className="bi bi-chat-left-text-fill"></i>
          <div className="flex justify-between w-full items-center" onClick={toggleDropdown}>
            <span className="text-[15px] ml-4 text-gray-500 font-bold">멤버 초대하기</span>
            <span className="text-sm rotate-180" ref={arrowRef}>
              <i className="bi bi-chevron-down"></i>
            </span>
          </div>
        </div>
        <div
          className="text-left text-sm mt-2 w-4/5 mx-auto text-gray-200 font-bold hidden overflow-scroll h-[400px]"
          ref={submenuRef}
        >
          <div className="flex items-center mb-3">
            <Image
              src={"/images/angry.jpg"}
              alt=""
              width={50}
              height={50}
              className="object-cover w-12 h-12 rounded-lg mr-2.5"
            />
            <h1
              className="cursor-pointer p-2 hover:bg-blue-600 active:bg-blue-600 text-gray-500 rounded-md mt-1"
              onClick={addFriend}
            >
              사람111111111
            </h1>
          </div>
          <div className="flex items-center mb-3">
            <Image
              src={"/images/angry.jpg"}
              alt=""
              width={50}
              height={50}
              className="object-cover w-12 h-12 rounded-lg mr-2.5"
            />
            <h1
              className="cursor-pointer p-2 hover:bg-blue-600 active:bg-blue-600 text-gray-500 rounded-md mt-1"
              onClick={addFriend}
            >
              사람2222222
            </h1>
          </div>
          <div className="flex items-center mb-3">
            <Image
              src={"/images/angry.jpg"}
              alt=""
              width={50}
              height={50}
              className="object-cover w-12 h-12 rounded-lg mr-2.5"
            />
            <h1
              className="cursor-pointer p-2 hover:bg-blue-600 active:bg-blue-600 text-gray-500 rounded-md mt-1"
              onClick={addFriend}
            >
              사람33333
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

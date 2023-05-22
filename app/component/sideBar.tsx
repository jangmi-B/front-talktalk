"use client";
import Image from "next/image";
import { FaSignOutAlt } from "react-icons/fa";
import { useRef } from "react";
import { UserInfo } from "./types";

type sidebarProps = {
  allUserInfo: UserInfo[];
  invitedMember: number[];
  userInfo: UserInfo[];
  deleteMember: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  addChatRoom: (userIdx: number) => void;
  openSidebar: () => void;
  toggleDropdown: () => void;
  isSidebarOpen: React.MutableRefObject<boolean>;
};

export default function SideBar({
  allUserInfo,
  invitedMember,
  userInfo,
  deleteMember,
  addChatRoom,
  openSidebar,
  toggleDropdown,
  isSidebarOpen,
}: sidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const submenuRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);

  console.log(isSidebarOpen);

  const toggleSidebar = () => {
    isSidebarOpen.current = !isSidebarOpen.current;
    openSidebar();
  };

  // const openSidebar = () => {
  //   const sidebar = sidebarRef.current;
  //   if (sidebar) {
  //     sidebar.classList.toggle("hidden");
  //   }
  // };

  return (
    <div id="chat-screen" className="bg-slate-100">
      {/* 사이드바 */}
      <div
        className={`sidebar fixed top-0 bottom-0 lg:left-0 p-2 w-[300px] h-full overflow-y-auto text-center bg-white ${
          isSidebarOpen ? "hidden" : ""
        }`}
        ref={sidebarRef}
      >
        <div className="text-gray-100 text-xl">
          <div className="p-2.5 mt-1 flex items-center">
            <h1 className="font-bold text-gray-500 text-[15px] ml-3">
              대화상대({userInfo.length})
            </h1>
            <i className="bi bi-x cursor-pointer ml-28 lg:hidden" onClick={toggleSidebar}></i>
          </div>
          <div className="my-2 bg-gray-600 h-[1px]"></div>
        </div>
        {userInfo.map((user, index) => {
          return (
            <div
              key={index}
              className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-gray-100 text-white"
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Image
                    src={
                      user.user?.profileImg
                        ? user.user?.profileImg
                        : "/images/upload/basicProfile.png"
                    }
                    width={50}
                    height={50}
                    alt=""
                    className="rounded-full"
                  />
                </div>
                <div className="w-full text-sm leading-6 flex items-center justify-center">
                  <a href="#" className="font-semibold text-gray-500 ">
                    {user.user?.name}
                  </a>
                </div>
              </div>
            </div>
          );
        })}
        <div className="my-2 bg-gray-600 h-[1px]"></div>
        <div
          onClick={deleteMember}
          className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-gray-100"
        >
          <span className="text-[15px] ml-4 text-gray-500 font-bold flex items-center justify-center">
            채팅방 나가기 <FaSignOutAlt className="ml-3" />
          </span>
        </div>
        <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-gray-100">
          <i className="bi bi-chat-left-text-fill"></i>
          <div className="flex justify-between w-full items-center" onClick={toggleDropdown}>
            <span className="text-[15px] ml-4 text-gray-500 font-bold">멤버 초대하기</span>
            <span className="text-sm rotate-180" ref={arrowRef}>
              <i className="bi bi-chevron-down"></i>
            </span>
          </div>
        </div>
        <div
          className="text-left text-sm mt-2 w-4/5 mx-auto text-gray-200 font-bold hidden overflow-scroll h-[300px]"
          ref={submenuRef}
        >
          {allUserInfo.map((user, index) => {
            if (invitedMember.includes(user.userIdx)) {
              return null;
            }
            return (
              <div
                key={index}
                className="flex items-center mb-3"
                onClick={() => addChatRoom(user.userIdx)}
              >
                <Image
                  src={user.profileImg ? user.profileImg : "/images/upload/basicProfile.png"}
                  alt=""
                  width={50}
                  height={50}
                  className="object-cover w-12 h-12 rounded-lg mr-2.5"
                />
                <h1 className="cursor-pointer p-2 hover:bg-gray-100 active:bg-gray-100 text-gray-500 rounded-md mt-1">
                  {user.name}
                </h1>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

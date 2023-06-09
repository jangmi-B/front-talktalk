"use client";
import Image from "next/image";
import BottomNav from "../component/bottomNav";
import { useContext, useEffect, useState } from "react";
import { ChatRoom, User, UserInfo } from "../component/types";
import axios from "axios";
import Link from "next/link";
import { AuthContext, AuthContextType } from "../component/authContext";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";
import { Loading } from "../component/loading";

export default function chatList() {
  const router = useRouter();
  // 유저정보 가져오기 위한 쿠키 .. 수정필요
  const authContext = useContext<AuthContextType>(AuthContext);
  const [cookies, removeCookie] = useCookies(["Authentication"]);
  const authenticationCookie = cookies["Authentication"];

  const [user, setUser] = useState<UserInfo>({} as UserInfo);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 쿠키가져오기 나중에 따로빼기
    if (authenticationCookie && authenticationCookie.accessToken) {
      const getCookies = async () => {
        try {
          const token = `Bearer ${authenticationCookie.accessToken}`;
          const response = await axios.post("/api/check", null, {
            headers: {
              Authorization: token,
            },
          });
          setUser(response.data);
        } catch (error) {
          alert("chatLsit쿠키 " + error);
        }
      };
      getCookies();
    } else {
      // alert(" chatLsit쿠키 로그인 정보가 없습니다. 로그인 페이지로 돌아갑니다.");
      router.push("/");
    }
  }, [cookies]);

  // 로그인한 사용자의 idx로 참여중인 chatRoom검색, 가장최근 채팅내역과 보낸 사용자까지 검색
  const getChatRooms = async () => {
    try {
      const response = await axios.get(`/api/chat/getRoomIdxList/${user.userIdx}`);
      if (response.data) {
        setRooms(response.data);
      } else {
      }
      setLoading(false);
    } catch (error) {
      alert("챗리스트에러 " + error);
      setLoading(false);
    }
  };

  // 사용자 정보가 있을때만 채팅룸 검색해옴
  useEffect(() => {
    if (user && user.userIdx) {
      getChatRooms();
    }
  }, [user]);

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
        {loading && <Loading />}
        <ul role="list" className="mx-auto max-w-md bg-white p-2 ">
          {rooms.length !== 0 ? (
            ""
          ) : (
            <Link href={"/friendList"}>
              <li className="text-slate-500 mx-3  hover:text-blue-500 ">
                채팅 내역이 없습니다. 채팅을 시작해보세요 :){" "}
              </li>
            </Link>
          )}
          {rooms.map((room, index) => (
            <li
              key={index}
              className="group/item relative flex items-center justify-between rounded-xl p-4 hover:bg-slate-100 shadow bg-gray-50 mb-2"
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Image
                    src={room.user?.profileImg ? room.user?.profileImg : "/images/basicProfile.png"}
                    width={50}
                    height={50}
                    alt=""
                    className="rounded-full"
                  />
                </div>
                <Link href={`/chatRoom/${user.userIdx}/${room.roomIdx}`}>
                  <div className="w-full text-sm leading-6">
                    <span className="absolute inset-0 rounded-xl" aria-hidden="true"></span>
                    {room.roomTitle}
                    <div className="text-slate-500">{room.chat?.text}</div>
                  </div>
                </Link>
              </div>
              <a
                href="#"
                className="group/edit invisible relative flex items-center whitespace-nowrap rounded-full py-1 pl-4 pr-3 text-sm text-slate-500 transition hover:bg-slate-200 group-hover/item:visible"
              ></a>
            </li>
          ))}
        </ul>
      </div>
      <BottomNav />
    </>
  );
}

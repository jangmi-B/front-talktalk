"use client";
import Image from "next/image";
import BottomNav from "../component/bottomNav";
import { useEffect, useState } from "react";
import axios from "axios";
import { ChatMemberInput, UserInfo } from "../component/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import Modal from "../component/modal";
import { Loading } from "../component/loading";

export default function FriendList() {
  const router = useRouter();

  // 쿠키로 사용자 정보 가져오기 위해.. 나중에 수정해야함
  const [cookies] = useCookies(["Authentication"]);
  const authenticationCookie = cookies["Authentication"];
  // 가져온 사용자 정보 저장
  const [user, setUser] = useState<UserInfo>({} as UserInfo);
  // 전체 멤버
  const [members, setMembers] = useState<UserInfo[]>([]);
  // 데이터가 로드되는 동안의 로딩스피너
  const [loading, setLoading] = useState(true);

  // 프로필사진 모달관련
  const [showModal, setShowModal] = useState(false);
  const [modalProps, setModalPorps] = useState({
    profileImg: "",
    memberId: "",
  });
  const goModal = () => {
    setShowModal(!showModal);
  };
  const clickModal = (profileImg: string, memberId: string) => {
    console.log("click!!");
    goModal();
    setModalPorps({ profileImg, memberId });
  };

  // 쿠키로 사용자정보 가져오기.. 다시 수정필요한 부분..!!!
  useEffect(() => {
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
          alert("friendList쿠키 " + error);
        }
      };
      getCookies();
    } else {
      router.push("/");
    }
  }, [cookies]);

  // 모든 유저정보 가져옴
  useEffect(() => {
    const getAllMember = async () => {
      try {
        const response = await axios.post("/api/chat/allMember");
        // 가져온 정보를 memeber에 set
        if (response.data) {
          setMembers(response.data);
        }
        // 로딩스피너 제거
        setLoading(false);
      } catch (error) {
        alert("채팅가능한 멤버가 없습니다.");
        setLoading(false);
      }
    };

    // 유저정보가 있을때만 유저를 가져오기 위해서
    if (Object.keys(user).length > 0) {
      getAllMember();
    }
  }, [user]);

  // 채팅룸 생성
  const makeRoom = async (chatRoomName: string) => {
    try {
      const response = await axios.post(`/api/chat/makeRoom/`, { roomTitle: chatRoomName });
      return response.data;
    } catch (error) {
      alert(error);
    }
  };

  // 채팅방을 생성하고, 사용자와 클릭한 친구의 inx를 보내서 chatMember에 추가
  const makeChatRoom = async (friendIdx: number) => {
    const userInput = prompt("채팅방 이름을 입력하세요 :) ");
    // 입력을 취소하면 넘어가지 않게
    if (userInput == null) return false;
    // 빈값으로 가면 임시로 채팅방 이름 만들기
    const chatRoomName = userInput ? userInput : `chat_${user.userIdx}`;
    const roomIdx = await makeRoom(chatRoomName); // makeRoom() 함수 호출과 반환값 대기(roomIdx)

    const chatmemberData: ChatMemberInput = {
      friendIdx: friendIdx,
      userIdx: user.userIdx,
      roomIdx: roomIdx, // 반환된 roomIdx 값을 할당
    };

    // 채팅 멤버테이블에 데이터를 추가하고 만든 채팅방으로 이동
    try {
      const response = await axios.post("/api/chat/chatMember", chatmemberData);
      if (response.data) {
        router.push(`/chatRoom/${user.userIdx}/${roomIdx}`);
      }
    } catch (error) {
      alert(error);
    }
  };

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
      <div className="main-ontents  h-[650px] overflow-scroll">
        {loading && <Loading />}
        <ul role="list" className="mx-auto max-w-md bg-white p-2 ">
          {members.map((member) => (
            <div key={member.userIdx}>
              {user && member.userIdx === user.userIdx ? (
                <li
                  key={member.userIdx}
                  className="bg-gray-100 group/item relative flex items-center justify-between rounded-xl p-4 hover:bg-slate-100 shadow mb-2"
                >
                  <div
                    className="flex gap-4 cursor-pointer"
                    onClick={() =>
                      clickModal(
                        member.profileImg ? member.profileImg : "/images/basicProfile.png",
                        member.id
                      )
                    }
                  >
                    <div className="flex-shrink-0">
                      <Image
                        src={member.profileImg ? member.profileImg : "/images/basicProfile.png"}
                        width={50}
                        height={50}
                        alt=""
                        className="rounded-full cursor-pointer"
                      />
                    </div>
                    <div className="w-full text-sm leading-6 flex items-center justify-between">
                      <a className="font-semibold text-slate-900">
                        <span className="absolute inset-0 rounded-xl" aria-hidden="true"></span>
                        {member.name} <span> : 나</span>
                      </a>
                    </div>
                  </div>
                  <Link
                    href={"myPage"}
                    className="group/edit invisible relative flex items-center whitespace-nowrap rounded-full py-1 pl-4 pr-3 text-sm text-slate-500 transition hover:bg-slate-200 group-hover/item:visible cursor: pointer;"
                  >
                    <span className="font-semibold transition group-hover/edit:text-gray-700">
                      MyPage
                    </span>
                    <svg
                      className="mt-px h-5 w-5 text-slate-400 transition group-hover/edit:translate-x-0.5 group-hover/edit:text-slate-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    ></svg>
                  </Link>
                </li>
              ) : (
                ""
              )}
            </div>
          ))}
        </ul>
        <span className="text-slate-600 mx-3 text-xs">
          {" "}
          친구 ({members.length === 0 ? members.length : members.length - 1})
        </span>
        <div className="my-1 bg-gray-100 h-[1px]"></div>
        <ul role="list" className="mx-auto max-w-md bg-white p-2 ">
          {members.map((member) => (
            <div key={member.userIdx}>
              {member && member.userIdx !== user.userIdx ? (
                <li
                  key={member.id}
                  className=" group/item relative flex items-center justify-between rounded-xl p-4 hover:bg-slate-100 shadow mb-2"
                >
                  <div
                    className="flex gap-4 cursor-pointer"
                    onClick={() =>
                      clickModal(
                        member.profileImg ? member.profileImg : "/images/basicProfile.png",
                        member.id
                      )
                    }
                  >
                    <div className="flex-shrink-0">
                      <div className="flex-shrink-0">
                        <Image
                          src={member.profileImg ? member.profileImg : "/images/basicProfile.png"}
                          width={50}
                          height={50}
                          alt=""
                          className="rounded-full "
                        />
                      </div>
                    </div>
                    <div className="w-full text-sm leading-6 flex items-center justify-between">
                      <a className="font-semibold text-slate-900">
                        <span className="absolute inset-0 rounded-xl" aria-hidden="true"></span>
                        {member.name}
                        <div className="text-slate-400">ID : {member.id}</div>
                      </a>
                    </div>
                  </div>
                  <a
                    onClick={() => makeChatRoom(member.userIdx)}
                    className="cursor-pointer group/edit invisible relative flex items-center whitespace-nowrap rounded-full py-1 pl-4 pr-3 text-sm text-slate-500 transition hover:bg-slate-200 group-hover/item:visible"
                  >
                    <span className="font-semibold transition group-hover/edit:text-gray-700 ">
                      Go
                    </span>
                    <svg
                      className="mt-px h-5 w-5 text-slate-400 transition group-hover/edit:translate-x-0.5 group-hover/edit:text-slate-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    ></svg>
                  </a>
                </li>
              ) : (
                ""
              )}
            </div>
          ))}
        </ul>
      </div>
      {showModal && (
        <Modal
          clickModal={goModal}
          profileImg={modalProps.profileImg}
          memberId={modalProps.memberId}
        />
      )}

      <BottomNav />
    </>
  );
}

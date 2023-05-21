"use client";
import Image from "next/image";
import { FaChevronLeft } from "react-icons/fa";
import { FaBars } from "react-icons/fa";
import { FaRegPlusSquare } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import {
  useState,
  useEffect,
  FormEvent,
  useRef,
  MouseEventHandler,
  useCallback,
  useLayoutEffect,
} from "react";
import * as mqtt from "mqtt";
import axios from "axios";
import { UserInfo, publishedMessage } from "../../../component/types";
import { usePathname, useRouter } from "next/navigation";
import Modal from "@/app/component/modal";

const getDay = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줍니다
  const day = today.getDate();

  const formattedDate = `${year}년 ${month}월 ${day}일`;
  return formattedDate;
};

const getCurrentTime = () => {
  const chatTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return chatTime;
};

const getChatDate = (createAt: string) => {
  const chatDate = new Date(createAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return chatDate;
};

export default function chatRoom() {
  const isSidebarOpen = useRef(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const submenuRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const chatListRef = useRef<HTMLDivElement>(null);
  const chatDayRef = useRef<HTMLInputElement>(null);
  const isSameDayRef = useRef<HTMLInputElement>(null);

  // mqtt
  const [messages, setMessages] = useState<publishedMessage[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);

  // chat 정보
  const [chatList, setChatList] = useState<publishedMessage[]>([]);
  const [userIdx, setUserIdx] = useState(0);
  const [userInfo, setUserInfo] = useState<UserInfo[]>([]);
  const [allUserInfo, setAllUserInfo] = useState<UserInfo[]>([]);
  const [invitedMember, setInvitedMember] = useState<number[]>([]);

  // 접근권한 나중에하기!!!!!
  // next-router대신 이거쓰기
  const router = useRouter();
  const pathname = usePathname();
  const pathUserIdx = parseInt(pathname.split("/")[2]);
  const pathRoomIdx = parseInt(pathname.split("/")[3]);

  // 무한스크롤 테스트
  const [loading, setLoading] = useState(false);
  const page = useRef(1);

  const handleScroll = useCallback(() => {
    const scrollTop = chatListRef.current?.scrollTop;
    const clientHeight = chatListRef.current?.clientHeight!;
    const scrollHeight = chatListRef.current?.scrollHeight!;

    if (scrollTop === 0 && !loading && clientHeight < scrollHeight) {
      page.current = page.current + 1;
      getChatList(pathUserIdx, pathRoomIdx);
    }
  }, []);

  useLayoutEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.addEventListener("scroll", handleScroll);
      return () => {
        chatListRef.current?.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

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
    goModal();
    setModalPorps({ profileImg, memberId });
  };

  const roomInfo = userInfo.find((user) => user.room?.roomIdx === pathRoomIdx);

  useEffect(() => {
    const getAllMember = async () => {
      try {
        const response = await axios.post("/api/chat/allMember");
        if (response.data) {
          setAllUserInfo(response.data);
        }
      } catch (error) {
        console.log("getAllMember", error);
      }
    };
    getAllMember();
    // }, [userInfo, allUserInfo]);
  }, []);

  const getRoomMemberList = async () => {
    const data = {
      userIdx: pathUserIdx,
      roomIdx: pathRoomIdx,
    };
    try {
      const response = await axios.post(`/api/chat/roomMember/`, data);
      const isMyIdxIncluded = response.data.includes(pathUserIdx);
      setInvitedMember(response.data);

      if (!isMyIdxIncluded) {
        alert("채팅방이 존재하지 않습니다.");
        window.location.replace("/chatList");
      }
      const roomInfo = {
        roomIdx: pathRoomIdx,
        users: response.data,
      };
      const users = await axios.post(`/api/chat/memberInfo/`, roomInfo);
      setUserInfo(users.data);
    } catch (error) {
      console.log("roomMember " + error);
    }
  };

  useEffect(() => {
    getRoomMemberList();
  }, [pathUserIdx, pathRoomIdx]);

  useEffect(() => {
    // chatListRef.current이 변경될 때마다 실행됩니다.
    if (chatListRef.current) {
      const chatListElement = chatListRef.current;
      chatListElement.scrollTop = chatListElement.scrollHeight;

      const isScrolledToBottom =
        chatListElement.scrollHeight - chatListElement.clientHeight <=
        chatListElement.scrollTop + 1;

      // chatListElement의 스크롤을 맨 아래로 이동시킵니다.
      if (isScrolledToBottom) {
        chatListElement.scrollTop = chatListElement.scrollHeight;
      }
    }
  }, [messages]);

  useEffect(() => {
    setUserIdx(pathUserIdx);

    const mqttClient = mqtt.connect("mqtt://localhost:9001");
    getChatList(pathUserIdx, pathRoomIdx);

    mqttClient.on("error", (error) => {
      console.log("Can't connect" + error);
      mqttClient.end();
    });

    // MQTT 클라이언트 이벤트 핸들러 등록
    mqttClient.on("connect", () => {
      console.log("연결됨");
      console.log("Connected to MQTT broker");
      // mqttClient.subscribe("chat");
      mqttClient.subscribe(String(pathRoomIdx));
    });

    mqttClient.on("message", (topic, message) => {
      console.log("Received message:", message.toString());
      console.log(mqttClient.options.clientId);
      console.log(topic);
      console.log(mqttClient);

      const parsedMessage = JSON.parse(message.toString());
      const isMine = parsedMessage.clientId === mqttClient.options.clientId; // 클라이언트 식별자와 일치 여부 판별
      const matchingUser = userInfo.find((user) => user.user?.userIdx === parsedMessage.userIdx);

      const processedMessage: publishedMessage = {
        userIdx: pathUserIdx,
        roomIdx: pathRoomIdx,
        text: parsedMessage.text,
        isMine: isMine,
        createAt: getCurrentTime(),
        clientId: mqttClient.options.clientId || "",
        user: matchingUser,
      };

      console.log("Received message:", processedMessage);
      setMessages((prevMessages: publishedMessage[]) => [...prevMessages, processedMessage]);

      if (processedMessage.userIdx === userIdx) {
        if (isMine) {
          saveChat(processedMessage);
        }
      } else {
        saveChat(processedMessage);
      }
    });

    setClient(mqttClient);

    return () => {
      // 컴포넌트 언마운트 시 MQTT 클라이언트 연결 해제
      mqttClient.end();
    };
  }, [userInfo]);

  const getChatList = async (userIdx: number, roomIdx: number) => {
    setLoading(true);

    const data = {
      userIdx: userIdx,
      roomIdx: roomIdx,
      page: Number(page.current),
    };
    try {
      const response = await axios.post(`/api/chat/list/`, data);

      if (response.data) {
        const prevScrollTop = chatListRef.current?.scrollTop!;
        setChatList((preList) => [...response.data, ...preList]);

        /// 추가된 항목 이후에 스크롤 위치 유지
        if (chatListRef.current) {
          const chatListElement = chatListRef.current;
          if (response.data.length >= 50) {
            setTimeout(() => {
              chatListElement.scrollTop =
                prevScrollTop + (chatListElement.scrollHeight - chatListElement.clientHeight);
            }, 0);
          }
        }
      }
      if (page.current === 1) {
        setChatList(response.data);
        if (chatListRef.current) {
          const chatListElement = chatListRef.current;
          chatListElement.scrollTop = chatListElement.scrollHeight;
        }
      }
    } catch (error) {
      alert("getChatList " + error);
    }

    setLoading(false);
  };

  const deleteMember: MouseEventHandler<HTMLDivElement> = async (event) => {
    event.preventDefault();

    if (window.confirm("채팅방을 나가시겠습니까?")) {
      try {
        const response = await axios.post("/api/chat/deleteMember", {
          userIdx: pathUserIdx,
          roomIdx: pathRoomIdx,
        });
        window.location.replace("/chatList");
      } catch (error) {
        alert(error);
      }
    }
  };

  const addChatRoom = async (userIdx: number) => {
    if (window.confirm("친구를 초대하시겠습니까?")) {
      try {
        const response = await axios.post("/api/chat/roomMemberList", {
          userIdx: userIdx,
          roomIdx: pathRoomIdx,
        });
        getRoomMemberList();
      } catch (error) {
        alert(error);
      }
      openSidebar();
    }
  };

  const saveChat = async (processedMessage: publishedMessage) => {
    try {
      const response = await axios.post(`/api/chat/saveChat/`, processedMessage);
    } catch (error) {
      alert(error);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    const pathRoomIdx = parseInt(pathname.split("/")[3]);
    event.preventDefault();
    const input = inputRef.current?.value;
    if (input) {
      // MQTT 브로커로 메시지 발행
      const publishedMessage = {
        text: input,
        isMine: true,
        clientId: client!.options.clientId, // 클라이언트 식별자
        userIdx: userIdx, //메세지 발신자 구분하기위해 입력
      };

      // client?.publish("chat", JSON.stringify(publishedMessage));
      client?.publish(String(pathRoomIdx), JSON.stringify(publishedMessage));

      inputRef.current.value = "";
      inputRef.current.focus();
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
      <header className="alt-header flex p-4 items-center justify-center ">
        <div className="alt-header__column w-5">
          <a href="/chatList">
            <FaChevronLeft />
          </a>
        </div>
        <div className="alt-header__column flex justify-center flex-grow">
          {" "}
          {/* Modified line */}
          <h3 className="alt-header__title text-base items-center justify-center font-medium text-xl font-semibold">
            {roomInfo?.room?.roomTitle}({userInfo.length})
          </h3>
        </div>
        <div className="alt-header__column ml-auto flex items-center w-5">
          <span className="alt-header__column-icon" onClick={openSidebar}>
            <FaBars />
          </span>
        </div>
      </header>
      {loading && <div className="flex items-center justify-center h-[20px]">Loading...</div>}
      <main
        ref={chatListRef}
        className="main-screen main-chat items-center px-2 h-[660px] overflow-scroll"
      >
        <input type="hidden" ref={chatDayRef} />
        <input type="hidden" ref={isSameDayRef} />
        <div>
          {chatList.map((chat, index) => {
            let chatDate = getChatDate(chat.createAt);

            if (!chatDayRef.current?.value || chatDayRef.current?.value !== chatDate) {
              chatDayRef.current?.setAttribute("value", chatDate);
              isSameDayRef.current?.setAttribute("value", "false");
            } else {
              isSameDayRef.current?.setAttribute("value", "true");
            }
            const chatTime = new Date(chat.createAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            if (chat.userIdx === userIdx) {
              return (
                <div key={index} className="message-row message-row-own justify-end">
                  {isSameDayRef.current?.value === "false" ? (
                    <div className="chat__timestamp bg-slate-300 text-white rounded-full py-1 px-2 my-8 mx-8 text-center font-base">
                      {chatDate}
                    </div>
                  ) : (
                    ""
                  )}

                  <div className="message-row__content">
                    <div className="message-row__info flex mb-2 items-end justify-end">
                      <span className="message-row__time opacity-75 text-sm">{chatTime}</span>
                      <span className="message-row__bubble bg-yellow-500 px-4 py-1 rounded-xl text-lg ml-2 mr-0">
                        {chat.text}
                      </span>
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <div key={index}>
                  {isSameDayRef.current?.value === "false" ? (
                    <div className="chat__timestamp bg-slate-300 text-white rounded-full py-1 px-2 my-8 mx-8 text-center font-base">
                      {chatDate}
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="message-row w-full flex mt-6 mb-3">
                    <Image
                      src={
                        chat.user?.profileImg
                          ? chat.user?.profileImg
                          : "/images/upload/basicProfile.png"
                      }
                      alt=""
                      width={50}
                      height={50}
                      className="object-cover w-12 h-12 rounded-lg mr-2.5"
                      onClick={() =>
                        clickModal(
                          chat.user?.profileImg
                            ? chat.user?.profileImg
                            : "/images/basicProfile.png",
                          chat.user?.id!
                        )
                      }
                    />
                    <div className="message-row__content">
                      <span className="message-row__author">{chat.user?.name}</span>
                      <div className="message-row__info flex mb-1 items-end">
                        <span className="message-row__bubble bg-white px-4 py-1 rounded-xl text-lg mr-2">
                          {chat.text}
                        </span>
                        <span className="message-row__time opacity-75 text-sm">{chatTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          })}
          {chatDayRef.current?.value !== getDay() ? (
            <div className="chat__timestamp bg-slate-300 text-white rounded-full py-1 px-2 my-6 mx-8 text-center font-base">
              {getDay()}
            </div>
          ) : (
            ""
          )}
          {messages.map((message, index) => {
            if (message.isMine) {
              return (
                <div key={index} className="message-row message-row-own justify-end">
                  <div className="message-row__content">
                    <div className="message-row__info flex mb-1 items-end justify-end">
                      <span className="message-row__time opacity-75 text-sm">
                        {message.createAt}
                      </span>
                      <span className="message-row__bubble bg-yellow-500 px-4 py-1 rounded-xl text-lg ml-2 mr-0">
                        {message.text}
                      </span>
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <div key={index} className="message-row w-full flex mb-6">
                  <Image
                    src={
                      message.user?.user?.profileImg
                        ? message.user?.user?.profileImg
                        : "/images/upload/basicProfile.png"
                    }
                    alt=""
                    width={50}
                    height={50}
                    className="object-cover w-12 h-12 rounded-lg mr-2.5"
                    onClick={() =>
                      clickModal(
                        message.user?.user?.profileImg
                          ? message.user?.user?.profileImg
                          : "/images/basicProfile.png",
                        message.user?.user?.id!
                      )
                    }
                  />
                  <div className="message-row__content">
                    <span className="message-row__author">{message.user?.user?.name}</span>
                    <div className="message-row__info flex mb-1 items-end">
                      <span className="message-row__bubble bg-white px-4 py-1 rounded-xl text-lg mr-2">
                        {message.text}
                      </span>
                      <span className="message-row__time opacity-75 text-sm">
                        {message.createAt}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
      </main>
      <form
        onSubmit={handleSubmit}
        className="reply bg-white fixed flex w-full justify-between px-1 py-6 box-border items-center"
      >
        <div className="reply__column flex items-center justify-center w-1/6">
          <button>
            <FaRegPlusSquare size={24} />
          </button>
        </div>
        <div className="reply__column flex items-center w-11/12 justify-center">
          <input
            ref={inputRef}
            type="text"
            placeholder="write a message"
            className="border p-2 w-full"
          />
          <button className="bg-yellow-500 border-none w-10 h-10 text-center">
            <FaArrowUp className="m-auto" />
          </button>
        </div>
      </form>

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
      {showModal && (
        <Modal
          clickModal={goModal}
          profileImg={modalProps.profileImg}
          memberId={modalProps.memberId}
        />
      )}
    </div>
  );
}

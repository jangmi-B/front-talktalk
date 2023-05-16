"use client";
import Image from "next/image";
import { FaChevronLeft } from "react-icons/fa";
import { FaBars } from "react-icons/fa";
import { FaRegPlusSquare } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { useState, useEffect, FormEvent, useRef } from "react";
import * as mqtt from "mqtt";

type publishedMessage = {
  text: string;
  isMine: boolean;
  currTime: string;
  clientId: string;
};

const getDay = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줍니다
  const day = today.getDate();

  const formattedDate = `${year}년 ${month}월 ${day}일`;
  return formattedDate;
};

const getCurrentTime = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();

  const formattedTime = `${hours}:${formattedMinutes}`;
  return formattedTime;
};

export default function chatRoom() {
  const isSidebarOpen = useRef(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const submenuRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);

  const [messages, setMessages] = useState<publishedMessage[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);

  useEffect(() => {
    const mqttClient = mqtt.connect("mqtt://localhost:9001");
    console.log(mqttClient.connected);

    mqttClient.on("error", (error) => {
      console.log("Can't connect" + error);
      mqttClient.end();
    });

    // MQTT 클라이언트 이벤트 핸들러 등록
    mqttClient.on("connect", () => {
      console.log("연결됨");
      console.log("Connected to MQTT broker");
      mqttClient.subscribe("chat");
    });

    mqttClient.on("message", (topic, message) => {
      console.log("Received message:", message.toString());
      console.log(mqttClient.options.clientId);
      console.log(topic);
      console.log(mqttClient);
      // setMessages((prevMessages) => [...prevMessages, message.toString()]);

      const parsedMessage = JSON.parse(message.toString());
      const isMine = parsedMessage.clientId === mqttClient.options.clientId; // 클라이언트 식별자와 일치 여부 판별
      const processedMessage: publishedMessage = {
        text: parsedMessage.text,
        isMine: isMine,
        currTime: getCurrentTime(),
        clientId: mqttClient.options.clientId || "",
      };
      console.log("Received message:", processedMessage);
      console.log(processedMessage.isMine);
      setMessages((prevMessages: publishedMessage[]) => [...prevMessages, processedMessage]);
    });

    setClient(mqttClient);

    return () => {
      // 컴포넌트 언마운트 시 MQTT 클라이언트 연결 해제
      mqttClient.end();
    };
  }, []);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const input = inputRef.current?.value;
    if (input) {
      // MQTT 브로커로 메시지 발행
      const publishedMessage = {
        text: input,
        isMine: true,
        clientId: client!.options.clientId, // 클라이언트 식별자
      };
      client?.publish("chat", JSON.stringify(publishedMessage));
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  };

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
      <header className="alt-header flex p-4 items-center justify-center ">
        <div className="alt-header__column w-1/3">
          <a href="/chatList">
            <FaChevronLeft />
          </a>
        </div>
        <div className="alt-header__column w-1/3">
          <h1 className="alt-header__title text-base font-medium text-xl font-semibold">
            채팅방이름(3)
          </h1>
        </div>
        <div className="alt-header__column ml-auto flex items-center">
          {/* <span className="alt-header__column-icon mr-4">
            <FaSearch />
          </span> */}
          <span className="alt-header__column-icon" onClick={openSidebar}>
            <FaBars />
          </span>
        </div>
      </header>
      <main className="main-screen main-chat items-center px-2 h-[660px] overflow-scroll">
        <div className="chat__timestamp bg-slate-400 text-white rounded-full py-1 px-2 my-6 mx-8 text-center font-base">
          {getDay()}
        </div>
        {messages.map((message, index) => {
          if (message.isMine) {
            return (
              <div key={index} className="message-row message-row-own justify-end">
                <div className="message-row__content">
                  <div className="message-row__info flex mb-1 items-end justify-end">
                    <span className="message-row__time opacity-75 text-sm">{message.currTime}</span>
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
                  src={"/images/example.jpeg"}
                  alt=""
                  width={50}
                  height={50}
                  className="object-cover w-12 h-12 rounded-lg mr-2.5"
                />
                <div className="message-row__content">
                  <span className="message-row__author">나는 고양이</span>
                  <div className="message-row__info flex mb-1 items-end">
                    <span className="message-row__bubble bg-white px-4 py-1 rounded-xl text-lg mr-2">
                      {message.text}
                    </span>
                    <span className="message-row__time opacity-75 text-sm">{message.currTime}</span>
                  </div>
                </div>
              </div>
            );
          }
        })}
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

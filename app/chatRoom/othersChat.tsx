"use client";
import Modal from "@/app/component/modal";
import { publishedMessage } from "@/app/component/types";
import Image from "next/image";
import { useState } from "react";

type ChatProps = {
  chat: publishedMessage;
};

export default function OthersChat({ chat }: ChatProps) {
  // 프로필사진 모달관련
  const [showModal, setShowModal] = useState(false);
  const [modalProps, setModalPorps] = useState({
    profileImg: "",
    memberId: "",
  });

  const chatTime = new Date(chat.createAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const goModal = () => {
    setShowModal(!showModal);
  };
  const clickModal = (profileImg: string, memberId: string) => {
    goModal();
    setModalPorps({ profileImg, memberId });
  };
  return (
    <div className="message-row w-full flex mt-6 mb-3">
      <Image
        src={chat.user?.profileImg ? chat.user?.profileImg : "/images/upload/basicProfile.png"}
        alt=""
        width={50}
        height={50}
        className="object-cover w-12 h-12 rounded-lg mr-2.5"
        onClick={() =>
          clickModal(
            chat.user?.profileImg ? chat.user?.profileImg : "/images/basicProfile.png",
            chat.user?.id!
          )
        }
      />
      <div>
        <span className="message-row__author">{chat.user?.name}</span>
        <div className="message-row__info flex mb-1 items-end">
          <span className="message-row__bubble bg-white px-4 py-1 rounded-xl text-lg mr-2">
            {chat.text}
          </span>
          <span className="message-row__time opacity-75 text-sm">{chatTime}</span>
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

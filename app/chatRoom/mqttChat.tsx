"use client";
import Modal from "@/app/component/modal";
import { publishedMessage } from "@/app/component/types";
import Image from "next/image";
import { useState } from "react";

type ChatProps = {
  message: publishedMessage;
};

export default function MqttChat({ message }: ChatProps) {
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
  return (
    <div className="message-row w-full flex mb-6">
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
      <div>
        <span className="message-row__author">{message.user?.user?.name}</span>
        <div className="message-row__info flex mb-1 items-end">
          <span className="message-row__bubble bg-white px-4 py-1 rounded-xl text-lg mr-2">
            {message.text}
          </span>
          <span className="message-row__time opacity-75 text-sm">{message.createAt}</span>
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

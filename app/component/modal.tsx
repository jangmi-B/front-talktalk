import { SearchModalBox, SearchModalContent } from "./modalStyle";
import Image from "next/image";

type ModalProps = {
  clickModal: () => void;
  profileImg: string;
  memberId: string;
};

const Modal = (props: ModalProps) => {
  // 전달받은 state 함수
  const { clickModal, profileImg, memberId } = props;

  return (
    // 뒷배경을 클릭하면 모달을 나갈 수 있게 해야하므로 뒷 배경 onClick에 state함수를 넣는다.
    <SearchModalBox onClick={clickModal}>
      <SearchModalContent
        onClick={(e) => e.stopPropagation()}
        className="flex items-center justify-between z-[999]"
      >
        <Image src={profileImg} width={300} height={300} alt="" className=" z-[999]" />
      </SearchModalContent>
    </SearchModalBox>
  );
};

export default Modal;

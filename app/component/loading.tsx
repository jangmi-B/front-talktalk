import Spinner from "../../public/images/Iphone-spinner-2.gif";
import Image from "next/image";

export const Loading = () => {
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
      <h3 className="mb-3">Loading...</h3>
      <Image src={"/images/Iphone-spinner-2.gif"} alt="loaging" width={50} height={50} />
    </div>
  );
};

import { FaWifi } from "react-icons/fa";
import { FaBatteryFull } from "react-icons/fa";

export default function Header() {
  const getCurrentTime = () => {
    const chatTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return chatTime;
  };

  return (
    <div id="chat-screen" className="bg-slate-100">
      <div className="status-bar bg-white flex justify-between items-center p-2">
        <div className="status-bar__column flex items-center">
          <span>Hello</span>
          <FaWifi />
        </div>
        <div className="status-bar__column">
          <span>{getCurrentTime()}</span>
        </div>
        <div className="status-bar__column flex items-center">
          <span>100%</span>
          <FaBatteryFull />
        </div>
      </div>
    </div>
  );
}

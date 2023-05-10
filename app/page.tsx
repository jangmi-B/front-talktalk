import Image from "next/image";
import { FaWifi } from "react-icons/fa";
import { FaBatteryFull } from "react-icons/fa";

export default function Login() {
  return (
    <>
      {/* <div id="chat-screen" className="bg-slate-100">
        <div className="status-bar bg-white flex justify-between items-center p-2">
          <div className="status-bar__column flex items-center">
            <span>Hello</span>
            <FaWifi />
          </div>
          <div className="status-bar__column">
            <span>18:43</span>
          </div>
          <div className="status-bar__column flex items-center">
            <span>100%</span>
            <FaBatteryFull />
          </div>
        </div>
      </div> */}

      <header className="bg-white p-4 mt-32 text-center">
        <Image alt="logo" src={"/images/small_logo.png"} width={500} height={200} priority={true} />
        <h1 className="text-2xl font-bold">Welcome to TalkTalk</h1>
      </header>

      <form action="friends.html" method="get" id="login-form" className="p-4">
        <input
          name="username"
          type="text"
          placeholder="Enter your ID"
          className="border p-2 mb-2 w-full"
          autoComplete="off"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="border p-2 mb-2 w-full"
          autoComplete="off"
        />
        <input
          type="submit"
          value="Log In"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer w-full"
        />
        <div className="flex justify-end">
          <a href="/signUp" className="text-blue-500 ml-auto">
            If you don't have an account, go sign up!
          </a>
        </div>
      </form>
    </>
  );
}

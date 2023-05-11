"use client";
import { useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { FaEllipsisH } from "react-icons/fa";

export default function chatList() {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      <header className="screen-header flex justify-between px-6 items-center my-4">
        <h1 className="screen-header__title text-3xl">MyPage</h1>
      </header>

      <div className="max-w-sm mx-auto bg-white py-8 px-6">
        <form>
          <div className="flex items-center space-x-6 ">
            <div className="shrink-0">
              <img
                className="h-16 w-16 object-cover rounded-full"
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1361&q=80"
                alt="Current profile photo"
              />
            </div>
            <label className="block">
              <span className="sr-only">Choose profile photo</span>
              <input
                type="file"
                className="block w-full text-sm text-slate-500 file:text-sm file:font-semibold file:py-2 file:px-4 file:bg-violet-50 file:text-violet-700 file:rounded-full file:border-0 file:mr-4 hover:file:bg-violet-100"
              />
            </label>
          </div>

          <div className="mt-6">
            <label className="block">
              <span className="block text-sm font-medium mb-3 text-slate-700">Your ID</span>
              <input
                readOnly
                className="p-6 border-slate-300 border bg-slate-100 mb-3 rounded-md h-10 w-full placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500"
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium mb-3 text-slate-700">Your Name</span>
              <input className="p-6 border-slate-300 border mb-3 rounded-md h-10 w-full placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500" />
            </label>
            <label className="block">
              <span className="block text-sm font-medium mb-3 text-slate-700">Your Password</span>
              <input
                type="password"
                className="p-6 border-slate-300 border mb-3 rounded-md h-10 w-full placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500"
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium mb-3 text-slate-700">
                Confirm Password
              </span>
              <input
                type="password"
                className="p-6 border-slate-300 border mb-3 rounded-md h-10 w-full placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-md text-center bg-blue-700 py-3 rounded bg-green text-white hover:bg-green-dark focus:outline-none my-1"
            >
              Modify Account
            </button>
          </div>
        </form>
      </div>

      <nav className="nav fixed bottom-0 w-full bg-gray-50 py-5 px-10 border-t border-gray-200">
        {isDropdownOpen && (
          <div className="dropdown absolute bottom-14 right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-[999]">
            <ul className="dropdown__menu">
              <li className="dropdown__item">
                <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  로그아웃
                </a>
              </li>
            </ul>
          </div>
        )}
        <ul className="nav__list flex justify-between">
          <li className="nav__btn">
            <a className="nav__link" href="/myPage">
              <FaRegUser size={24} />
            </a>
          </li>
          <li className="nav__btn">
            <a className="nav__link" href="/chatList">
              <FaRegComment size={24} />
            </a>
          </li>

          <li className="nav__btn relative">
            <button className="nav__link" onClick={toggleDropdown}>
              <FaEllipsisH size={24} />
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}

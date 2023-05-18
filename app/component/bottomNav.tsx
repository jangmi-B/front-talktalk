"use client";
import axios from "axios";
import { useContext, useState } from "react";
import { FaEllipsisH, FaRegComment, FaRegUser } from "react-icons/fa";
import { AuthContext, AuthContextType } from "./authContext";

export default function BottomNav() {
  const authContext = useContext<AuthContextType>(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const logOut = () => {
    if (window.confirm("로그아웃 하시곘습니까?")) {
      authContext.logout();
    }
  };

  return (
    <>
      {isDropdownOpen && (
        <div className="dropdown absolute bottom-14 right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-[999]">
          <ul className="dropdown__menu">
            <li className="dropdown__item">
              <a onClick={logOut} className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                로그아웃
              </a>
            </li>
            <li className="dropdown__item">
              <a href="/myPage" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                마이페이지
              </a>
            </li>
          </ul>
        </div>
      )}
      <nav className="nav fixed bottom-0 w-full bg-gray-50 py-5 px-10 border-t border-gray-200">
        <ul className="nav__list flex justify-between">
          <li className="nav__btn">
            <a className="nav__link" href="/friendList">
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

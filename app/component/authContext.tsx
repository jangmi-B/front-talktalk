"use client";
import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { UserInfo } from "./types";
import { useCookies } from "react-cookie";

export type AuthContextType = {
  logout: () => void;
  getAuthUser: () => Promise<UserInfo>;
};

export const AuthContext = createContext<AuthContextType>({
  logout: (): void => {},
  getAuthUser: async (): Promise<UserInfo> => {
    return {} as UserInfo;
  },
});

type AuthContextProviderProps = {
  children: React.ReactNode;
};

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [cookies, removeCookie] = useCookies(["Authentication"]);
  const authenticationCookie = cookies["Authentication"];

  const getAuthUser = async () => {
    if (authenticationCookie && authenticationCookie.accessToken) {
      try {
        const token = `Bearer ${authenticationCookie.accessToken}`;
        const response = await axios.post("/api/check", null, {
          headers: {
            Authorization: token,
          },
        });
        // setUser(response.data);
        return response.data;
      } catch (error) {
        alert("쿠키 " + error);
        return {} as UserInfo;
      }
    } else {
      alert("접근 권한이 없습니다. 로그인화면으로 돌아갑니다.");
      window.location.replace("/");
    }
  };

  const logout = () => {
    removeCookie("Authentication", { path: "/" });
    window.location.replace("/");
  };

  return <AuthContext.Provider value={{ logout, getAuthUser }}>{children}</AuthContext.Provider>;
};

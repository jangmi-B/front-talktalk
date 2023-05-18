export type User = {
  id: string;
  password: string;
  name: string;
};

export type UserInfo = {
  userIdx: number;
  id: string;
  password: string;
  name: string;
  profileImg?: string;
  room?: ChatRoom;
  user?: UserInfo;
};

export type ChatMemberInput = {
  friendIdx: number;
  userIdx: number;
  roomIdx: number;
};

export type ChatMember = {
  memberIdx: number;
  roomIdx: number;
  createAt: string;
  userIdx: number;
};

export type ChatRoom = {
  roomIdx: number;
  roomTitle: string;
  createAt: string;
};

export type publishedMessage = {
  userIdx: number;
  roomIdx: number;
  text: string;
  isMine: boolean;
  createAt: string;
  clientId: string;
  user?: UserInfo;
};

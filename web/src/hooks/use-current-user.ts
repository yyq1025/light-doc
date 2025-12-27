import { BroadcastChannel } from "broadcast-channel";
import { useCallback, useEffect, useRef, useState } from "react";
import type { UserInfo } from "@/lib/tiptap";
import {
  getOrCreateUser,
  LOCALSTORAGE_USER_KEY,
  USER_CHANNEL_NAME,
} from "@/lib/tiptap";

export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState<UserInfo>(() =>
    getOrCreateUser(),
  );
  const userChannelRef = useRef<BroadcastChannel<UserInfo> | null>(null);

  useEffect(() => {
    userChannelRef.current = new BroadcastChannel<UserInfo>(USER_CHANNEL_NAME);

    userChannelRef.current.onmessage = (user) => setCurrentUser(user);

    return () => {
      userChannelRef.current?.close();
      userChannelRef.current = null;
    };
  }, []);

  const updateCurrentUser = useCallback((user: UserInfo) => {
    setCurrentUser(user);
    localStorage.setItem(LOCALSTORAGE_USER_KEY, JSON.stringify(user));
    userChannelRef.current?.postMessage(user);
  }, []);

  return { currentUser, updateCurrentUser };
};

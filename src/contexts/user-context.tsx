import { BroadcastChannel } from "broadcast-channel";
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  getOrCreateUser,
  LOCALSTORAGE_USER_KEY,
  USER_CHANNEL_NAME,
  type UserInfo,
} from "@/lib/tiptap";

type UserContextValue = {
  user: UserInfo;
  updateUser: (user: UserInfo) => void;
};

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo>(() => getOrCreateUser());
  const userChannelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    const bc = new BroadcastChannel<UserInfo>(USER_CHANNEL_NAME);
    userChannelRef.current = bc;

    bc.onmessage = setUser;

    return () => {
      bc.close();
      userChannelRef.current = null;
    };
  }, []);

  const updateUser = useCallback((user: UserInfo) => {
    setUser(user);
    localStorage.setItem(LOCALSTORAGE_USER_KEY, JSON.stringify(user));
    userChannelRef.current?.postMessage(user);
  }, []);

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = use(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within <UserProvider />");
  }
  return ctx;
}

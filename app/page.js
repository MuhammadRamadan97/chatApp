'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "./context";
import dynamic from "next/dynamic";
import { getCookie } from "@/utils/cookies";

const ChatContainer = dynamic(() => import("./components/chat/ChatContainer"), { ssr: false });
const UsersList = dynamic(() => import("./components/usersList/UsersList"), { ssr: false });
import { unstable_noStore as noStore } from 'next/cache';

export default function Home() {
  noStore(() => {
    console.log('This will not be server-side rendered.');
  });
  const router = useRouter();
  const token = getCookie('token');
  const { selectedUser, setSelectedUser } = useUser();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push('/auth');
    }
  }, [token, router]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 400);
    };

    handleResize(); // Call it once on mount to set initial state
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleUsersList = () => {
    setSelectedUser(null);
  };

  return (
    <div className="flex h-screen relative">
      {isMobile ? (
        <div className="w-full h-full">
          {selectedUser && (
            <button
              className="fixed top-2 right-2 p-4 text-2xl"
              onClick={toggleUsersList}
              aria-label="Toggle Users List"
            >
              &#9776; {/* Three dashed button */}
            </button>
          )}
          {!selectedUser ? (
            <UsersList />
          ) : (
            <div className="flex flex-col h-full">
              <ChatContainer className="flex-1" />

            </div>
          )}
        </div>
      ) : (
        <div className="flex h-full w-full">
          {selectedUser && <div className="w-2/3 h-full">
            <ChatContainer />
          </div>}
          <div className="w-1/3 h-full">
            <UsersList />
          </div>
        </div>
      )}
    </div>
  );
}

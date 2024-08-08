'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "./context";
import dynamic from "next/dynamic";
import { getCookie } from "@/utils/cookies";

const ChatContainer = dynamic(() => import("./components/chat/ChatContainer"), { ssr: false });
const UsersList = dynamic(() => import("./components/usersList/UsersList"), { ssr: false });

export default function Home() {
  const router = useRouter();
  const token = getCookie('token');
  const { selectedUser, setSelectedUser, usersList } = useUser();
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

  const selectedUserName = usersList.find(user => user._id === selectedUser)?.username;

  return (
    <div className="flex h-screen relative bg-sky-200">
      {isMobile ? (
        <div className="w-full h-full relative">
          {selectedUser ? (
            <>
              <div className="flex items-center justify-between p-4 bg-sky-500 text-white fixed top-0 left-0 right-0 z-10">
                <button
                  className="text-2xl"
                  onClick={toggleUsersList}
                  aria-label="Back to Users List"
                >
                  &#8592; {/* Back arrow */}
                </button>
                <span className="text-xl font-bold">{selectedUserName}</span>
                <span className="w-6"></span> {/* Spacer for alignment */}
              </div>
              <div className="flex flex-col h-full pt-16"> {/* Padding top to avoid overlap */}
                <ChatContainer className="flex-1" />
              </div>
            </>
          ) : (
            <UsersList />
          )}
        </div>
      ) : (
        <div className="flex h-full w-full">
          {selectedUser && (
            <>
              <div className="w-2/3 h-full">
                <ChatContainer />
              </div>
              <div className="w-1/3 h-full">
                <UsersList />
              </div>
            </>
          )}
          {!selectedUser && (
            <UsersList />
          )}
        </div>
      )}
    </div>
  );
}

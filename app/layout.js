// app/layout.js

import "./globals.css";
import { UserProvider } from "./context";
import axios from "axios";

export const metadata = {
  title: "Chat App",
  description: "Chat App by Muhammad Ramadan",
};

export default function RootLayout({ children }) {
  axios.defaults.withCredentials = true;
  // Change base URL for Axios requests
  axios.defaults.baseURL = 'http://localhost:3000/api/';

  return (
    <html lang="en" style={{ height: "100%" }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Marhey:wght@300..700&family=Rubik:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet" />

      </head>
      <body style={{ height: "100%" }}>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}

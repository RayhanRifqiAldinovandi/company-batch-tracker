import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const authIsLoggedIn = () => {
  const [loggedInUser, setLoggedInUser] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Cek apakah ada pengguna yang sudah login saat komponen dimuat
    const loggedInUserData = localStorage.getItem("loggedInUser");
    if (loggedInUserData) {
      setLoggedInUser(JSON.parse(loggedInUserData));
      // console.log(loggedInUserData);
    }

    const token = localStorage.getItem("token");
    if (token) {
      // Decode token untuk memeriksa waktu kedaluwarsa
      const tokenData = parseJwt(token);
      if (tokenData.exp * 1000 < Date.now()) {
        // Jika token sudah kedaluwarsa, redirect ke halaman login
        router.push("/login");
      } else {
        // Jika token masih berlaku, redirect ke dashboard
        // router.push("/dashboard");
      }
    }
  }, []);

  // Fungsi untuk mendekode token JWT
  const parseJwt = (token) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  };

  return { loggedInUser };
};

export default authIsLoggedIn;

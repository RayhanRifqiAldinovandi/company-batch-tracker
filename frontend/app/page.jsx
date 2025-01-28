"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function page() {
  const router = useRouter();

  // Ketika website diakses langsung redirect ke halaman login
  useEffect(() => {
    router.push("/login");
  }, []);
  return null;
}

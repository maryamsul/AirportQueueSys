import { useEffect, useState } from "react";

const KEY = "skyqueue_auth";

function read(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(KEY) === "1";
}

export function useAuth() {
  const [isAuthed, setIsAuthed] = useState(false);
  useEffect(() => { setIsAuthed(read()); }, []);
  useEffect(() => {
    const onStorage = () => setIsAuthed(read());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  return {
    isAuthed,
    login: () => { window.localStorage.setItem(KEY, "1"); setIsAuthed(true); },
    logout: () => { window.localStorage.removeItem(KEY); setIsAuthed(false); },
  };
}

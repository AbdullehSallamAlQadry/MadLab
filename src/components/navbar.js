'use client';
import Link from "next/link";
import PopupLogin from "./login";
import PopupSignup from "./signup";
import { useState } from "react";

const btns_links_style = "text-xl flex text-light-text-main dark:text-dark-text-main";

const btnLinkStyle = "px-4 py-1.5 rounded-md dark:hover:bg-dark-btn-bg dark:hover:text-dark-btn-text hover:bg-light-btn-bg hover:text-light-btn-text";
const btnStyle = "cursor-pointer";

export default function Navbar() {
  const [openLogin, setOpenLogin] = useState(false)
  const [openRegister, setOpenRegister] = useState(false)
  
  return (
    <nav className="w-full flex sticky top-0 items-center justify-between py-5 dark:bg-dark-bg-main bg-light-bg-main px-40">
      <h1 className="text-4xl font-thin dark:text-dark-text-main text-light-text-main cursor-default">MadMind</h1>
      <div className={`${btns_links_style} gap-10 pt-2`}>
        <Link className={btnLinkStyle} href="/">Home</Link>
        <Link className={btnLinkStyle} href="/diagnostics">Diagnostics</Link>
        <Link className={btnLinkStyle} href="/history">History</Link>
        <Link className={btnLinkStyle} href="/about">About us</Link>
      </div>
      <div className={`${btns_links_style} gap-xl`}>
        <button onClick={() => setOpenRegister(true)} className={`${btnLinkStyle} ${btnStyle}`}>Sign up</button>
        <button onClick={() => setOpenLogin(true)} className={`${btnLinkStyle} ${btnStyle}`}>Login</button>
      </div>
      <PopupSignup openRegister={openRegister} setOpenLogin={setOpenLogin} setOpenRegister={setOpenRegister}/>
      <PopupLogin openLogin={openLogin} setOpenLogin={setOpenLogin} setOpenRegister={setOpenRegister}/>
    </nav>
  );
}
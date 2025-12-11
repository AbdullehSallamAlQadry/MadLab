import Link from "next/link";
import PopupLogin from "./login";
import PopupSignup from "./signup";

const btns_links_style = "text-xl flex text-black dark:text-white";

const btnLinkStyle = "px-4 py-1.5 rounded-md hover:bg-white hover:text-black";
const btnStyle = "cursor-pointer";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between py-5 bg-transparent px-40">
      <h1 className="text-4xl font-thin text-white cursor-default">MadMind</h1>
      <div className={`${btns_links_style} gap-10 pt-2`}>
        <Link className={btnLinkStyle} href="/">Home</Link>
        <Link className={btnLinkStyle} href="/diagnostics">Diagnostics</Link>
        <Link className={btnLinkStyle} href="/history">History</Link>
        <Link className={btnLinkStyle} href="/about">About us</Link>
      </div>
      <div className={`${btns_links_style}  gap-1xl`}>
        <PopupSignup btnLinkStyle={btnLinkStyle} btnStyle={btnStyle} />
        <PopupLogin btnLinkStyle={btnLinkStyle} btnStyle={btnStyle} />
      </div>
    </nav>
  );
}
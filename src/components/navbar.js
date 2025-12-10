import Link from "next/link";

const links_style = "flex gap-16 text-black dark:text-white pt-2";
const linkStyle = "px-2.5 py-1.5 rounded-md hover:bg-white hover:text-black";

const btns_style = "flex gap-[24px] text-black dark:text-white pt-2";
const btnStyle = "px-2.5 py-1.5 rounded-md hover:bg-white hover:text-black cursor-pointer";


export default function Navbar() {
  return (
    <nav className="flex items-center justify-between py-5 bg-transparent px-[164px] gap-[200px]">
      <h1 className="text-2xl font-thin text-white cursor-default">MadMind</h1>
      <div className={links_style}>
        <Link className={linkStyle} href="/">Home</Link>
        <Link className={linkStyle} href="/diagnostics">Diagnostics</Link>
        <Link className={linkStyle} href="/history">history</Link>
        <Link className={linkStyle} href="/about">About us</Link>
      </div>
      <div className={btns_style}>
        <button className={btnStyle}>Sign Up</button>
        <button className={btnStyle}>Login</button>
      </div>
    </nav>
  );
}
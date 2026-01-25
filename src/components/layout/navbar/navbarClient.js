'use client';

import Link from "next/link";
import PopupLogin from "../../feature/auth/login";
import PopupSignup from "../../feature/auth/signup";
import PopupLogout from "../../feature/auth/logout";
import LoginReminder from "../../ui/login_reminder";
import { useRef, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faMoneyBill1, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../../context/AuthContext";

export default function NavbarClient({doctor}) {
  const profileRef = useRef(null);
  const [openProfile, setOpenProfile] = useState(false)
  const { login, signup, openLogin, openSignup, closeAll , logout, logoutAction} = useAuth();

  const AccountNavItems = [
    { label: 'Billing', href: '/bills', icon: faMoneyBill1, type: 'link' },
    { label: 'Edit', href: '/edit/profile', icon: faPenToSquare, type: 'link' },
    { label: 'Log out', onClick: 'logout', icon: faArrowRightFromBracket, type: 'button' },
  ];

  const HeaderNavItems = [
    { label: "Home", href: "/", access: true},
    { label: "Diagnostics", href: "/diagnostics", access: true},
    { label: "History", href: "/history", access: doctor},
    { label: "About us", href: "/about", access: true},
  ];

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setOpenProfile(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  return (
    <header className="w-full flex sticky top-0 items-center justify-between py-5 bg-bg-main px-40 z-60">
      <h1 className="text-4xl text-text-main cursor-default"><span className="text-green-700">M</span>ed<span className="text-green-700">M</span>ind</h1>
      
      <nav className='text-xl flex text-text-main gap-10 pt-2'>
        {HeaderNavItems.map((item, index) => (
          item.access && <Link key={index} className="linkStyle" href={item.href}>{item.label}</Link>
        ))}
      </nav>

      {!doctor && (
        <div className='text-xl flex text-text-main gap-6 pt-2'>
          <button onClick={() => openSignup(true)} className='linkStyle'>Sign up</button>
          <button onClick={() => openLogin(true)} className='linkStyle'>Login</button>
          { signup && <PopupSignup openRegister={signup} setOpenLogin={openLogin} close={closeAll}/> }
        </div>
      )}
      { login && <PopupLogin  openLogin={login} setOpenRegister={openSignup} close={closeAll}/> }
      <LoginReminder />
      {doctor && (
        <div className="relative flex items-center gap-2">
          <p className="border border-border-color w-20 rounded-2xl text-center">{doctor?.credits}</p> 
          <div 
            className="relative"
            ref={profileRef}
          >
            <button 
              className='hover:bg-btn-bg hover:text-btn-text rounded-full px-0.5 py-1 cursor-pointer gap-2 flex items-center' 
              onClick={() => setOpenProfile(!openProfile)}
            >
              <FontAwesomeIcon icon={faUserCircle} className="text-[30px]" />
            </button>
            <div className={`z-9999 ${openProfile ? 'visible' : 'hidden'}`}>
              <div className="absolute w-fit top-10 right-0 border bg-bg-second border-border-color rounded-xl flex flex-col items-center justify-center p-4 gap-2 shadow-md">
                {
                  doctor.profile_picture ? (
                    <img 
                    src={doctor.profile_picture}
                    alt="Profile Picture"
                    className="w-20 h-20 rounded-full object-cover"
                    />
                    ) : 
                    (
                    <div className="w-20 h-20 rounded-full bg-text-main flex items-center justify-center">
                      <FontAwesomeIcon icon={faUserCircle} size="3x" className="text-bg-main"/>
                    </div>
                    )
                }
                <div className="flex flex-col items-center px-2">
                  <h2 className="font-semibold">{doctor?.name}</h2>
                  <p className="text-sm text-text-second">{doctor?.email}</p>
                </div>
                <nav className="w-full flex items-center gap-2 mt-2">
                  {AccountNavItems.map((item, index) => (
                    <ProfileNavItem 
                      key={index} 
                      item={item} 
                      onClose={() => setOpenProfile(false)} 
                      onLogout={() => logoutAction(true)}
                    />
                  ))}
                </nav>
              </div>
            </div>
          </div>
          <PopupLogout openLogout={logout} setOpenLogout={logoutAction} />
        </div>
      )}
    </header>
  );
}

const ProfileNavItem = ({ item, onClose, onLogout }) => {
  const commonStyles = "w-full flex flex-col items-center rounded-md cursor-pointer px-2 py-2 hover:outline-border-color hover:outline hover:bg-text-main hover:text-bg-main";
  const content = ( <>
      <div className="border border-border-color rounded-xl flex items-center justify-center w-12 h-12">
        <FontAwesomeIcon icon={item.icon} className="text-2xl" />
      </div>
      <p className="mt-1 text-sm font-medium">{item.label}</p>
  </>);
  if (item.type === 'link') {
    return <Link href={item.href} onClick={onClose} className={commonStyles}>{content}</Link>
  }
  return <button onClick={() => { onClose(); onLogout?.(); }} className={commonStyles}>{content}</button>
};
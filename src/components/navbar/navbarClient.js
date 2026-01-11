'use client';

import Link from "next/link";
import PopupLogin from "../auth/login";
import PopupSignup from "../auth/signup";
import PopupLogout from "../auth/logout";
import { useRef, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faMoneyBill1, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../AuthContext";

export default function NavbarClient({doctor}) {
  const profileRef = useRef(null);
  const [openProfile, setOpenProfile] = useState(false)
  const { login, signup, openLogin, openSignup, closeAll , logout, logoutAction} = useAuth();

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
    <nav className="w-full flex sticky top-0 items-center justify-between py-5 bg-bg-main px-40 z-50">
      <h1 className="text-4xl font-thin text-text-main cursor-default">MedMind</h1>
      
      <div className='text-xl flex text-text-main gap-10 pt-2'>
        <Link className='linkStyle' href="/">Home</Link>
        <Link className='linkStyle' href="/diagnostics">Diagnostics</Link>
        {doctor && (
          <Link className='linkStyle' href="/history">History</Link>
        )}
        <Link className='linkStyle' href="/about">About us</Link>
      </div>

      {!doctor && (
        <div className='text-xl flex text-text-main gap-6 pt-2'>
          <button onClick={() => openSignup(true)} className='linkStyle'>Sign up</button>
          <button onClick={() => openLogin(true)} className='linkStyle'>Login</button>
          <PopupSignup openRegister={signup} setOpenLogin={openLogin} close={closeAll}/>
          <PopupLogin openLogin={login} setOpenRegister={openSignup} close={closeAll}/>
        </div>
      )}
      {doctor && (
        <div className="relative">
        <div className={`flex items-center gap-2`}>
          <p className="border border-border-color w-20 rounded-2xl text-center">{doctor?.credits}</p> 
          <div 
            className="relative"
            ref={profileRef}
          >
            <button 
              className='hover:bg-btn-bg hover:text-btn-text rounded-full px-0.5 py-1 cursor-pointer gap-2 flex items-center' 
              onClick={() => setOpenProfile(!openProfile)}
            >
              {/* show the doctor image if exist, if not show user circle icon*/}
              <FontAwesomeIcon icon={faUserCircle} className="text-[30px]" />
            </button>
            <div className={`z-9999 ${openProfile ? 'visible' : 'hidden'}`}>
              <div className="absolute w-fit top-10 right-0 border bg-bg-second border-border-color rounded-xl flex flex-col items-center justify-center p-4 gap-2">
                {/*
                  doctor.profile_picture ? (
                    <img 
                    src={doctor.profile_picture}
                    alt="Profile Picture"
                    className="w-20 h-20 rounded-full object-cover"
                    />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-light-text-main dark:bg-dark-text-main flex items-center justify-center">
                      <FontAwesomeIcon icon={faUserCircle} size="3x" className="text-light-bg-main dark:text-dark-bg-main"/>
                      </div>
                      )
                      */
                    <div className="w-15 h-15 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faUserCircle} size="4x" className="rounded-full bg-bg-main text-text-main"/>
                  </div>
                }
                {/* edit the styles we you are logged in */}
                <div className="flex flex-col items-center px-2">
                  <h2 className="font-semibold">{doctor?.name}</h2>
                  <p className="text-sm text-text-second">{doctor?.email}</p>
                </div>
                <div className="w-full flex items-center gap-2 mt-2">            
                  <button 
                    className="w-full text-center rounded-md cursor-pointer px-2 py-1 hover:bg-light-text-main dark:hover:bg-dark-text-main dark:hover:border-dark-text-main hover:border-light-text-main dark:hover:text-dark-bg-main hover:text-light-bg-main" 
                    onClick={() => setOpenProfile(false)}   
                    >
                    <div className="border rounded-xl flex items-center justify-center w-12 h-12">
                      <FontAwesomeIcon icon={faMoneyBill1} className="text-2xl"/>
                    </div>
                    <p className="mt-1 text-sm">Billing</p>
                  </button>
                  <Link 
                    className="w-full text-center rounded-md cursor-pointer px-2 py-1 hover:bg-light-text-main dark:hover:bg-dark-text-main dark:hover:border-dark-text-main hover:border-light-text-main dark:hover:text-dark-bg-main hover:text-light-bg-main"
                    href="/edit"
                    onClick={() => setOpenProfile(false)}  
                    >
                    <div className="border rounded-xl flex items-center justify-center w-12 h-12">
                      <FontAwesomeIcon icon={faPenToSquare} className="text-2xl"/>
                    </div>
                    <p className="mt-1 text-sm">Edit</p>
                  </Link>
                  <button 
                    className="w-full text-center rounded-md cursor-pointer px-2 py-1 hover:bg-light-text-main dark:hover:bg-dark-text-main dark:hover:border-dark-text-main hover:border-light-text-main dark:hover:text-dark-bg-main hover:text-light-bg-main"
                    onClick={() => {
                      setOpenProfile(false)
                      logoutAction(true)
                    }}   
                    >
                    <div className="border rounded-xl flex items-center justify-center w-12 h-12">
                      <FontAwesomeIcon icon={faArrowRightFromBracket} className="text-2xl"/>
                    </div>
                    <p className="mt-1 text-sm">Log out</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <PopupLogout openLogout={logout} setOpenLogout={logoutAction} />
        </div>
      </div>
      )}
    </nav>
  );
}
'use client'

import { checkAuthStatus } from "@/lib/session";
import { useState, useEffect, useActionState } from "react";
import { DeleteAccount } from "../action";
import PopUp from "@/components/ui/popup";
import CloseBtn from "@/components/ui/close_button";

export default function SettingsPage() { 
  const [currentTheme, setCurrentTheme] = useState("dark");
  const [openDeleteAccount, setOpenDeleteAccount] = useState(false)

  useEffect(() => {
    const verify = async () => {
      const isAuthenticated = await checkAuthStatus();
      if (!isAuthenticated) {
        window.location.href = "/";
      }
    };
    verify();
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setCurrentTheme(savedTheme);
  }, []);

  const changeTheme = (newTheme) => {
    localStorage.setItem("theme", newTheme);
    setCurrentTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <main className="min-h-160 w-full p-7 bg-bg-second">
      <div className="space-y-8">
        <header className="mb-10 border-b border-border-color pb-6">
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
        </header>

        <section>
          <div className="p-6 flex flex-row items-center justify-between gap-4">
            <h2 className="text-lg font-semibold mb-4">Appearance</h2>
            <div className="flex gap-4">
              {['dark', 'light'].map((t) => (
                <button
                  key={t}
                  onClick={() => changeTheme(t)}
                  className={`btnStyle ${
                    currentTheme === t 
                    ? 'border-btn-bg! bg-btn-bg/10! text-btn-bg!' 
                    : 'border-border-color! bg-bg-main! text-text-second! hover:border-text-second!'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 bg-red-500/5 flex flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-red-500">Danger Zone</h2>
              <p className="text-sm text-text-second mt-1">
                Once you delete your account, there is no going back. Please be certain.
              </p>
            </div>
            <button
              onClick={() => setOpenDeleteAccount(true)}
              className="btnStyle bg-red-500! hover:bg-red-600!"
            >
              Delete Account
            </button>
          </div>
        </section>
      </div>
      <DeleteAccountPopUp openDeleteAccount={openDeleteAccount} setOpenDeleteAccount={setOpenDeleteAccount} />
    </main>
  );
}

function DeleteAccountPopUp({openDeleteAccount, setOpenDeleteAccount}) {
  const [state, formAction] = useActionState(DeleteAccount)
  useEffect(()=>{
    console.log(state)
  },[state])
  return (
    <PopUp openPopup={openDeleteAccount}>
      <div className="w-full h-full flex items-end flex-col">
        <CloseBtn close={() => setOpenDeleteAccount(false)}/>
        <form  
          className="flex flex-col items-center w-full h-full mb-4" 
          action={formAction}
        >
          <legend className="text-4xl mb-4 text-red-500">Delete Account</legend>
          <p className="text-center mb-6">Are you sure you want to delete your account</p>
          <button 
            type="submit" 
            className="btnStyle bg-red-500!"
          >
            Delete Account
          </button>
        </form>
      </div>
    </PopUp>
  )
}
'use client'

import PopUp from "../../ui/popup"
import { LogoutAction } from "./action"
import CloseBtn from "./components/close_button"

export default function PopupLogout({openLogout, setOpenLogout}) {
  return (
    <PopUp openPopup={openLogout} width="400px">
      {(
        <div className="w-full h-full flex items-end flex-col">
          <CloseBtn close={() => setOpenLogout(false)}/>
          <form  
            className="flex flex-col items-center w-full h-full mb-4" 
            action={LogoutAction}
          >
            <legend className="text-5xl mb-6">Logout</legend>
            <p className="text-center mb-6">Are you sure you want to logout?</p>
            <button 
              onClick={() => setOpenLogout(false)}
              type="submit" 
              className="w-32 h-10 rounded-2xl bg-red-600 text-white hover:bg-red-700 cursor-pointer"
            >
              Logout
            </button>
          </form>
        </div>
      )}
    </PopUp>
  )
}
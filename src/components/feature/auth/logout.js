'use client'

import PopUp from "../../ui/popup"
import { LogoutAction } from "./action"
import CloseBtn from "../../ui/close_button"

export default function PopupLogout({openLogout, setOpenLogout}) {
  return (
    <PopUp openPopup={openLogout} width="400px">
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
            className="btnStyle bg-red-500!"
          >
            Logout
          </button>
        </form>
      </div>
    </PopUp>
  )
}
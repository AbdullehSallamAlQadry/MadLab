'use client'

import Popup from "reactjs-popup"
import { LogoutAction } from "./action"
import 'reactjs-popup/dist/index.css'

export default function PopupLogout({openLogout, setOpenLogout}) {
  return (
    <Popup
      modal 
      open={openLogout}
      closeOnDocumentClick={false} 
      position="right center"
      overlayStyle={{
        background: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(3px)"
      }}
      contentStyle={{
        borderRadius: "20px", 
        background: "#191919", 
        width: "400px", 
        height: "240px", 
        border:"none", 
        boxShadow:"0px 0px 10px #D9D9D9"
      }}
      >
      {(
        <div className="w-full h-full flex items-end flex-col">
          <button 
            className="mr-2 mt-2 px-2 text-lg cursor-pointer rounded-lg dark:text-dark-btn-text dark:bg-dark-btn-bg dark:hover:bg-dark-btn-bg/80 text-light-btn-text bg-light-btn-bg hover:bg-light-btn-bg/80" 
            onClick={() => setOpenLogout(false)}>
              &times;
          </button>
          <form  
            className="flex flex-col items-center w-full h-full" 
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
    </Popup>
  )
}
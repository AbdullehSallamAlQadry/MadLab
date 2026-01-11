'use client'

import { useActionState, useEffect } from "react"
import { loginAction } from "./action"
import SubmitButton from "./components/submit_button"
import InputContainer from "./components/input_container"
import PasswordContainer from "./components/password_container"
import PopUp from "../popup"

export default function PopupLogin({openLogin, setOpenRegister, close}) {
  const [state, formAction] = useActionState(loginAction || null); 

  useEffect(() => {
    if(state)
      console.log(state)
  },[state])

  

  return (
      <PopUp openPopup={openLogin} height="410px">
        {(
          <div className="w-full h-full flex items-end flex-col">
            <button 
              className="mr-2 mt-2 px-2 text-lg cursor-pointer rounded-lg text-btn-text bg-btn-bg hover:bg-btn-bg/80" 
              onClick={() => close()}>
                &times;
            </button> 

            <form  
              className="flex flex-col items-center w-full h-full" 
              action={formAction}  
            >
              <legend className="text-5xl mb-6">Login</legend>
              
              <InputContainer name="email" placeholder="Email" type="email" error={state?.error?.email} />
              <PasswordContainer name="password" placeholder="Password" type="password" error={state?.error?.password} />
              
              {/* add functionality for the two down */}
              <div className="w-full flex flex-row justify-center gap-10 mb-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="remember"
                    className="peer hidden"
                  />
                  <span className="w-4 h-4 mr-2 rounded border border-border-color peer-checked:bg-text-main"></span>
                  <span className="text-text-second hover:text-text-second/80 underline">
                    Remember me
                  </span>
                </label>
                <button type="button" className="text-text-second hover:text-text-second/80 underline cursor-pointer">
                  Forgot Password?
                </button>                
              </div>
              <div className="relative w-full mb-5 mt-1 grid place-items-center">
                {state?.error?.message && <p className="text-red-500 text-xs pl-3 absolute">{state.error.message}</p>}
              </div>
              <SubmitButton name={'Login'}/>
 
              <button 
                type="button"
                className="mt-4 text-text-second hover:text-text-second/80 underline cursor-pointer" 
                onClick={() => setOpenRegister() }
              >
                Don&apos;t have an account? Sign Up
                </button>
            </form>
          </div>
        )}
      </PopUp>
  )
}
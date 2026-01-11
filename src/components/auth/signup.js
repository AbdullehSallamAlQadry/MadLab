'use client'
import Popup from "reactjs-popup"
import { useActionState } from "react"
import { signupAction } from "./action"
import PasswordContainer from "./components/password_container"
import InputContainer from "./components/input_container"
import SubmitButton from "./components/submit_button"
import PopUp from "../popup"

export default function PopupSignup({openRegister, setOpenLogin, close}) {
  const [state, formAction] = useActionState(signupAction);

  if (state?.success) {
    return (
      <PopUp openPopup={openRegister} height="350px">
        <div className="text-center flex flex-col items-center justify-center gap-6 h-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
             <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
             </svg>
          </div>
          <h2 className="text-3xl font-bold">Registration Sent!</h2>
          <p className="text-text-second w-11/12">
            Your account has been created successfully. Please wait until the 
            <span className="font-bold text-text-main"> Admin </span> 
            validates your professional license. You will receive an email once approved.
          </p>
          <button 
            className="bg-btn-bg text-btn-text px-8 py-2 rounded-xl hover:bg-btn-bg/80 transition-all"
            onClick={() => close()}
          >
            Got it
          </button>
        </div>
      </PopUp>
    );
  }

  return (
      <PopUp openPopup={openRegister} height="660px">
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
              <legend className="text-5xl mb-6">Sign up</legend>

              <InputContainer name="name" placeholder="Name" type="text" error={state?.error?.name} />
              <InputContainer name="username" placeholder="Username" type="text" error={state?.error?.username} />
              <InputContainer name="specialization" placeholder="Specialization" type="text" error={state?.error?.specialization} />
              <InputContainer name="email" placeholder="Email" type="email" error={state?.error?.email} />
              <PasswordContainer name="password" placeholder="Password" type="password" error={state?.error?.password} />
              <PasswordContainer name="confirmPassword" placeholder="Confirm Password" type="password" error={state?.error?.confirmPassword} />

              <div>
                <div className="w-full flex flex-row justify-center gap-3">
                  <p>Upload your professional license</p>
                  <label>
                    <input 
                      type='file' 
                      className="peer hidden" 
                      accept="image/*" 
                      name="licence"
                    />
                    <span className="bg-btn-bg text-btn-text hover:bg-btn-bg/80 text-s px-5 py-3 rounded-2xl cursor-pointer">
                      Uplaod
                    </span>
                  </label>
                </div>
                <div className="w-full mb-5 mt-1">
                  {state?.error?.licence && (<p className="text-red-500 text-xs pl-6 absolute">{state.error.licence}</p>)}
                </div>
              </div>
              <div className="relative w-full h-5">
                {state?.message && (<p className="text-red-500 w-full text-center absolute">{state.message}</p>)}
              </div>
              <SubmitButton name="Sign up"/>
              <button 
                className="mt-4 text-text-second underline cursor-pointer" 
                onClick={() => { setOpenLogin() }}
              >
                have an account? Login
                </button>
            </form>
          </div>
        )}
      </PopUp>
  )
}
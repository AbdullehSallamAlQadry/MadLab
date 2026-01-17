'use client'

import { useActionState, useEffect, useState } from "react"
import { loginAction, verifyAction, resendAction, forgotPasswordAction } from "./action"
import SubmitButton from "./components/submit_button"
import InputContainer from "./components/input_container"
import PasswordContainer from "./components/password_container"
import PopUp from "../../ui/popup"
import { StatusMessage } from "./components/StatusMessage"
import CloseBtn from "./components/close_button"

export default function PopupLogin({openLogin, setOpenRegister, close}) {
  const [state, formAction] = useActionState(loginAction || null); 
  const [forgotState, forgotFormAction] = useActionState(forgotPasswordAction || null);
  const [showForgetPW, setShowForgetPW] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    console.log(state?.data);
  },[state?.data])

  let content;

  if(showLogin) {
    const getLoginContent = () => (
      <div className="w-full h-full flex items-end flex-col">
        <CloseBtn close={() => close()} />
        <form  
          className="flex flex-col items-center w-full h-full mb-4" 
          action={formAction}  
        >
          <h1 className="text-5xl mb-6">Login</h1>
          
          <InputContainer name="email" placeholder="email" type="email" error={state?.error?.email} defaultValue={state?.fields?.email || ''} />
          <PasswordContainer name="password" placeholder="Password" error={state?.error?.password} defaultValue={state?.fields?.password || ''} />
          
          <div className="relative w-full mb-5 mt-1 grid place-items-center">
            {state?.error?.message && <p className="text-red-500 text-xs absolute capitalize">{state.error.message}</p>}
          </div>
          
          <SubmitButton name={'Login'}/>
          
          <div className="w-full flex flex-row justify-center gap-10 mb-1 mt-3">
            <button 
              type="button" 
              className="link-button"
              onClick={() => {setShowForgetPW(true); setShowLogin(false)}}  
            >
              Forgot Password?
            </button>  
            <button 
              type="button"
              className="link-button" 
              onClick={() => setOpenRegister() }
            >
              Sign Up
            </button>              
          </div>
        </form>
      </div>
    );

    content = getLoginContent();
  }
  else if(showForgetPW) {
    content = (<div className="w-full h-full flex items-end flex-col">
      <CloseBtn close={() => close()} />
      <form action={forgotFormAction} className="flex flex-col items-center w-full h-full mb-4">
        <h1 className="text-4xl mb-6">Forgot Password</h1>
        <InputContainer name="email" placeholder="Email" type="email" error={forgotState?.error?.email} defaultValue={forgotState?.fields?.email || ''} />
        <div className="relative w-full mb-5 mt-1 grid place-items-center">
          {forgotState?.error?.message && <p className="text-red-500 text-xs absolute capitalize">{forgotState.error.message}</p>}
          {forgotState?.success && <p className="text-green-500 text-xs absolute capitalize">Password reset link sent to your email!</p>}
        </div>
        <SubmitButton name={'Reset Password'}/>
        <button 
          type="button"
          className="mt-4 link-button" 
          onClick={() => {setShowForgetPW(false); setShowLogin(true)}}
        >
          Back to Login
        </button>
      </form>
    </div>);
  }
  
  if (state?.state === 'SUSPENDED') {
    content = (<StatusMessage 
      title="Account Suspended"
      colorClass="bg-red-100 dark:bg-red-950/30 border-red-500 text-red-500"
      message="Your account has been suspended due to a violation of our terms. Please contact support."
      onClose={close}
      icon = {
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
        </svg>
      }
    />
  )}
  else if (state?.state === 'PENDING') {
    content = (<StatusMessage 
      title="Account Under Review"
      colorClass="bg-amber-100 dark:bg-amber-950/30 border-amber-500 text-amber-500"
      message="We are verifying your details. You'll receive an email once approved."
      onClose={close}
      icon={
        <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      }
    />
  )}
  else if(state?.state === 'NOT_VERIFIED') {
    content=( <StatusMessage 
      title="Verify Your Email"
      colorClass="bg-blue-100 dark:bg-blue-950/10 border-blue-500 text-blue-500"
      message="We've sent a verification link to your email address. Please check your inbox (and spam folder) and click the link to activate your account."
      onClose={close}
      icon={
        <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      }
    />
  )}

  return (
    <PopUp openPopup={openLogin} width="400px">
      {content}
    </PopUp>
  )
}
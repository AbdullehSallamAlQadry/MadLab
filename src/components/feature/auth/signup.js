'use client'

import { useActionState, useEffect, useState } from "react"
import { signupAction } from "./action"
import PasswordContainer from "./components/password_container"
import InputContainer from "./components/input_container"
import SubmitButton from "./components/submit_button"
import PopUp from "../../ui/popup"
import { StatusMessage } from "./components/StatusMessage"
import CloseBtn from "./components/close_button"

export default function PopupSignup({openRegister, setOpenLogin, close}) {
  const [state, formAction] = useActionState(signupAction);
  const [fileName, setFileName] = useState("");
  const [hideError, setHideError] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name); 
      setHideError(true);
    }
  };

  useEffect(() => {
    setHideError(false);
    setFileName("");
  }, [state]);

  let context;

  if (state?.success) {
    context = (
      <StatusMessage 
        title="Registration Sent!"
        colorClass="bg-green-50 dark:bg-green-950/30 dark:border-green-100 border-green-900/30 text-green-500"
        message="Your account has been created successfully. Please wait until the Admin validates your professional license. You will receive an email once approved."
        onClose={close}
        icon = {
          <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        }
      />
    )
  } else {
    context = (<div className="w-full h-full flex items-end flex-col">
      <CloseBtn close={() => close()} />

      <form  
        className="flex flex-col items-center w-full h-full mb-4" 
        action={formAction}  
      >
        <legend className="text-5xl mb-6">Sign up</legend>

        <InputContainer name="name" placeholder="Name" type="text" error={state?.error?.name} defaultValue={state?.fields?.name || ''} />
        <InputContainer name="username" placeholder="Username" type="text" error={state?.error?.username} defaultValue={state?.fields?.username || ''} />
        <InputContainer name="specialization" placeholder="Specialization" type="text" error={state?.error?.specialization} defaultValue={state?.fields?.specialization || ''} />
        <InputContainer name="email" placeholder="Email" type="text" error={state?.error?.email} defaultValue={state?.fields?.email || ''} />
        <PasswordContainer name="password" placeholder="Password" error={state?.error?.password} defaultValue={state?.fields?.password || ''} />
        <PasswordContainer name="confirmPassword" placeholder="Confirm Password" error={state?.error?.confirmPassword} defaultValue={state?.fields?.confirmPassword || ''} />

        <div>
          <div className="w-full flex flex-row justify-center items-center gap-3">
            <p>Upload your professional license</p>
            <label>
              <input 
                type='file' 
                className="peer hidden" 
                accept="image/*" 
                name="license_image"
                onChange={handleFileChange}
                defaultValue={state?.fields?.license_image}
              />
              <span className={`${fileName ? 'bg-green-500' : 'bg-btn-bg'} inline-block w-30 text-btn-text hover:opacity-80 text-s text-center py-3 rounded-2xl cursor-pointer`}>
                {fileName ? "File Selected" : "Upload"}
              </span>
            </label>
          </div>
          <div className="w-full mb-5 mt-1">
            {!hideError && state?.error?.license_image && (<p className="text-red-500 text-xs absolute capitalize">{state.error.license_image}</p>)}
            {fileName && (<p className="text-green-600 text-xs absolute capitalize">Selected: {fileName}</p>)}
          </div>
        </div>
        <div className="relative w-full h-7">
          {state?.message && (<p className="text-red-500 w-full text-center absolute">{state.message}</p>)}
        </div>
        <SubmitButton name="Sign up"/>
        <button 
          className="mt-4 link-button" 
          onClick={() => { setOpenLogin() }}
        >
          have an account? Login
          </button>
      </form>
    </div>
    )
  }

  return (
    <PopUp openPopup={openRegister}>
      {context}
    </PopUp>
  )
}
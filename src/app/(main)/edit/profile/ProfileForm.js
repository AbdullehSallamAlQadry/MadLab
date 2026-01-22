'use client'

import { useActionState, useState, useRef, useEffect } from "react";
import { updateFullProfileAction, resetPasswordAction } from "../action";
import SubmitButton from "@/components/ui/submit_button";
import toastPlay from "@/components/ui/toast";
import { checkAuthStatus } from "@/components/session";

export default function ProfileForm({ doctor }) {
   useEffect(() => {
    const verify = async () => {
      const isAuthenticated = await checkAuthStatus();
      if (!isAuthenticated) {
        window.location.href = "/";
      }
    };
    verify();
  }, []);

  const [change, setChange] = useState(false)
  const [state, formAction] = useActionState(updateFullProfileAction, null);
  const [FPstate, FPformAction, isFPPending] = useActionState(resetPasswordAction, null);
  const [preview, setPreview] = useState(state?.fields?.profile_picture || doctor?.profile_picture);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (state?.success) { toastPlay(state.message, "success"); setChange(false); }
    if (state?.error?.detail ) toastPlay(state.error.detail, "error");
  }, [state]);

  useEffect(() => {
    if (FPstate?.success) toastPlay(FPstate.message, "success");
    if (FPstate?.error) toastPlay(FPstate.error.detail, "error");
  }, [FPstate]);

  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setChange(true);
    }
  };

  const handleDeleteTrigger = () => {
    setPreview(null);   
    setChange(true);        
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
  };

  return (
    <>
      <form id="password-form" action={FPformAction}></form>
      <form action={formAction} className="grid grid-cols-5 place-items-center gap-10">
        <div className="flex flex-col items-center space-y-4 col-span-2">
          <div className="relative w-40 h-40">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-bg-second bg-gray-100 flex items-center justify-center text-5xl text-gray-600">
              {preview ? (
                <img src={preview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span>{(state?.fields?.name || doctor?.name)?.charAt(0)}</span>
              )}
            </div>
          </div>
          <div className="flex gap-5">
            <button 
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="btnStyle w-35!"
            >Change</button>
            <button 
              type="button"
              onClick={handleDeleteTrigger}
              className="btnStyle w-35! bg-red-500!"
            >Delete</button>
          </div>

          <input 
            type="file" 
            name="profile_picture" 
            ref={fileInputRef} 
            hidden 
            accept="image/*" 
            onChange={handleImagePreview}
          />

          <div className="bg-bg-main p-6 rounded-2xl border border-border-color w-full text-center">
            <p className="text-sm text-text-second uppercase font-semibold mb-1">Available Credits</p>
            <p className="text-3xl font-bold text-btn-bg">{doctor?.credits}</p>
          </div>
        </div>

        <div className="w-full col-span-3 space-y-3">
          <InputFeild feild={state?.fields?.name || doctor?.name} name={"name"} onChange={setChange} error={state?.error?.name}/>
          <InputFeild feild={state?.fields?.username || doctor?.username} name={"username"} onChange={setChange} error={state?.error?.username}/>
          <InputFeild feild={state?.fields?.specialization || doctor?.specialization} name={"specialization"} onChange={setChange} error={state?.error?.specialization}/>
          <div className="pt-4 flex justify-start gap-2">
              <SubmitButton name="Save All Changes" className="w-full md:w-52" disabled={!change} />
              <SubmitPWButton name="Reset Password" form="password-form" isPending={isFPPending}/>
            </div>
        </div>
      </form>
    </>
  );
}

function SubmitPWButton({name, disabled = false, className, form, isPending}) {
  return (
    <button
      type="submit"
      disabled={isPending || disabled}
      className={`btnStyle ${className}`}
      form={form}
    >
      {isPending ? <div className="grid place-items-center"><div className="loader"></div></div> : name}
    </button>
  );
}

function InputFeild({feild, name, onChange, error}) {
  return (
    <div className="relative">
      <label className="text-sm font-medium capitalize">{name}</label>
      <input 
        onChange={() => onChange(true)}
        name={name}
        defaultValue={feild}
        placeholder={name}
        className={`w-full p-4 bg-bg-second border ${error ? 'border-red-500' : 'border-border-color'} rounded-xl focus:ring-2 focus:ring-btn-bg/30 outline-none`}
      />
      <div className="w-full mb-5">
        {error && <p className="text-red-500 text-xs pl-3 absolute">{error}</p>}
      </div>
    </div>
  )
}
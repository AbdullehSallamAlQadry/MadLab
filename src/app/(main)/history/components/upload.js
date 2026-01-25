import SubmitButton from "@/components/ui/submit_button";
import CloseBtn from "@/components/ui/close_button";
import PopUp from "@/components/ui/popup";
import { useActionState, useEffect, useState } from "react";
import { sendFinalFile } from "../action";

export default function Upload({openUpload, closeUpload, id, setBiopsyId}) {
  const [state, formAction] = useActionState(sendFinalFile);
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
  if (!state?.ok) {
    setFileName("");
    setHideError(false);
  } else {
    console.log(state?.biopsy_id);
    // on success: close popup and refresh the page so updated biopsy id/status is loaded
    setBiopsyId(state.biopsy_id);
    closeUpload();
  }
}, [state, closeUpload]);

  const options = ["Benign", "Precancerous", "Malignant"];
  return(
    <PopUp openPopup={openUpload} width="500px">
      <div className="p-3 flex flex-col items-end ">
        <CloseBtn close={closeUpload} className="m-0!"/>
        <form className="w-full flex flex-col gap-3" action={formAction}>
          <div>
            <div className="w-full flex flex-row justify-between mt-3 items-center gap-3">
              <p className="text-text-second">Upload your professional license</p>
              <label>
                <input 
                  type='file' 
                  className="peer hidden" 
                  accept="file/*" 
                  name="document"
                  onChange={handleFileChange}
                  defaultValue={state?.fields?.document}
                />
                <span className={`${fileName ? 'bg-green-500' : 'bg-btn-bg'} inline-block w-30 text-btn-text hover:opacity-80 text-s text-center py-3 rounded-2xl cursor-pointer`}>
                  {fileName ? "File Selected" : "Upload"}
                </span>
              </label>
            </div>
            <div className="w-full mb-5 mt-1">
              {!hideError && state?.error?.document && (<p className="text-red-500 text-xs absolute capitalize">{state.error.document}</p>)}
              {fileName && (<p className="text-green-600 text-xs absolute capitalize">Selected: {fileName}</p>)}
            </div>
          </div>
          <div>
            <label className="text-text-second">
              What is the test result?
            </label>
            <div className="w-full flex justify-center"> 
              <div className="flex w-fit justify-center items-center mt-2 border border-border-color rounded-md">
                {options.map((opt, i) => (
                  <label key={opt} className="cursor-pointer">
                    <input type="radio" name="result" className="peer sr-only" value={opt}/>
                    <span className={`
                      block w-37 px-4 py-2 text-center text-text-second bg-bg-second transition-all duration-50 ease-in-out
                      ${i === 0 ? 'rounded-l-md' : ''} 
                      ${i !== options.length - 1 ? 'border-r border-border-color' : ''} 
                      ${i === options.length - 1 ? 'rounded-r-md' : ''}
                      peer-checked:bg-text-main peer-checked:text-bg-main
                    `}>
                      {opt}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="relative w-full mb-3 grid">
            {state?.error?.result && <p className="text-red-500 text-xs absolute capitalize">{state.error.result}</p>}
          </div>
          <input className="peer hidden" value={id} name="checkup_id" readOnly/>
          <div className="relative w-full mb-3 grid place-items-center">
            {state?.error?.general && <p className="text-red-500 text-xs absolute capitalize">{state.error.general}</p>}
          </div>
          <div className="w-full flex justify-center">
            <SubmitButton name={"Upload Results"}/>
          </div>
        </form>
      </div>
    </PopUp>
  )
}
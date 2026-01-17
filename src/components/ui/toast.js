import toast from "react-hot-toast";

export default function toastPlay(text, state = "success") {
  const isSuccess = state === "success";

  return toast.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } max-w-md min-w-2xs bg-bg-main border border-border-color shadow-lg rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isSuccess ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
               {isSuccess ? (
                 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                 </svg>
               ) : (
                 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                 </svg>
               )}
            </div>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-text-main capitalize">
              {isSuccess ? "Success" : "Error"}
            </p>
            <p className="mt-1 text-sm text-text-second">
              {text}
            </p>
          </div>
        </div>
      </div>
    </div>
  ));
}
export default function CloseBtn({close}) {
  return (
    <button 
      className="mr-2 mt-2 px-2 text-lg cursor-pointer rounded-lg text-btn-text bg-btn-bg hover:bg-btn-bg/85" 
      onClick={() => close()}>
        &times;
    </button> 
  )
} 
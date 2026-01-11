export default function InputContainer({name, placeholder, type, error, children}) {
  return (
    <div className="relative h-fit"> 
      <input  
        className={`border w-77.25 h-10 p-3 rounded-2xl bg-transparent focus:outline-none ${error ? 'border-red-500' : 'border-border-color'} text-text-main placeholder:text-text-second`} 
        placeholder={placeholder} 
        type={type} 
        name={name}
      />
      {children}
      <div className="w-full mb-5 mt-1">
        {error && <p className="text-red-500 text-xs pl-3 absolute">{error}</p>}
      </div>
    </div>  
  )
}
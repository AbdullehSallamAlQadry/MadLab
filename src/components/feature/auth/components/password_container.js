import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import InputContainer from "./input_container"

export default function PasswordContainer({name, placeholder, error, defaultValue}) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <InputContainer 
      name={name} 
      placeholder={placeholder}
      type={showPassword ? "text" : "password"} 
      error={error}
      defaultValue={defaultValue}
    >
      <FontAwesomeIcon 
        icon={showPassword ? faEyeSlash : faEye} 
        className="absolute right-4 top-3 cursor-pointer text-text-second"
        onMouseDown={() => setShowPassword(showPassword)}  
        onMouseUp={() => setShowPassword(!showPassword)}  
      />
    </InputContainer>
  )
}
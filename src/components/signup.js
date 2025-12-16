'use client'
import Popup from "reactjs-popup"
import { useState } from "react"
import 'reactjs-popup/dist/index.css'

export default function PopupSignup({openRegister, setOpenLogin, setOpenRegister}) {
  const [name, setName] = useState('')
  const [nameStyle, setNameStyle] = useState('')
  const [nameError, setNameError] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [specializationStyle, setSpecializationStyle] = useState('')
  const [specializationError, setSpecializationError] = useState('')
  const [email, setEmail] = useState('')
  const [emailStyle, setEmailStyle] = useState('')
  const [emailError, setEmailError] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordStyle, setPasswordStyle] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [license, setLicense] = useState(null)
  const [licensestyle, setLicenseStyle] = useState('')
  const [licenseError, setLicenseError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    try{
      if(name === '') {
        throw new Error('name', 'The name should not be empty')
      }
      if (specialization === '') {
        throw new Error('specialization', 'The specialization should not be empty')
      }
      if (password !== confirmPassword) {
        throw new Error('password', 'the password is not the same')
      }
      if (license === ''){
        throw new Error('licence', )
      }

      const formData = {
        name,
        specialization,
        email,
        password,
        license,
      }
      console.log("Signup data:", formData)
      }
    catch(err) {
      console.log(err)
    }
  }

  const InputStyle = "border w-[309px] h-10 p-3 rounded-2xl"
  const ErrorStyle = "mr-65 text-red-500 h-7"

  return (
    <Popup 
      modal 
      open={openRegister}
      closeOnDocumentClick={false}
      position="right center"
      className="my-signup-popup"
      overlayStyle={{}}
      contentStyle={{
        borderRadius: "20px",
        background: "#191919",
        width: "400px",
        height: "620px",
        border: "none",
        boxShadow: "0px 0px 10px #D9D9D9"
      }}
    >
      <div className="w-full h-full flex items-end flex-col">
        <button
          className="mr-2 mt-2 px-2 cursor-pointer text-[#191919] bg-[#D9D9D9] rounded-lg dark:hover:bg-[#D9D9D9]/80"
          onClick={() => setOpenRegister(false)}
        >
          &times;
        </button>
        <form className="flex flex-col items-center w-full h-full"  onSubmit={(e) => e.preventDefault()}>
          <legend className="text-5xl mb-6"> Sign up </legend>
          <input 
            value={name}
            className={InputStyle}
            placeholder="Full Name"
            type="text"
            onChange={e => setName(e.target.value)}
            required
          />
          <p className={ErrorStyle}>{nameError}</p>
          <input 
            value={specialization}
            className={InputStyle}
            placeholder="Specialization"
            type="text"
            onChange={e => setSpecialization(e.target.value)}
            required
          />
          <p className={ErrorStyle}>{specializationError}</p>
          <input 
            value={email}
            className={InputStyle}
            placeholder="Email"
            type="email"
            onChange={e => setEmail(e.target.value)}
            required
          />
          <p className={ErrorStyle}>{emailError}</p>
          <input 
            value={password}
            className={`${InputStyle} mb-7`}
            placeholder="Password"
            type="password"
            onChange={e => setPassword(e.target.value)}
            required
          />
          <input 
            value={confirmPassword}
            className={InputStyle}
            placeholder="Confirm Password"
            type="password"
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
          <p className={ErrorStyle}>{passwordError}</p>
          <div className="w-full flex flex-row justify-center gap-3 mb-6 mt-1">
            <p>Upload your professional license</p>
            <label>
              <input 
                type='file' 
                className="peer hidden" 
                accept="image/*" 
                onChange={(e) => setLicense(e.target.files[0])}
                required
              />
              <span className="dark:bg-[#D9D9D9] dark:text-[#191919] text-s px-5 py-3 rounded-2xl dark:hover:bg-[#D9D9D9]/80 cursor-pointer">
                Uplaod
              </span>
            </label>
          </div>
          <button
            className="dark:bg-[#D9D9D9] dark:text-[#191919] text-xl px-15 py-3 rounded-2xl dark:hover:bg-[#D9D9D9]/80 cursor-pointer"
            type="submit"
          >
            Sign up
          </button>
          <button
            className="mt-4 dark:text-[#D9D9D9] underline cursor-pointer"
            onClick={() => {
              setOpenLogin(true)
              setOpenRegister(false)
            }}
          >
            Already have an account? Login
          </button>
        </form>
      </div>
    </Popup>
  )
}
'use client'
import Popup from "reactjs-popup"
import { useState } from "react"
import 'reactjs-popup/dist/index.css'

export default function PopupLogin({openLogin, setOpenLogin, setOpenRegister}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  return (
      <Popup
        modal 
        open={openLogin}
        closeOnDocumentClick={false} 
        position="right center"
        overlayStyle={{}}
        contentStyle={{borderRadius: "20px", background: "#191919", width: "400px", height: "440px", border:"none", boxShadow:"0px 0px 10px #D9D9D9"}}
        >
        {(
          <div className="w-full h-full flex items-end flex-col">
            <button 
              className="mr-2 mt-2 px-2 cursor-pointer text-[#191919] bg-[#D9D9D9] rounded-lg dark:hover:bg-[#D9D9D9]/80" 
              onClick={() => setOpenLogin(false)}>
                &times;
            </button>
            <form 
              className="flex flex-col pt-6 items-center w-full h-full"  
              onSubmit={(e) => e.preventDefault()}
            >
              <legend className="text-5xl mb-6"> 
                Login 
              </legend>
              <input 
                value={email} 
                className="border w-[309] h-10 p-3 rounded-2xl mb-6" 
                placeholder="Email" 
                type="email" 
                onChange={e => setEmail(e.target.value)}
              />
              <input 
                value={password} 
                className="border w-[309] h-10 p-3 rounded-2xl mb-6" 
                placeholder="Password" 
                type="password" 
                onChange={e => setPassword(e.target.value)}
              />
              <div className="w-full flex flex-row justify-center gap-10 mb-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="remember"
                    className="peer hidden"
                  />
                  <span className="w-4 h-4 mr-2 rounded border border-gray-400 peer-checked:bg-[#D9D9D9]"></span>
                  <span className="dark:text-[#D9D9D9] underline">
                    Remember me
                  </span>
                </label>
                <button className="dark:text-[#D9D9D9] underline">
                  Forgot Password?
                </button>                
              </div>
              <button 
                className="dark:bg-[#D9D9D9] dark:text-[#191919] text-xl px-15 py-3 rounded-2xl dark:hover:bg-[#D9D9D9]/80 cursor-pointer" 
                type="submit" 
                onClick={() => {}}
              >
                Login
              </button>
              <button 
                className="mt-4 dark:text-[#D9D9D9] underline cursor-pointer" 
                onClick={() => { setOpenRegister(true); setOpenLogin(false); }}
              >
                Don&apos;t have an account? Sign Up
                </button>
            </form>
          </div>
        )}
      </Popup>
  )
}
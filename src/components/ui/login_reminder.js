'use client'

import PopUp from "./popup";
import { useAuth } from "@/context/AuthContext";

export default function LoginReminder() {
  const { showLoginReminder, closeLoginReminder } = useAuth();

  return (
    <PopUp openPopup={showLoginReminder}>
      <div className="gap-2 flex flex-col p-4">
        <h2 className="text-2xl font-bold mb-2 w-full text-center">Clinical Reminder</h2>
        <p className="mb-4 leading-relaxed text-justify text-text-second">
          MedMind is an assistive AI tool. Use this report as a second opinion — clinical judgment and standard diagnostic procedures should always guide patient care.
        </p>
        <div className="flex justify-center">
          <button onClick={closeLoginReminder} className="btnStyle">I Understand</button>
        </div>
      </div>
    </PopUp>
  )
}

'use client'

import { useActionState, useEffect, useState } from "react";
import SubmitButton from "@/components/ui/submit_button";
import { purchaseCreditsAction } from "./action";
import toastPlay from "@/components/ui/toast";
import { checkAuthStatus } from "@/lib/session";

export default function Bills() {
  const [state, formAction] = useActionState(purchaseCreditsAction, null);
  const [UUID, setUUID] = useState(crypto.randomUUID());

  useEffect(() => {
    const verify = async () => {
      const isAuthenticated = await checkAuthStatus();
      if (!isAuthenticated) {
        window.location.href = "/";
      }
    };
    verify();
  }, []);

  useEffect(() => {
    console.log(UUID)
    if (state?.success) {
      toastPlay(state.message, "success");
    } else if (state?.error) {
      toastPlay(state.error, "failed");
    }
  }, [state]);

  const credits = [
    { id: "starter-plan", header: "Starter", credits: 5000, price: 20, benefits: ["50 AI Diagnostics", "Basic Support", "Lifetime Validity"], special: null, bundle: "SMALL" },
    { id: "professional-plan", header: "Professional", credits: 10000, price: 35, benefits: ["100 AI Diagnostics", "Access better models", "Priority Support", "Life-time valid"], special: "Most Popular", bundle: "MEDIUM" },
    { id: "enterprise-plan", header: "Enterprise", credits: 20000, price: 60, benefits: ["200 AI Diagnostics", "Access The Best models", "24/7 Premium Support", "Life-time valid"], special: "The Best", bundle: "LARGE" },
  ];

  return (
    <main className="bg-bg-second flex flex-col min-w-screen min-h-screen justify-center items-center rounded-t-4xl p-10">
      <h1 className="text-4xl mb-3">Purchase Credits</h1>
      <p className="text-text-second text-xl">Choose the perfect bundle for your needs</p>
      <div className="flex flex-wrap justify-center gap-x-20 gap-y-10 w-8/12 mx-auto mt-2 p-10">
        {
          credits.map((credit) => (
            <div key={credit.id} className="flex items-center justify-center flex-col w-60 h-100 bg-bg-main relative py-6 px-4 border border-border-color rounded-xl capitalize hover:scale-102 transition-all"> 
              {credit.special && <p className="bg-btn-bg text-btn-text absolute py-1 px-3 -top-3 rounded-xl text-xs font-semibold">{credit.special}</p>}
              <h1 className="text-3xl mb-5">{credit.header}</h1>
              <p className="text-text-second text-lg">credit</p>
              <p className="text-3xl">{credit.credits.toLocaleString('en-US')}</p>
              <p className="text-3xl">${credit.price.toLocaleString('en-US')} <span className="uppercase text-text-second text-lg">usd</span></p>
              <ul className="mt-4 h-27 flex flex-col justify-around items-start mb-4">
                {credit.benefits.map((benefit, index) => (
                  <li key={index} className="text-sm flex items-center"><span className="mr-2">✓</span>{benefit}</li>
                ))}
              </ul>
              <form action={formAction}>
                <input type="text" value={credit.bundle} name="bundle" hidden readOnly/>
                <input type="text" value={UUID} name="UUID" hidden readOnly/>
                <SubmitButton 
                  name={"Purchase Now"} 
                  className={"rounded-full!  w-50!"}
                />
              </form>
            </div>
          ))
        }
      </div>
    </main>
  )
}
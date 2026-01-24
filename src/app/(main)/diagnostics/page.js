'use client'

import Image from "next/image";
import Link from "next/link";
import diagnosticsItems from "./diagnostics.json";
import { useAuth } from "@/context/AuthContext";
import { fetchDoctor } from "@/lib/authToken";
import { useState, useEffect } from "react";


export default function Diagnostics() {
  const [doctor, setDoctor] = useState(null);
  
  useEffect(() => {
    fetchDoctor().then(setDoctor);
  }, []);

  const ItemComponent = doctor ? LinkItems : BtnItems;
  return (
   <main className="bg-bg-second min-h-161 flex flex-col min-w-screen items-center rounded-t-4xl p-10">
    <h1 className="text-[40px] mt-10">Explore MedMind AI Solutions</h1>
    <p className="text-[20px] text-text-second mt-6 mb-10">Diagnose become faster and more accurate with an expert-level, Advanced AI Detection Tools.</p>
    <div className="min-w-[70%]">
      {
        diagnosticsItems.map((group) => (
          <div key={group.category}  >
            <h1 className="text-[28px] pl-5 mb-10">{group.category}</h1>
            <div className="grid grid-cols-2 gap-5">
              {
                group.items.map((item) => (
                  <ItemComponent key={item.name} item={item} group={group}/>
                ))
              }
            </div>
          </div>
        ))
      }
    </div>
   </main>
  );
}

function BtnItems({item, group}) {
  const { openLogin } = useAuth();
  return (
    <button 
      className="text-start text-text-main bg-bg-third w-100 h-50 flex flex-col p-10 rounded-4xl mb-10 cursor-pointer"
      onClick={() => openLogin()}  
    >
      <Items item={item} group={group}/>
    </button>
  )
}

function LinkItems({item, group}) {
  return (
    <Link href={`./diagnostics/${item.id}`} className="text-text-main bg-bg-third w-100 h-50 flex flex-col p-10 rounded-4xl mb-10">
      <Items item={item} group={group}/>
    </Link>
  )
}

function Items({item, group}) {
  return (
    <>
      <div className="flex items-center gap-5 justify-start mb-4">
        <div style={{ backgroundColor: group.color }} className={"w-10 h-10 flex items-center justify-center rounded-xl"}>
          <Image src={item.image} alt={item.name} width={30} height={30} />
        </div>
        <h1 className="text-[20px]">{item.name}</h1>
      </div>
      <p className="text-text-second">{item.p}</p>
    </>
  )
}
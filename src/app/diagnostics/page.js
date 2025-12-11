import Image from "next/image";
import Link from "next/link";
import diagnostics from "./diagnostics.json";



export default function diagnosis() {
  return (
   <main className="bg-[#191919] min-h-161 flex flex-col min-w-screen items-center rounded-t-4xl p-10">
    <h1 className="text-[40px] mt-10">Explore MedMind AI Solutions</h1>
    <p className="text-[20px] dark:dark:text-[#8e8e8e] mt-6 mb-10">Diagnose become faster and more accurate with an expert-level, Advanced AI Detection Tools.</p>
    <div className="min-w-[70%]">
      {
        diagnostics.map((group) => (
          <div key={group.category}  >
            <h1 className="text-[28px] pl-5 mb-10">{group.category}</h1>
            <div className="grid grid-cols-2 gap-5">
              {
                group.items.map((item) => (
                  <Link key={item.name} href={``} className="bg-black w-100 h-50 flex flex-col p-10 rounded-4xl mb-10">
                    <div className="flex items-center gap-5 justify-start mb-4">
                      <div style={{ backgroundColor: group.color }} className={"w-10 h-10 flex items-center justify-center rounded-xl"}>
                        <Image src={item.image} alt={item.name} width={30} height={30} />
                      </div>
                      <h1 className="text-[20px]">{item.name}</h1>
                    </div>
                    <p className="dark:text-[#8e8e8e]">{item.p}</p>
                  </Link>
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
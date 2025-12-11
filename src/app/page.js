import Image from "next/image";
import Link from "next/link";

const containersStyle = "flex justify-center items-start w-2/3 h-96 flex-col";

export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-158 font-sans bg-transparent gap-16 px-40">
      <div className={`${containersStyle}`}>
        image
      </div>
      <div className={`${containersStyle} p-3`}>
        <h1 className="text-[40px] mb-2">Your Expertise, Amplified by AI</h1>
        <p className="text-[20px] text-[#8E8E8E]">Instantly analyze medical images with a second set of eyes trained on millions of data points.</p>
        <div className="w-full mt-16 flex justify-center">
          <Link className="dark:bg-white dark:text-black bg-black text-white px-5 py-4 rounded-2xl" href="/diagnostics">
            Explore Solutions
          </Link>
        </div>
      </div>
    </div>
  );
}

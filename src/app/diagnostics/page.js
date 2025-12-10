import Image from "next/image";
import Link from "next/link";

const diagnostics = [
  {
    category: "Dermoscopy Images",
    color: "#62E3D4",
    items: [
      {
        id: "Dermoscopy/Skin Cancer",
        name: "Skin Cancer",
        image: "/images/skin-cancer.jpg",
        p:"Detect malignant skin lesions with high accuracy using AI-powered dermoscopy analysis."
      },
      {
        id: "Dermoscopy/Diabetic Retinopathy",
        name: "Diabetic Retinopathy",
        image: "/images/diabetic-retinopathy.jpg",
        p:"Identify early signs of diabetic retinopathy through advanced image processing techniques."
      },
    ],
  },
  {
    category: "X-ray Images",
    color: "#F8F26B",
    items: [
      {
        id: "Xray/Skull Fractures",
        name: "Skull Fractures",
        image: "/images/pneumonia.jpg",
        p:"Detect skull fractures with precision using AI-enhanced X-ray image analysis."
      },
      {
        id: "Xray/Bone Fractures",
        name: "Bone Fractures",
        image: "/images/tuberculosis.jpg",
        p:"Accurately identify bone fractures through advanced AI algorithms applied to X-ray images."
      },
      {
        id: "Xray/Rib Fractures",
        name: "Rib Fractures",
        image: "/images/tuberculosis.jpg",
        p:"Enhance rib fracture detection with AI-driven analysis of chest X-ray images."
      },
    ],
  },
  {
    category: "MRI Images",
    color: "#7CD3FF",
    items: [
      {
        id: "MRI/Alzheimers",
        name: "Alzheimer’s",
        image: "/images/pneumonia.jpg",
        p:"Early detection of Alzheimer's disease using AI-powered MRI image analysis."
      },
      {
        id: "MRI/Brain Tumor",
        name: "Brain Tumor",
        image: "/images/tuberculosis.jpg",
        p:"Identify brain tumors with high accuracy through advanced AI techniques applied to MRI scans."
      },
    ],
  },
];


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
                    <div>
                      <image />
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
'use client'

import Image from "next/image";
import Link from "next/link";
import { fetchDoctor } from "@/components/authToken";
import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/dist/server/api-utils";
import { useState, useEffect } from "react";

export default function Home() {
  const { openSignup } = useAuth()
  const [doctor, setDoctor] = useState(null);
    
  useEffect(() => {
    const getDoctorData = async () => {
      const data = await fetchDoctor();
      setDoctor(data);
    };
    getDoctorData();
  }, []);

  return (
    <main>
      <div className='sectionStyle bg-transparent gap-16'>
        <div className='containerStyle'>
          <Image src="/assets/1.jpeg" width={500} height={500} alt="image"/>
        </div>
        <div className='containerStyle p-3'>
          <h1 className="headerText">Your Expertise, Amplified by AI</h1>
          <p className='pSecondText'>Instantly analyze medical images with a second set of eyes trained on millions of data points.</p>
          <div className="w-full mt-16 flex justify-center">
            <Link className='btnStyle' href="/diagnostics">
              Explore Solutions
            </Link>
          </div>
        </div>
      </div>

      <div className='sectionStyle flex-col bg-bg-second'>
        <h1 className="text-4xl text-center mt-25 mb-15">
          From Image to Insight in Seconds, <br /> 
          Skin Cancer Detection Powered by Deep Learning
        </h1>
        <div className="flex flex-row justify-center items-center gap-16">
          <div className='containerStyle'>
            images
          </div>
          <div className='containerStyle'>
            <p className='pSecondText mb-16'>
              Our AI model analyzes dermoscopic and clinical skin images to assist clinicians in identifying potential malignant lesions, including melanoma, at an early stage.<br/>
              Trained on thousands of labeled dermatology images, MedMind provides fast, consistent, and explainable predictions to support clinical decision-making.
            </p>
            <button className='btnStyle' onClick={() => doctor ? redirect('/diagnostic') : openSignup()}>
              Try Now
            </button>
          </div>
        </div>
      </div>

      <div className='sectionStyle bg-transparent flex-col'>
        <h1 className="text-4xl mb-15 mt-25">
          What We Provide
        </h1>
        <div className="flex flex-row justify-center items-center gap-16">
          <div className='containerStyle'>
            <h2 className='pMainText'>
              Confidence Scores for Every Prediction
            </h2>
            <p className='pSecondText'>
              Modern healthcare is facing unprecedented diagnostic pressure. Clinicians are expected to interpret increasing volumes of medical imaging data while maintaining accuracy, speed, and patient safety. MedMind was created to support healthcare professionals in navigating these challenges responsibly.
            </p>
          </div>
          <div className='containerStyle'>
            <div className="grid grid-cols-3 gap-x-9 grid-rows-2 text-center capitalize bg-bg-second px-5 py-3 border border-text-second">
              <p className="text-text-second text-lg">Result</p>
              <p className="text-text-second text-lg">Confidence</p>
              <p className="text-text-second text-lg">Found in</p>
              <p className="text-xl">Malignant</p>
              <p className="text-xl">86.5%</p>
              <p className="text-xl">3 Images</p>
            </div>
          </div>
        </div>

        <div className="flex flex-row justify-center items-center gap-16">
          <div className='containerStyle'>
            image
          </div>
          <div className='containerStyle'>
            <h2 className='pMainText'>
              Visual Explanations (Grad-CAM Heatmaps)
            </h2>
            <p className='pSecondText'>
              Attention heatmaps highlight the image regions that influenced the model’s prediction, improving interpretability and trust.
            </p>
          </div>
        </div>
        
        <div className="flex flex-row justify-center items-center gap-16 mb-15">
          <div className='containerStyle'>
            <h2 className='pMainText'>
              Continuous Validation & Improvement
            </h2>
            <p className='pSecondText'>
              Models are regularly evaluated and refined to maintain performance and alignment with evolving clinical standards.
            </p>
          </div>
          <div className='containerStyle'>
            <Image src="/assets/3.jpeg" width={300} height={300} alt="image"/>
          </div>
        </div>
      </div>
    </main>
  );
}
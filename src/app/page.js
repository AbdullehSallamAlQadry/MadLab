'use client'

import Image from "next/image";
import Link from "next/link";
import { sectionsStyle, containersStyle, btnsStyle, headerText, pMainText, pSecondText } from "@/components/styles"

export default function Home() {
  return (
    <main>
      <div className={`${sectionsStyle} bg-transparent gap-16`}>
        <div className={`${containersStyle}`}>
          image
        </div>
        <div className={`${containersStyle} p-3`}>
          <h1 className={`${headerText}`}>Your Expertise, Amplified by AI</h1>
          <p className={pSecondText}>Instantly analyze medical images with a second set of eyes trained on millions of data points.</p>
          <div className="w-full mt-16 flex justify-center">
            <Link className={`${btnsStyle}`} href="/diagnostics">
              Explore Solutions
            </Link>
          </div>
        </div>
      </div>

      <div className={`${sectionsStyle} flex-col dark:bg-dark-bg-second bg-light-bg-second`}>
        <h1 className="text-4xl text-center mt-25 mb-15">
          From Image to Insight in Seconds, <br /> 
          Skin Cancer Detection Powered by Deep Learning
        </h1>
        <div className="flex flex-row justify-center items-center gap-16">
          <div className={containersStyle}>
            images
          </div>
          <div className={containersStyle}>
            <p className={`${pSecondText} mb-16`}>
              Our AI model analyzes dermoscopic and clinical skin images to assist clinicians in identifying potential malignant lesions, including melanoma, at an early stage.<br/>
              Trained on thousands of labeled dermatology images, MedMind provides fast, consistent, and explainable predictions to support clinical decision-making.
            </p>
            <button className={`${btnsStyle}`} href="/diagnostics">
              Try Now
            </button>
          </div>
        </div>
      </div>

      <div className={`${sectionsStyle} bg-transparent flex-col`}>
        <h1 className="text-4xl mb-15 mt-25">
          What We Provide
        </h1>
        <div className="flex flex-row justify-center items-center gap-16">
          <div className={`${containersStyle}`}>
            <h2 className={pMainText}>
              Confidence Scores for Every Prediction
            </h2>
            <p className={pSecondText}>
              Modern healthcare is facing unprecedented diagnostic pressure. Clinicians are expected to interpret increasing volumes of medical imaging data while maintaining accuracy, speed, and patient safety. MedMind was created to support healthcare professionals in navigating these challenges responsibly.
            </p>
          </div>
          <div className={`${containersStyle}`}>
            <div className="grid grid-cols-3 gap-x-9 grid-rows-2 text-center capitalize dark:bg-dark-bg-second bg-light-bg-second px-5 py-3 border dark:border-dark-text-second border-light-text-second">
              <p className="dark:text-dark-text-second text-light-text-second text-lg">result</p>
              <p className="dark:text-dark-text-second text-light-text-second text-lg">Confidence</p>
              <p className="dark:text-dark-text-second text-light-text-second text-lg">found in</p>
              <p className="text-xl">malignant</p>
              <p className="text-xl">86.5%</p>
              <p className="text-xl">3 images</p>
            </div>
          </div>
        </div>

        <div className="flex flex-row justify-center items-center gap-16">
          <div className={`${containersStyle}`}>
            image
          </div>
          <div className={`${containersStyle}`}>
            <h2 className={pMainText}>
              Visual Explanations (Grad-CAM Heatmaps)
            </h2>
            <p className={pSecondText}>
              Attention heatmaps highlight the image regions that influenced the model’s prediction, improving interpretability and trust.
            </p>
          </div>
        </div>
        
        <div className="flex flex-row justify-center items-center gap-16 mb-15">
          <div className={`${containersStyle}`}>
            <h2 className={pMainText}>
              Continuous Validation & Improvement
            </h2>
            <p className={pSecondText}>
              Models are regularly evaluated and refined to maintain performance and alignment with evolving clinical standards.
            </p>
          </div>
          <div className={`${containersStyle}`}>
            image
          </div>
        </div>
      </div>
    </main>
  );
}
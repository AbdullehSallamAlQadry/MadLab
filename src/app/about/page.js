import Image from "next/image";

export default function about() {
  return(
    <main>
       <div className='sectionStyle bg-transparent gap-16'>
        <div className='containerStyle'>
          image
        </div>
        <div className='containerStyle p-1'>
          <h1 className='headerText mb-2'>
            We deserve your trust, this is all you need to know about us
          </h1>
          <p className='pSecondText'>
            Our mission is to support healthcare professionals by providing
            accurate, fast, and secure AI-powered medical image analysis—
            helping improve diagnostic confidence and patient outcomes.
          </p>
          <div className="w-full mt-16 flex justify-center">
          </div>
        </div>
      </div>

      <div className='sectionStyle dark:bg-dark-bg-second bg-light-bg-second flex-col'>
        <div className="flex flex-row justify-center items-center gap-16">
          <div className='containerStyle p-1'>
            <h1 className='headerText mb-2'>
              Why MedMind Exists ?
            </h1>
            <p className='pSecondText'>
              Modern healthcare is facing unprecedented diagnostic pressure. 
              Clinicians are expected to interpret increasing volumes of medical 
              imaging data while maintaining accuracy, speed, and patient 
              safety. MedMind was created to support healthcare professionals
               in navigating these challenges responsibly.
            </p>
            <div className="w-full mt-16 flex justify-center">
            </div>
          </div>
          <div className='containerStyle'>
            image
          </div>
        </div>
        <div className="flex flex-row justify-center items-center gap-16">
          <div className='containerStyle'>
            image
          </div>
          <div className='containerStyle p-1'>
            <h1 className='headerText mb-2'>
              Our Vision...
            </h1>
            <p className='pSecondText'>
              We envision a future where artificial intelligence works alongside healthcare professionals to enhance diagnostic confidence, improve efficiency, and support better patient outcomes — without replacing human judgment.
            </p>
            <div className="w-full mt-16 flex justify-center">
            </div>
          </div>
        </div>
      </div>

      <div className="gap-16 flex flex-row justify-between items-center p-15">
        <h1 className='headerText text-center'>
          Compliance & Privacy Note
        </h1>
        <p className='pSecondText px-10'>
          We envision a future where artificial intelligence works alongside healthcare 
          professionals to enhance diagnostic confidence, improve efficiency, and support
          better patient outcomes — without replacing human judgment.
        </p>
      </div>

      <div className='sectionStyle flex-col dark:bg-dark-bg-second bg-light-bg-second'>
        <div className="flex flex-col justify-between items-center p-15 w-2xl">
          <h1 className='headerText mb-3 text-center'>
            Compliance & Privacy Note
          </h1>
          <p className='pSecondText px-10'>
            We envision a future where artificial intelligence works alongside healthcare 
            professionals to enhance diagnostic confidence, improve efficiency, and support
            better patient outcomes — without replacing human judgment.
          </p>
        </div>
        <div className="flex flex-row">
          <div className="flex flex-col justify-between items-center p-15 w-2xl">
            <h1 className='headerText mb-3 text-center'>
              Email
            </h1>
            <p className='pSecondText px-10'>
              General Support: support@medmind.ai<br/>
              Partnerships & Research: partnerships@medmind.ai
            </p>
          </div>
          <div className="flex flex-col justify-between items-center p-15 w-2xl">
            <h1 className='headerText mb-3 text-center'>
              Phone
            </h1>
            <p className='pSecondText px-10'>
              General Support (Whatsapp): +967737592511 
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
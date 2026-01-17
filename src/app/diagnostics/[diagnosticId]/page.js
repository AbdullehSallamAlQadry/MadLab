'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useState, use, useEffect } from 'react';
import SubmitButton from '@/components/feature/auth/components/submit_button';
import { useActionState } from 'react';
import { diagnosticAction } from './action';
import { SelectItems } from './components/SelectItems';
import { FieldItems } from './components/FieldItems';
import { InputWithError } from './components/InputWithError';
import { CheckboxItem } from './components/CheckboxItem';
import Image from 'next/image';

export default function Page({ params }) {
  const initialState = { success: false, data: null, errors: {}, massage: "" };

  const resolvedParams = use(params);
  const diagnosticId = resolvedParams.diagnosticId;
  const diagnosticName = diagnosticId.toLowerCase().replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

  const [state, formAction] = useActionState(diagnosticAction, initialState);
  
  const [imagePaths, setImagePaths] = useState([]);
  const [selectImage, setSelectImage] = useState(null);
  const [hoverImageIndex, setHoverImageIndex] = useState(null);

  function addFiles(files) {
    if (!files || files.length === 0) return;
    const existingNames = imagePaths.map(img => img.file.name);

    const newImagePaths = Array.from(files)
      .filter(file => !existingNames.includes(file.name))
      .map(file => ({
        file: file,
        preview: URL.createObjectURL(file),
        id: crypto.randomUUID()
      }));

    setImagePaths(prevPaths => [...prevPaths, ...newImagePaths]);
    if (selectImage === null && newImagePaths.length > 0) {
      setSelectImage(newImagePaths[0].preview);
    }
  }

  function handleAddImage(event) {
    addFiles(event.target.files);
    event.target.value = '';
  }

  function handleDragOver(e) { e.preventDefault(); }
  function handleDrop(e) {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  }

  function handleRemoveImage(index) {
    setImagePaths(prev => {
      URL.revokeObjectURL(prev[index].preview);
      const newList = prev.filter((_, i) => i !== index);
      if (prev[index].preview === selectImage) {
        setSelectImage(newList.length > 0 ? newList[0].preview : null);
      }
      return newList;
    });
  }

  const handleSubmit = (formData) => {
    formData.delete('images'); 
    
    imagePaths.forEach((pathObj) => {
      formData.append('images', pathObj.file);
    });

    formAction(formData);
  };

  useEffect(()=>{
    console.log(state?.errors)
  },[state])

  return (
    <main suppressHydrationWarning>
      <form className='w-full h-auto flex justify-center items-center gap-20' action={handleSubmit}>
        <div 
          className='w-64 h-145 bg-bg-second rounded-xl p-4 m-4 flex flex-col gap-4 items-center overflow-scroll'
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <h1 className='w-45 text-text-second border-b-text-second text-center p-1.5'>Samples</h1>
          <div className='gap-2 flex flex-col h-100 overflow-scroll'>
            {imagePaths.map((path, index) => (
              <div key={path.id} className={`relative border border-border-color rounded-lg cursor-pointer`} 
                onMouseEnter={() => setHoverImageIndex(path.id)}
                onMouseLeave={() => setHoverImageIndex(null)}
              >
                <FontAwesomeIcon 
                  icon={faTrash}
                  size='2xs' 
                  style={{color:"red", visibility: hoverImageIndex === path.id ? 'visible' : 'hidden', position: 'absolute', marginLeft: '135px', marginTop: '5px'}}
                  className={`m-1 p-1 bg-btn-bg text-btn-text rounded-lg text-xl cursor-pointer z-10 h-8`} 
                  onClick={(e) => { e.stopPropagation(); handleRemoveImage(index); }} 
                />  
                <img src={path.preview} alt="Sample" className="w-40 h-40 rounded-lg" onClick={() => setSelectImage(path.preview)} />
              </div>
            ))}
          </div>  
          <label className='btnStyle cursor-pointer' htmlFor='images'>
            Upload Images
            <input id="images" type="file" className="hidden" multiple onChange={handleAddImage} />
          </label>
        </div>

        <div className='flex flex-col justify-center items-center gap-6'>
          <h1 className='text-3xl mb-2'>{diagnosticName}</h1>
          <div className='w-120 h-100 flex justify-center items-center border border-border-color bg-bg-second rounded-xl'>
            {selectImage ? <img src={selectImage} alt="Selected" className='max-w-full max-h-full rounded-xl'/> : <p className='text-text-second'>Upload Samples to preview</p>}
          </div>
          {state?.massage && <div className="text-red-500 text-sm mt-2">{state.massage}</div>}
          <SubmitButton name={'Diagnosis'}/>
        </div>

        <div className='flex flex-col justify-start items-center w-90 h-145 bg-bg-second rounded-xl p-4 m-4 gap-4'>
          <h1 className='w-65 text-text-second border-b-text-second text-center p-1.5'>Patient Info</h1>
          <InputWithError name={'age'} label={'Age'} error={state?.errors?.age}> 
            <FieldItems name={'age'} placeholder={'age'} error={state?.errors?.age} defaultValue={state?.fields?.age}/>
          </InputWithError>
          
          <InputWithError name={'gender'} label={'Gender'} error={state?.errors?.gender}> 
            <SelectItems name={'gender'} defaultValue={state?.fields?.gender || 'male'} error={state?.errors?.gender}>
              <option value={'male'}>male</option>
              <option value={'female'}>female</option>
            </SelectItems>
          </InputWithError>

          <InputWithError name={'blood_type'} label={'Blood Type'} error={state?.errors?.blood_type}> 
            <SelectItems name={'blood_type'} defaultValue={state?.fields?.blood_type || 'O-'} error={state?.errors?.blood_type}>
              <option value={'AB+'}>AB+</option>
              <option value={'A+'}>A+</option>
              <option value={'B+'}>B+</option>
              <option value={'O+'}>O+</option>
              <option value={'AB-'}>AB-</option>
              <option value={'A-'}>A-</option>
              <option value={'B-'}>B-</option>
              <option value={'O-'}>O-</option>
            </SelectItems>
          </InputWithError>

          <InputWithError name={'lesion_size_mm'} label={'Lesion Size'} error={state?.errors?.lesion_size_mm}> 
            <FieldItems name={'lesion_size_mm'} placeholder={'mm'} error={state?.errors?.lesion_size_mm} defaultValue={state?.fields?.lesion_size_mm}/>
          </InputWithError>

          <InputWithError name={'lesion_location'} label={'Lesion Location'} error={state?.errors?.lesion_location}> 
            <FieldItems name={'lesion_location'} placeholder={'Location'} error={state?.errors?.lesion_location} type='text' defaultValue={state?.fields?.lesion_location}/>
          </InputWithError>

          <InputWithError name={'diameter_mm'} label={'Diameter'} error={state?.errors?.diameter_mm}> 
            <FieldItems name={'diameter_mm'} placeholder={'Diameter'} error={state?.errors?.diameter_mm} defaultValue={state?.fields?.diameter_mm}/>
          </InputWithError>

          <div className='grid grid-cols-2 w-full gap-4'>  
            <CheckboxItem category={'asymmetry'} defaultChecked={state?.fields?.asymmetry}/>            
            <CheckboxItem category={'border_irregularity'} defaultChecked={state?.fields?.border_irregularity}/>            
            <CheckboxItem category={'color_variation'} defaultChecked={state?.fields?.color_variation}/>            
            <CheckboxItem category={'evolution'} defaultChecked={state?.fields?.evolution}/>            
          </div>

          <div className='flex flex-col w-full gap-1'>
            <label htmlFor='note'>Notes</label>
            <textarea className='resize-none border-text-main border p-1.5 rounded-xl' rows={3} id='note' name='note' placeholder='Additional information...' defaultValue={state?.fields?.note} />
          </div>
        </div>
        <input type="hidden" name="diagnosticId" value={diagnosticId} />
      </form>
      
      <div className='w-full flex flex-col justify-center items-center mt-10'>
        <div className='relative w-250 h-150 bg-bg-second rounded-xl p-4 m-4 flex flex-col justify-center items-center'>
          <h1 className='absolute left-10 top-10 text-4xl'>Results</h1>
          {(state?.success && state?.data && state?.data?.status === 'COMPLETED') ? (
              <CompleteResult data={state.data} />
          ) : (
              <p className='text-text-second'>Results will show up here after complete</p>
          )}
        </div>
      </div>
    </main>
  );
}

function PandingResult(data) {

}

function CompleteResult({data}) {
  const [currentInfo, setCurrentInfo] = useState({
    result: data.image_samples[0]?.result[0]?.result || "N/A",
    confidence: data.image_samples[0]?.result[0]?.confidence || 0,
    image: data.image_samples[0]?.image,
    xai_image: data.image_samples[0]?.result[0]?.xai_image,
    number: 1,
  });

  return (
    <div className='flex justify-center items-center gap-10'>
      <div className=''>
        <div className="flex flex-col text-start capitalize bg-bg-second px-5 py-3">
          <p className="text-text-second mt-4">Result</p>
          <p>{currentInfo.result}</p>
          <p className="text-text-second mt-4">Confidence</p>
          <p>{(currentInfo.confidence * 100).toFixed(2)}%</p>
          <p className="text-text-second mt-4">Picture Number</p>
          <p>{currentInfo.number}</p>
        </div>
      </div>
      <div className='flex justify-center items-center flex-col gap-8'>
        <div className="grid grid-cols-3 gap-x-9 grid-rows-2 text-center capitalize bg-bg-second px-5 py-3">
          <p className="text-text-second text-[24px]">Result</p>
          <p className="text-text-second text-[24px]">Confidence</p>
          <p className="text-text-second text-[24px]">Found in</p>
          <p className="text-[27px]">{data.result}</p>
          <p className="text-[27px]">{(data.final_confidence * 100).toFixed(2)}%</p>
          <p className="text-[27px]">{data.image_count} Images</p>
        </div>
        <div className='flex justify-center items-center'>
          <div className='relative w-50 h-50'>
            {currentInfo?.xai_image &&
              <Image src={currentInfo.xai_image} alt={'image'} fill/> 
            }
          </div>
          <div className='relative w-50 h-50'>
            {currentInfo?.image && 
              <Image src={currentInfo.image} alt={'image'} fill/>
            }
          </div>
        </div>
        <div className='flex justify-center items-center gap-1'>
          {
            data.image_samples.map((sample, index) => (
              <div 
                className='relative w-20 h-20 cursor-pointer'
                key={sample.id}
                onClick={() => setCurrentInfo({
                  result: sample.result[0].result,
                  confidence: sample.result[0].confidence,
                  image:sample.image,
                  xai_image:sample.result[0].xai_image,
                  number: (index + 1),
                })}  
              > 
                <Image src={sample.image} alt={'image'} fill/>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect, use, useRef } from 'react';
import SubmitButton from '@/components/ui/submit_button';
import { useActionState } from 'react';
import { diagnosticAction } from './action';
import { SelectItems } from './components/SelectItems';
import { FieldItems } from './components/FieldItems';
import { InputWithError } from './components/InputWithError';
import { CheckboxItem } from './components/CheckboxItem';
import Image from 'next/image';
import { checkAuthStatus } from '@/lib/session';
import PopUp from '@/components/ui/popup';
import CloseBtn from '@/components/ui/close_button';

export default function Page({ params }) {
  const initialState = { success: false, data: null, errors: {}, massage: "" };

  useEffect(() => {
    const verify = async () => {
      const isAuthenticated = await checkAuthStatus();
      if (!isAuthenticated) {
        window.location.href = "/";
      }
    };
    verify();
  }, []);

  const resolvedParams = use(params);
  const diagnosticId = resolvedParams.diagnosticId;
  const diagnosticName = diagnosticId.toLowerCase().replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

  const [state, formAction] = useActionState(diagnosticAction, initialState);
  
  const [imagePaths, setImagePaths] = useState([]);
  const [selectImage, setSelectImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [hoverImageIndex, setHoverImageIndex] = useState(null);
  const MAX_IMAGES = 5;
  const resultsRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (state?.success && state?.data?.status === 'COMPLETED' && resultsRef?.current) {
      try {
        const navbarOffset = 80; // adjust if your navbar height differs
        const top = resultsRef.current.getBoundingClientRect().top + window.scrollY - navbarOffset;
        window.scrollTo({ top, behavior: 'smooth' });
      } catch (e) {
        // fail silently
      }
    }
  }, [state?.success, state?.data?.status]);

  function addFiles(files) {
    if (!files || files.length === 0) return;
    const existingNames = imagePaths.map(img => img.file.name);

    const allowed = Math.max(0, MAX_IMAGES - imagePaths.length);
    if (allowed === 0) return;

    const toAdd = Array.from(files)
      .filter(file => !existingNames.includes(file.name))
      .slice(0, allowed)
      .map(file => ({
        file: file,
        preview: URL.createObjectURL(file),
        id: crypto.randomUUID()
      }));

    setImagePaths(prevPaths => [...prevPaths, ...toAdd]);
    if (selectImage === null && toAdd.length > 0) {
      setSelectImage(toAdd[0].preview);
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

  return (
    <main suppressHydrationWarning>
      <form className='w-full h-auto flex justify-center items-center gap-10' action={handleSubmit}>
        <div 
          className='w-64 h-150 bg-bg-second rounded-xl p-4 m-4 flex flex-col gap-4 items-center overflow-scroll'
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <h1 className='w-45 text-text-second border-b border-text-second text-center p-1.5'>Samples</h1>
          <div className='gap-2 flex flex-col h-100 overflow-scroll'>
            {imagePaths.map((path, index) => (
              <div key={path.id} className={`relative border border-border-color rounded-lg cursor-pointer`} 
                onMouseEnter={() => setHoverImageIndex(path.id)}
                onMouseLeave={() => setHoverImageIndex(null)}
              >
                <FontAwesomeIcon 
                  icon={faTrash}
                  size='2xs' 
                  style={{color:"red", visibility: hoverImageIndex === path.id ? 'visible' : 'hidden', position: 'absolute', right: '6px', top: '6px'}}
                  className={`m-1 p-1 bg-btn-bg text-btn-text rounded-lg text-xl cursor-pointer z-10 h-8`} 
                  onClick={(e) => { e.stopPropagation(); handleRemoveImage(index); }} 
                />  
                <div className="relative w-40 h-40 rounded-lg overflow-hidden" onClick={() => { setSelectImage(path.preview); setShowModal(true); }}>
                  <Image src={path.preview} alt="Sample" fill className="object-cover" unoptimized />
                </div>
              </div>
            ))}
          </div>  
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={`btnStyle ${imagePaths.length >= MAX_IMAGES ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            disabled={imagePaths.length >= MAX_IMAGES}
          >
            Upload Images
          </button>
          <input ref={inputRef} id="images" type="file" className="hidden" multiple onChange={handleAddImage} disabled={imagePaths.length >= MAX_IMAGES} />
          {imagePaths.length >= MAX_IMAGES && (
            <p className="text-sm text-red-500 mt-2">Maximum of {MAX_IMAGES} images reached</p>
          )}
        </div>

        <div className='flex flex-col justify-center items-center gap-6'>
          <h1 className='text-3xl'>{diagnosticName}</h1>
          <p className='text-sm text-text-main font-semibold capitalize'>Clinical reminder: MedMind is an assistive tool — confirm findings with your clinical judgment.</p>
          <div className='w-120 h-100 flex justify-center items-center bg-bg-second rounded-xl'>
            {selectImage ? (
              <div className="relative w-full h-full" onClick={() => setShowModal(true)}>
                <Image src={selectImage} alt="Selected" fill className="object-contain rounded-xl" unoptimized />
                <ImageModal open={showModal} onClose={() => setShowModal(false)}>
                  <Image src={selectImage} alt="Large view" fill className="object-contain" unoptimized />
                </ImageModal>
              </div>
            ) : (
              <p className='text-text-second capitalize'>upload samples to preview</p>
            )}
          </div>
          <div className='relative w-full grid place-items-center'>
            {state?.massage && <div className="text-red-500 text-center text-sm w-full absolute">{state.massage}</div>}
          </div>
          <SubmitButton name={'Diagnosis'}/>
        </div>

        <div className='flex flex-col justify-start items-center w-90 h-150 bg-bg-second rounded-xl p-4 m-4 gap-4.5'>
          <h1 className='w-65 text-text-second border-b border-text-second text-center p-1.5'>Patient Info</h1>
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
            <textarea className='resize-none border-border-color border p-1.5 rounded-xl' rows={3} id='note' name='note' placeholder='Additional information...' defaultValue={state?.fields?.note} />
          </div>
        </div>
        <input type="hidden" name="diagnosticId" value={diagnosticId} />
      </form>
      
      <div ref={resultsRef} className='w-full flex flex-col justify-center items-center mt-10'>
        <div className='relative w-250 h-150 bg-bg-second rounded-xl p-4 m-4 flex flex-col justify-center items-center'>
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

// Modal for showing large selected image
function ImageModal({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <PopUp openPopup={open} width='50rem' height='40rem'>
      <CloseBtn close={onClose} className='absolute right-1 top-1 z-10'/>
        <div className="relative w-full h-full flex justify-center items-center">
          {children}
        </div>
    </PopUp>
  );
}

function CompleteResult({data}) {
  const [currentInfo, setCurrentInfo] = useState({
    result: data.image_samples[0]?.result[0]?.result || "N/A",
    confidence: data.image_samples[0]?.result[0]?.confidence || 0,
    image: data.image_samples[0]?.image,
    xai_image: data.image_samples[0]?.result[0]?.xai_image,
    number: 1,
  });

  const malignantCount = (data.image_samples || []).filter(s => {
    const r = (s.result?.[0]?.result || '').toString().toLowerCase();
    return r.includes('malignant');
  }).length || 0;

  return (
    <div className='flex justify-center items-center gap-10'>
      <h1 className='absolute left-10 top-10 text-4xl'>Results #{data.id}</h1>
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
          <p className="text-text-second text-2xl">Result</p>
          <p className="text-text-second text-2xl">Confidence</p>
          <p className="text-text-second text-2xl">Found in</p>
          <p className="text-3xl">{data.result}</p>
          <p className="text-3xl">{(data.final_confidence * 100).toFixed(2)}%</p>
          <p className="text-3xl">{malignantCount} Images</p>
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
          {data.image_samples.map((sample, index) => (
            <div 
              className={`relative w-16 h-16 cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                currentInfo.number === index + 1 ? 'border-border-color scale-105' : 'border-transparent opacity-70'
              }`}
              key={sample.id}
              onClick={() => setCurrentInfo({
                result: sample.result[0].result,
                confidence: sample.result[0].confidence,
                image: sample.image,
                xai_image: sample.result[0].xai_image,
                number: (index + 1),
              })}  
            > 
              <Image src={sample.image} alt={'thumbnail'} fill className="object-cover"/>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
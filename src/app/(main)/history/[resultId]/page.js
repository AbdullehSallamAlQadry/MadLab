'use client'

import Image from "next/image";
import { useState, useEffect, use } from "react";
import { getHistoryDetailAction, getBiopsyStatusAction } from "../action";
import Upload from "../components/upload";

export default function Page({params}) {
  const { resultId } = use(params);
  const [openUpload, setOpenUpload] = useState(false);
  const [data, setDetailData] = useState(null);
  const [currentInfo, setCurrentInfo] = useState({
    result: "N/A",
    confidence: 0,
    image: null,
    xai_image: null,
    number: 1,
  });
  const [isDetailLoading, setIsDetailLoading] = useState(true);
  const [biopsyStatus, setBiopsyStatus] = useState(null);
  const [loadingBiopsyStatus, setLoadingBiopsyStatus] = useState(false);

  useEffect(() => {
    if (resultId) {
      const fetchDetail = async () => {
        setIsDetailLoading(true);
        setDetailData(null); 
        const result = await getHistoryDetailAction(resultId);
        if (result.success) {
          console.log("Detail Data:", result.data);
          setDetailData(result.data);
        }
        setIsDetailLoading(false);
      };
      fetchDetail();
    }
  }, [resultId]);

  useEffect(() => {
    if (!data?.biopsy_result_id) return;
    const fetchBiopsy = async () => {
      setLoadingBiopsyStatus(true);
      const res = await getBiopsyStatusAction(data.biopsy_result_id);
      if (res?.success) {
        setBiopsyStatus(res.data);
      }
      setLoadingBiopsyStatus(false);
    };
    fetchBiopsy();
  }, [data?.biopsy_result_id]);

  useEffect(() => {
    if (data?.image_samples?.length > 0) {
      const first = data.image_samples[0];
      setCurrentInfo({
        result: first.result[0]?.result || "N/A",
        confidence: first.result[0]?.confidence || 0,
        image: first.image,
        xai_image: first.result[0]?.xai_image,
        number: 1,
      });
    }
  }, [data]);

  if (isDetailLoading && !data) {
    return <div className="flex w-full h-145 justify-center items-center"><div className="pageLoader"></div></div>;
  }

  if (!data) {
    return <div className="flex justify-center items-center h-screen">No data found.</div>;
  }

  return (
    <div className="w-full flex flex-col items-center gap-4 p-10">
    <div className="w-[75%] flex items-center justify-between">
      <div className="flex">
        <p className="pl-3 text-3xl">{(data.checkup_type).toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}</p>
        <p className="pl-3 text-3xl">#{data.id}</p>
      </div>
      <button 
        className="btnStyle"
        onClick={() => {
          window.open(`/report/skin-cancer/${data.id}`, '_blank', 'noopener,noreferrer');
        }}  
      >
        Report 
      </button>
    </div>
    <div className="w-full flex flex-row justify-center items-center gap-6">
      <div className="flex flex-col items-center bg-bg-second rounded-xl w-70 h-146 border border-border-color">
        <p className="px-18 py-3 text-text-second border-b">Patient Info</p>
        <FieldComponent label="Age" value={data.age || 'N/A'}/>
        <FieldComponent label="Gender" value={data.gender || 'N/A'}/>
        <FieldComponent label="Blood Type" value={data.blood_type || 'N/A'}/>
        <FieldComponent label="Lesion Size (mm)" value={data.lesion_size_mm || 'N/A'}/>
        <FieldComponent label="Lesion Location" value={data.lesion_location || 'N/A'}/>
        <FieldComponent label="Diameter (mm)" value={data.diameter_mm || 'N/A'}/>
        <FieldComponent label="Asymmetry" value={data.asymmetry ? 'Yes' : 'No'}/>
        <FieldComponent label="Border Irregularity" value={data.border_irregularity ? 'Yes' : 'No'}/>
        <FieldComponent label="Color Variation" value={data.color_variation ? 'Yes' : 'No'}/>
        <FieldComponent label="Evolution" value={data.evolution ? 'Yes' : 'No'}/>
        <div className="flex w-full gap-2 px-5 py-2.5 border-t border-border-color/50">
          <p className="text-text-second text-sm font-medium">Note</p>
          <div className="w-full h-17 p-2 border border-border-color rounded-xl bg-bg-main/50 text-sm leading-relaxed whitespace-pre-wrap wrap-break-word overflow-x-scroll">
            {data.note || 'No notes provided for  this checkup.'}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <div className='relative w-190 h-110 bg-bg-second rounded-xl flex flex-col justify-center items-center border border-border-color'>
          <h1 className='absolute left-10 top-10 text-3xl'>Results</h1>
          <div className='flex justify-center items-center gap-10'>
            <div>
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
                <p className="text-text-second text-[20px]">Result</p>
                <p className="text-text-second text-[20px]">Confidence</p>
                <p className="text-text-second text-[20px]">Found in</p>
                <p className="text-[23px]">{data.result}</p>
                <p className="text-[23px]">{(data.final_confidence * 100).toFixed(2)}%</p>
                <p className="text-[23px]">{(data.image_samples || []).filter(s => ((s.result?.[0]?.result || '').toString().toLowerCase().includes('malignant'))).length || 0} Images</p>
              </div>
              <div className='flex justify-center items-center'>
                <div className='relative w-42 h-42'>
                  {currentInfo?.xai_image &&
                    <Image src={currentInfo.xai_image} alt={'image'} fill/> 
                  }
                </div>
                <div className='relative w-42 h-42'>
                  {currentInfo?.image && <Image src={currentInfo.image} alt={'image'} fill/>}
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
        </div>
        <div className="w-190 h-30 bg-bg-second rounded-xl flex justify-center items-center border border-border-color gap-4">
          {!data?.biopsy_result_id ? (
            <>
              <p className="">Upload the skin biopsy test, participate and get your credits back!</p>
              <button className="btnStyle" onClick={() => setOpenUpload(true)}>Upload Results</button>
            </>
          ) : (
            <div className="text-sm text-center">
              {loadingBiopsyStatus ? (
                <p>Checking biopsy status…</p>
              ) : biopsyStatus ? (
                (() => {
                  const status = (biopsyStatus.status || biopsyStatus.state || '').toString().toLowerCase();
                  if (status.includes('pend')) return <p>Biopsy status: Pending — please wait for lab confirmation.</p>;
                  if (status.includes('verif') || status.includes('ok') || status.includes('approved') || status.includes('completed')) return <p>Biopsy status: Verified — result accepted.</p>;
                  if (status.includes('reject') || status.includes('declin')) return <p>Biopsy status: Rejected — please contact support at <a className="text-blue-500 underline" href="mailto:support@medmind.site">support@medmind.site</a>.</p>;
                  return <p>Biopsy status: {biopsyStatus.status || biopsyStatus.state || 'Unknown'}</p>;
                })()
              ) : (
                <p>Unable to fetch biopsy status. Try again later.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
    <Upload openUpload={openUpload} closeUpload={() => setOpenUpload(false)} id={data?.id}/>
  </div>
  )
}

function FieldComponent({label, value}) {
  return (
    <div className="flex justify-between w-full capitalize text-text-second px-5 py-2.5">
      <p className="">{label}</p>
      <p>{value}</p>
    </div>
  );
}
'use client'

import Image from "next/image";
import { useState, useEffect } from "react";
import PopUp from "../../../components/ui/popup"
import { getHistoryDetailAction } from "../action";

export function PopupResult({selectItem, setSelectItem}) {
  const [detailData, setDetailData] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  useEffect(() => {
    if (selectItem) {
      const fetchDetail = async () => {
        setIsDetailLoading(true);
        setDetailData(null); 
        const result = await getHistoryDetailAction(selectItem);
        if (result.success) {
          setDetailData(result.data);
        }
        setIsDetailLoading(false);
      };
      fetchDetail();
    }
  }, [selectItem]);

  return (
    <PopUp openPopup={selectItem !== null} height="700px" width="1100px" bg={'--bg-main'}>
      <div className="relative w-full h-full flex items-end flex-col p-5">
        <button 
          className="absolute px-2 text-lg cursor-pointer rounded-lg text-btn-text bg-btn-bg hover:bg-btn-bg/80" 
          onClick={() => setSelectItem(null)}>
            &times;
        </button>
        {
          isDetailLoading ? <div className="w-full h-full flex justify-center items-center"> <div className="pageLoader"></div></div> :
          (detailData && <Success data={detailData} />)
        }
      </div>
    </PopUp>
  )
}

function Success({data}) {
  const [currentInfo, setCurrentInfo] = useState({
    result: data.image_samples[0]?.result[0]?.result || "N/A",
    confidence: data.image_samples[0]?.result[0]?.confidence || 0,
    image: data.image_samples[0]?.image,
    xai_image: data.image_samples[0]?.result[0]?.xai_image,
    number: 1,
  });

  return(
  <>
    <div className="h-15">

    </div>
    <div className="w-full flex flex-row justify-center items-center gap-6">
      <div className="flex flex-col items-center bg-bg-second rounded-xl w-70 h-146 border border-border-color">
        <p className="px-18 py-3 text-text-second border-b">Patient Info</p>
        <div>
          <p></p>
          <p></p>
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
                <p className="text-[23px]">{data.image_count} Images</p>
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
                {
                  data.image_samples.map((sample, index) => (
                    <div 
                      className='relative w-16 h-16 cursor-pointer'
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
        </div>
        <div className="w-190 h-30 bg-bg-second rounded-xl flex justify-center items-center border border-border-color gap-4">
          <p className="">Upload the skin biopsy test, participate and get your credits back! </p>
          <button className="btnStyle">Upload Results</button>
        </div>
      </div>
    </div>
  </>
  )
}
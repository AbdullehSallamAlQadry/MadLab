'use server'

import { axiosWithRefresh, getDoctorInfo } from "@/components/session";

export async function purchaseCreditsAction(prevState, formData) {
  const bundle = formData.get('bundle');
  const uuid = formData.get('UUID'); 

  try {
    const response = await axiosWithRefresh('billing/', {
      method: 'POST',
      body: { 
        bundle: bundle,
        idempotency_key: uuid, 
      },
    });
    
    if (!response.ok) {
      return { 
        error: response.data?.detail || "Transaction failed", 
        success: false 
      };
    }
    
    await getDoctorInfo()
    
    return { 
      message: "success", 
      success: true
    };
  } catch (err) {
    return { error: "Network error. Check your connection.", success: false };
  }
}
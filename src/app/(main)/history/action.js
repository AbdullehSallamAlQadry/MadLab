'use server'

import { axiosWithRefresh } from "@/lib/session";
import { fetchDoctor } from "@/lib/authToken";

export async function getHistoryAction(queryString) {
  const doctor = await fetchDoctor(); 
  try {
      const res = await axiosWithRefresh(`skin-cancer-checkups/?${queryString}`);
      if (res.ok) {
          return {
              items: res.data.results, 
              nextCursor: res.data.next, 
              success: true
          };
      }
      return { items: [], nextCursor: res, success: false };
  } catch (error) {
      return { items: [], nextCursor: null, success: false };
  }
}

export async function getHistoryDetailAction(id) {
  try {
    const res = await axiosWithRefresh(`skin-cancer-checkups/${id}/`, {
      method: 'GET',
    });
    if (res.ok) {
      return { data: res.data, success: true };
    }
    return { data: null, success: false };
  } catch (error) {
    return { data: null, success: false };
  }
}

export async function sendFinalFile(prevState, formData) {
  const id = formData.get("checkup_id");
  const result = formData.get("result");
  const document = formData.get("document");

  if (!document || document.size === 0) {
    return { ok: false, error: { document: "Please upload a file" } };
  }
  if (!result) {
    return { ok: false, error: { result: "Please select a result" } };
  }

  try {
    const response = await axiosWithRefresh(`biopsy-results/`, {
      method: 'POST',
      body: formData, 
    });

    if (response.ok) {
      return { ok: true, data: response.data};
    }

    return { ok: false, error: { general: "Upload failed. Please try again." }, err: response };
    
  } catch (err) {
    return { ok: false, error: { general: "Server error occurred." },err: err };
  }
}

export async function getBiopsyStatusAction(id) {
  try {
    const res = await axiosWithRefresh(`biopsy-results/${id}/`, {
      method: 'GET',
    });
    if (res.ok) {
      return { data: res.data, success: true };
    }
    return { data: null, success: false };
  } catch (error) {
    return { data: null, success: false };
  }
}
'use server'

import { axiosWithRefresh } from "@/components/session";
import { fetchDoctor } from "@/components/authToken";

export async function getHistoryAction(queryString) {
  const doctor = await fetchDoctor(); 
  try {
      const res = await axiosWithRefresh(`skin-cancer-checkups/?doctor=${doctor.id}&${queryString}`);
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
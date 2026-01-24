import { axiosWithRefresh } from "@/lib/session";

export async function pullResult(diagnosticId, taskId) {
  try {
    const res = await axiosWithRefresh(`/${diagnosticId}-checkups/${taskId}/`);
    console.error("API Response:", res.data);
    
    if (res && (res.data.status === 'COMPLETED' || res.data.results || res.data.result)) {
      return { status: 'SUCCESS', data: res.data }; 
    }
    return { status: 'LOADING/FAILED', data: null };
  } catch (error) {
    console.error("Fetch Error:", error);
    return { status: 'ERROR', data: 'fuck' };
  }
}
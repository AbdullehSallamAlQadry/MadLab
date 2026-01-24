'use server';

import { decrypt } from "./auth-utils"; 
import { cookies } from "next/headers";

export async function getAuthToken() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session')?.value;
    if (!token) return [null, null];

    const sessionData = await decrypt(token);
    return [sessionData?.doctor, sessionData?.access, sessionData?.refresh]; 
  } catch (error) {
    return [null, null];
  }
}

export async function fetchDoctor() {
  const [doctor] = await getAuthToken();
  return doctor;
}
'use server'

import axios from 'axios'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { encrypt, decrypt } from './auth-utils'

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)
const ApiUrl = process.env.NEXT_PUBLIC_API_URL;
const MaximumAge = 48 * 60 * 60;

const api = axios.create({
  baseURL: ApiUrl,
});

export async function updateSessionCredits(num) {
  const sessionData = await getSessionData();
  if (!sessionData) return;

  sessionData.doctor.credits += num;

  await setAuthCookies(sessionData.doctor, sessionData.access, sessionData.refresh);
}

async function getSessionData() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;
  if (!sessionToken) return null;
  return await decrypt(sessionToken);
}

export async function setAuthCookies(userData, accessToken, refreshToken) {
  const cookieStore = await cookies()
  
  const sessionPayload = { 
    doctor: userData,
    access: accessToken, 
    refresh: refreshToken 
  }

  const sessionToken = await encrypt(sessionPayload, '2d')

  cookieStore.set('session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MaximumAge, 
  })
}

export async function deleteSessions() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

export async function axiosWithRefresh(url, options = {}) {
  const sessionData = await getSessionData();
  if (!sessionData) redirect('/');

  try {
    const response = await api({
      url,
      method: options.method || 'GET',
      data: options.body, 
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${sessionData.access}`,
      },
    });

    return { ok: true, status: response.status, data: response.data };
  } 
  catch (error) {
    if (error.response?.status === 401) {
      try {
        const refreshRes = await axios.post(`${ApiUrl}/api/token/refresh/`, {
          refresh: sessionData.refresh,
        });

        const newAccessToken = refreshRes.data.access;

        const cookieStore = await cookies();
        sessionData.access = newAccessToken;
        const updatedToken = await encrypt(sessionData, '2d');
        
        cookieStore.set('session', updatedToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: MaximumAge,
        });

        const retryResponse = await api({
          url,
          method: options.method || 'GET',
          data: options.body,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${newAccessToken}`,
          },
        });

        return { ok: true, status: retryResponse.status, data: retryResponse.data };
      } 
      catch (refreshError) {
        await deleteSessions();
        redirect('/');
      }
    }

    return { 
      ok: false, 
      status: error.response?.status || 500, 
      data: error.response?.data || null 
    };
  }
}
'use server'

import axios from 'axios'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation' 
import { encrypt, decrypt } from './auth-utils'
import { API_URL } from './env'

const MaximumAge = 48 * 60 * 60;
const BASE_URL = API_URL;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

export async function axiosWithRefresh(url, options = {}) {
  const sessionData = await getSessionData();
  if (!sessionData) {
    await deleteSessions();
  }
  try {
    const res = await api({
      url,
      method: options.method ?? 'GET',
      data: options.body,
      headers: {
        Authorization: `Bearer ${sessionData.access}`,
        ...options.headers,
      },
    });
    return { ok: true, status: res.status, data: res.data };
  } catch (err) {
    if (err.response?.status === 401) {
      const refreshData = await getRefreshnData(); 
      
      if (refreshData?.refresh_token) {
        try {
          const refreshResponse = await fetch(`${BASE_URL}auth/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              refresh: refreshData.refresh_token, 
            })
          });
          const refreshResult = await refreshResponse.json();
          if (refreshResponse.ok && refreshResult.access) {
            await setAuthCookies(sessionData.doctor, refreshResult.access);
            const retry = await api({
              url,
              method: options.method ?? 'GET',
              data: options.body,
              headers: {
                Authorization: `Bearer ${refreshResult.access}`,
                ...options.headers,
              },
            });
            return { ok: true, status: retry.status, data: retry.data };
          }
        } catch (refreshErr) {
          await deleteSessions(); 
         }
        await deleteSessions();
      }
      await deleteSessions();
    }
    return {
      ok: false,
      status: err.response?.status ?? 500,
      data: err.response?.data ?? { detail: err.message },
    };
  }
}

export async function getRefreshnData() {
  const cookieStore = await cookies();
  const RefreshToken = cookieStore.get('refresh_token')?.value;
  if (!RefreshToken) return null;
  try {
    return await decrypt(RefreshToken);
  } catch (e) {
    return null;
  }
}

export async function getSessionData() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;
  if (!sessionToken) return null;
  try {
    return await decrypt(sessionToken);
  } catch (e) {
    return null;
  }
}

export async function setRefreshCookies(refresh) {
  const cookieStore = await cookies()
  const refreshPayload = { refresh_token: refresh }
  const refreshToken = await encrypt(refreshPayload, '2d')

  cookieStore.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MaximumAge,
    sameSite: 'lax'
  })
}

export async function setAuthCookies(userData, accessToken) {
  const cookieStore = await cookies()
  const sessionPayload = { doctor: userData, access: accessToken }
  const sessionToken = await encrypt(sessionPayload, '2d')

  cookieStore.set('session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MaximumAge,
    sameSite: 'lax'
  })
}

export async function deleteSessions() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
  cookieStore.delete('refresh_token') 
  redirect('/');
}

export async function getDoctorInfo() {
  try {
    const session = await getSessionData()
    const doctorId = session.doctor.id
    const response = await axiosWithRefresh(`doctors/${doctorId}/`);
    await setAuthCookies(response.data, session.access)
    
  } catch (err) { 
    await deleteSessions()
  }
}

export async function checkAuthStatus() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  return !!session; 
}
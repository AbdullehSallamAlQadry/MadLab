'use server'

import { z } from 'zod';
import { deleteSessions, setAuthCookies, setRefreshCookies } from '../../../lib/session';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { API_URL } from '../../../lib/env';

const loginSchema = z.object({
  email: z.string()
    .email('Invalid email')
    .trim(),
  password: z.string()
    .min(8, 'Password too short')
    .trim(),
});

const forgotPasswordSchema = z.object({
  email: z.string()
    .email('Invalid email')
    .trim()
})

const signupSchema = z.object({
  name: z.string()
    .min(3, 'Name too short')
    .trim(),
  username: z.string()
    .min(3, 'Username too short')
    .regex(/^[a-zA-Z0-9_.]+$/, { message: 'Only letters, numbers, underscores, and dots are allowed' })
    .trim(),
  specialization: z.string().min(2, 'Specialization too short').trim(),
  email: z.string()
    .email('Invalid email')
    .trim(),
  password: z.string()
    .min(8, 'Password too short')
    .trim(),
  confirmPassword: z.string()
    .trim(),
  license_image: z.any()
    .refine((file) => {return file && file instanceof File && file.size > 0}, {
      message: "Licence is required",
    }), 
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      path: ["confirmPassword"],
      message: "Passwords do not match",
      code: z.ZodIssueCode.custom,
    });
  }
});

export async function loginAction(prevState, formData) {
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const parse = loginSchema.safeParse(data);
  if (!parse.success) {
    return { error: parse.error.flatten().fieldErrors, fields: data };
  }

  try {
    const response = await fetch(`${API_URL}auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      if (result.detail === "Email not verified") return { state: "NOT_VERIFIED", email: data.email };
      if (result.detail === "Doctor account not verified") return { state: "PENDING", email: data.email };
      if (result.detail === "Doctor account is suspended") return { state: "SUSPENDED" };
      if (result.detail === "Deleted account.") return { state: "DELETED", fields: data };
      
      return { 
        error: { message: result.detail || "email or password is invalid" }, 
        fields: data, 
      };
    }

    
    await setRefreshCookies(result.refresh);
    await setAuthCookies(result.doctor, result.access);
    return { success: true };
  } catch (err) {
    console.error("Login Error:", err);
    return { error: { message: "Internal server error" }, fields: data };
  }
}

export async function signupAction(prevState, formData) {
  const data = {
    name: formData.get('name'),
    username: formData.get('username'),
    specialization: formData.get('specialization'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
    license_image: formData.get('license_image'),
  };

  const parse = signupSchema.safeParse(data);
  
  if (!parse.success) {
    return {
      error: oneErrorPerField(parse.error),
      fields: data
    };
  }
  
  try {
    const AcceptData = new FormData();
    AcceptData.append('name', formData.get('name'));
    AcceptData.append('username', formData.get('username'));
    AcceptData.append('specialization', formData.get('specialization'));
    AcceptData.append('email', formData.get('email'));
    AcceptData.append('password', formData.get('password'));
    AcceptData.append('license_image', formData.get('license_image'));

    const res = await fetch(`${API_URL}auth/signup/doctor/`,{
      method: 'POST',
      body: AcceptData,
    });

    if (res.ok) {
      return { 
        success: true
      };
    }
    
    const errorData = await res.json();
    if (errorData.detail === "Deleted account.") return { state: "DELETED", fields: data };
    return { error: errorData, fields: data };

  } catch (err) {
    return { message: "Server error during signup", fields: data, err:err };
  }
}

export async function forgotPasswordAction(prevState, formData) {
  const data = {
    email: formData.get('email'),
  };

  const parse = forgotPasswordSchema.safeParse(data);

  if (!parse.success) {
    return {
      error: oneErrorPerField(parse.error),
      fields: data
    };
  }

  try {
    const response = await fetch(`${API_URL}auth/password/forgot/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.status === 200) {
      return {
        success: true
      };
    }

    const errorData = await response.json();
    return { error: errorData, fields: data };

  } catch (err) {
    return { error: { message: "Server error during password reset" }, fields: data };
  }
}

export async function LogoutAction() {
  await deleteSessions();
}

function oneErrorPerField(zodError) {
  const fieldErrors = zodError.flatten().fieldErrors;
  const singleErrors = {};

  for (const key in fieldErrors) {
    if (fieldErrors[key]?.length) {
      singleErrors[key] = fieldErrors[key][0]; 
    }
  }

  return singleErrors;
}
'use server'

import { z } from 'zod';
import { deleteSessions, setAuthCookies } from '../session';
import { redirect } from 'next/navigation';

const loginSchema = z.object({
  email: z.string()
    .email('Invalid email')
    .trim(),
  password: z.string()
    .min(8, 'Password too short')
    .regex(/[^a-zA-Z0-9]/, { message: 'Contain at least one special character, number, and letter'})
    .trim(),
});

const signupSchema = z.object({
  name: z.string()
    .trim(),
  username: z.string()
    .min(3, 'Username too short')
    .regex(/^[a-zA-Z0-9_]+$/, { message: 'Only letters, numbers, and underscores are allowed' })
    .trim(),
  specialization: z.string().min(3, 'Specialization too short').trim(),
  email: z.string()
    .email('Invalid email')
    .trim(),
  password: z.string()
    .min(8, 'Password too short')
    .regex(/[^a-zA-Z0-9]/, { message: 'Contain at least one letter, number, and special character'})
    .trim(),
  confirmPassword: z.string()
    .trim(),
  licence: z.any()
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
    return { error: parse.error.flatten().fieldErrors };
  }

  try {
    const response = await fetch(`${process.env.API_URL}/api/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify(data),
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: { message: "The password or email is invalid" } }
    }

    if (result?.data?.doctor) {

    }

    // await setAuthCookies(result.doctor, result.access, result.refresh)
    return { data: result };
  } 
  catch (err) {
    console.log("Login Error:", err);
    return { message: "Internal server error" };
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
    licence: formData.get('licence'),
  };

  const parse = signupSchema.safeParse(data);
  
  
  if (!parse.success) {
    return {
      error: oneErrorPerField(parse.error),
    };
  }
  
  try {
    const AcceptData = new FormData();
    AcceptData.append('name', formData.get('name'));
    AcceptData.append('username', formData.get('username'));
    // AcceptData.append('specialization', formData.get('specialization'));
    AcceptData.append('email', formData.get('email'));
    AcceptData.append('password', formData.get('password'));
    AcceptData.append('license_image', formData.get('licence'));

    const res = await fetch(`${process.env.API_URL}/api/auth/signup/doctor/`, {
      method: "POST",
      body: AcceptData, 
      cache: "no-store",
    });

    if (res.status === 201 || res.ok) {
      return { 
        success: true
      };
    }

    if (!res.ok || res.status !== 201) {
      return { message: res.detail || res.message || "Signup failed" };
    }
  } catch (err) {
    return { message: "Server error during signup"};
  }
}

export async function LogoutAction() {
  await deleteSessions();
  redirect('/');
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
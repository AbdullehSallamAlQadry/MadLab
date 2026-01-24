'use server'

import { axiosWithRefresh, getSessionData, getDoctorInfo, deleteSessions } from "@/lib/session";
import { faHelmetUn } from "@fortawesome/free-solid-svg-icons";
import z from "zod";

const editSchema = z.object({
  name: z.string()
    .regex(/^[a-zA-Z]+$/, { message: 'Only letters are allowed' })
    .trim(),
  username: z.string()
    .min(3, 'Username too short')
    .regex(/^[a-zA-Z0-9_.]+$/, { message: 'Only letters, numbers, underscores, and dots are allowed' })
    .trim(),
  specialization: z.string()
  .min(2, 'Specialization too short')
  .trim()
});

export async function updateFullProfileAction(prevState, formData) {
  const data = {
    name: formData.get('name'),
    username: formData.get('username'),
    specialization: formData.get('specialization'),
  };

  const parse = editSchema.safeParse(data);
  if (!parse.success) {
    return { error: parse.error.flatten().fieldErrors, fields: data };
  }

  const AcceptData = new FormData();
  AcceptData.append('name', formData.get('name'));
  AcceptData.append('username', formData.get('username'));
  AcceptData.append('specialization', formData.get('specialization'));

  const profilePicture = formData.get('profile_picture');
  if (!profilePicture || (profilePicture instanceof File && profilePicture.size === 0)) {
    AcceptData.append('profile_picture_clear', true);
  }
  else {
    AcceptData.append('profile_picture', formData.get('profile_picture'));
  }

  try {
    const session = await getSessionData();
    const response = await axiosWithRefresh(`doctors/${session.doctor.id}/`, {
      method: 'PATCH',
      body: AcceptData, 
    });

    if (response.status === 200) {
      await getDoctorInfo()
      return { success: true, message: "Profile updated successfully!" };
    }

    return { 
      error: response.data, 
      success: false, 
      fields: data 
    };
  } catch (err) {
    return { 
      error:{ detail: "Server error. Please try again." }, 
      success: false, 
      fields: data 
    };
  }
}

export async function resetPasswordAction() {
  try {
    const session = await getSessionData();
    if (!session?.doctor?.email) {
      return { error: "User email not found in session.", success: false };
    }
    const response = await axiosWithRefresh(`auth/password/forgot/`, {
      method: 'POST',
      body: { email: session.doctor.email },
    });

    if (response.ok) {
      return { 
        success: true, 
        message: "A password reset link has been sent to your email.",
        t: response
      };
    }

    return { 
      error: {detail:response.data?.detail || "Failed to send reset link. Try again later."}, 
      success: false 
    };
  } catch (err) {
    return { 
      error: {detail:"An unexpected error occurred."}, 
      success: false 
    };
  }
}

export async function DeleteAccount(prevState, formData) {
  const session = await getSessionData();
  try {
    const response = await axiosWithRefresh(`doctors/${session?.doctor?.id}/`, {
      method: 'DELETE'
    });
    if (response?.status === 204) {
      deleteSessions()
    }
  } catch (error) {
    return { ok: false, error: "An unexpected error occurred" };
  }
}
import { axiosWithRefresh, updateSessionCredits } from "@/components/session";
import { getAuthToken } from "@/components/authToken";
import z from "zod";

let diagnosticId = null;

const diagnosticSchema = z.object({
  images:z
    .array(z.any())
    .min(1, 'At least one image is required')
    .max(5, 'Maximum 5 images allowed'),
  age:z
    .number()
    .int()
    .positive('Age must be a positive integer'),
  gender:z
    .enum(['male', 'female'], { errorMap: () => ({ message: 'Gender is required' }) }),
  blood_type:z
    .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], { errorMap: () => ({ message: 'Blood type is required' }) }),
  lesion_size_mm:z
    .number()
    .positive('Lesion size must be a positive number'),
  lesion_location:z
    .string()
    .min(2, 'Lesion location is required'),
  diameter_mm:z
    .number()
    .positive('Diameter must be a positive number'),
  asymmetry:z.boolean(),
  border_irregularity:z.boolean(),
  color_variation:z.boolean(),
  evolution:z.boolean(),
  note:z.string().nullable().optional(),
})

export async function diagnosticAction(prevState, formData) {
  diagnosticId = formData.get('diagnosticId');
  const data = {
    images: formData.getAll('images'),
    age: Number(formData.get('age')),
    gender: formData.get('gender'),
    blood_type: formData.get('blood_type'),
    lesion_size_mm: Number(formData.get('lesion_size_mm')),
    lesion_location: formData.get('lesion_location'),
    diameter_mm: Number(formData.get('diameter_mm')),
    asymmetry: formData.get('asymmetry') === 'on',
    border_irregularity: formData.get('border_irregularity') === 'on',
    color_variation: formData.get('color_variation') === 'on',
    evolution: formData.get('evolution') === 'on',
    note: formData.get('note'),
  };

  const imageFiles = formData.getAll('images');

  if (!imageFiles || imageFiles.length === 0 || imageFiles[0].size === 0) {
    return { 
      success: false, 
      massage: "At least one valid image is required.",
      fields: data
    };
  }

  if(data.images.length === 0) {
    return { success: false, massage: "No images found in request", fields: data };
  }

  const parsed = diagnosticSchema.safeParse(data);
  
  if (!parsed.success) {
    return {
      success: false,
      massage: "Validation failed", 
      errors: JSON.parse(JSON.stringify(parsed.error.flatten().fieldErrors)),
      fields: data
    };
  }

  const [doctor] = await getAuthToken();
  
  const body = new FormData()
  
  body.append('doctor', doctor.id)
  
  const fields = ['age', 'gender', 'blood_type', 'lesion_size_mm', 'lesion_location', 'diameter_mm', 'note'];
  fields.forEach(field => {
    const val = formData.get(field);
    if (val !== null) body.append(field, val);
  });
  
  ['asymmetry', 'border_irregularity', 'color_variation', 'evolution'].forEach(field => {
    body.append(field, formData.get(field) === 'on' ? 'true' : 'false');
  });
  
  formData.getAll('images').forEach((file, index) => {
    if (file && file.size > 0) {
      body.append(`images`, file); 
    }
  });

  try{
    const res = await axiosWithRefresh(`/${diagnosticId}-checkups/`, {
      method: 'POST',
      body: body, 
    });

    const data = res.data;

    if (!res.ok) {
      return { 
        success: false, 
        fields: data, 
        errors: res.error || {}, 
        massage: res.data?.detail || "Validation error from server", 
      };
    }

    await updateSessionCredits(-100);
    const finalResult = await pollResult({ taskId: data.id });

    if (finalResult.status === 'PENDING') {
      return { 
        success: false, 
        massage: "Analysis is taking too long. Please check later.", 
        fields: data 
      };
    }

    return {
      success: 'COMPLETED', 
      data: finalResult.data,
      errors: {},
      massage: "",
      fields: data 
    };
  }
  catch(err){
    return { 
      success: false, 
      errors: { server: "Connection failed" }, 
      massage: err.message || "An unexpected error occurred", 
      fields: data 
    };
  }
}

async function pollResult({taskId, maxRetries = 10, interval = 3000}) {
  for (let i = 0; i < maxRetries; i++) {
    const res = await axiosWithRefresh(`/${diagnosticId}-checkups/${taskId}/`);
    console.log(`/api/${diagnosticId}-checkups/${taskId}/`)
    if (res.ok) {
      const data = res.data;
      if (data.status === 'COMPLETED' || data.results) {
       return { status: 'SUCCESS', data: data }; 
      }
    }
    await new Promise(r => setTimeout(r, interval));
  }
  return { status: 'PENDING' };
}
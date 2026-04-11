import { supabase } from "./client";

/**
 * Uploads a file to the 'nayoori-images' bucket in Supabase Storage.
 * @param file The file to upload.
 * @param folder The folder inside the bucket (e.g., 'products', 'banners').
 * @returns The public URL of the uploaded image.
 */
export async function uploadImage(file: File, folder: string): Promise<string> {
  // 1. Create a unique filename to avoid collisions
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  // 2. Upload the file
  const { error: uploadError } = await supabase.storage
    .from('nayoori-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  // 3. Get the public URL
  const { data } = supabase.storage
    .from('nayoori-images')
    .getPublicUrl(filePath);

  if (!data.publicUrl) {
    throw new Error('Failed to generate public URL for uploaded image.');
  }

  return data.publicUrl;
}

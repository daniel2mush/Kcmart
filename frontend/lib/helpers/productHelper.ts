import { supabase } from '@/lib/supabase'

/* ---------------------------------------------------------------------------------*/

export async function deleteStorageFiles(paths: string[]) {
  const { error } = await supabase.storage.from('KCMart').remove(paths)

  if (error) {
    throw error
  }
}

/* ---------------------------------------------------------------------------------*/

/* ---------------------------------------------------------------------------------*/

export function getStoragePath(url: string) {
  return url.split('/KCMart/')[1]
}

/* ---------------------------------------------------------------------------------*/

export async function handleUploads(
  files: File[] | File | null | undefined,
  folder: 'images' | 'assets',
): Promise<string[]> {
  // 1. Normalize input to a single array type
  const fileArray = Array.isArray(files) ? files : files ? [files] : []

  // 2. Return early if empty
  if (fileArray.length === 0) return []

  // 3. Process all files safely
  return await Promise.all(
    fileArray.map(async (file) => {
      const filePath = `${folder}/${crypto.randomUUID()}-${file.name}`
      const { error } = await supabase.storage
        .from('KCMart')
        .upload(filePath, file)

      if (error) throw error

      const {
        data: { publicUrl },
      } = supabase.storage.from('KCMart').getPublicUrl(filePath)

      return publicUrl
    }),
  )
}

/* ---------------------------------------------------------------------------------*/

/* ---------------------------------------------------------------------------------*/
// export const toggleCategory = (
//   categoryId: string,
//   selectedCategories: string[],
//   setValue: (updated: string[]) => void,
// ) => {
//   const updated = selectedCategories.includes(categoryId)
//     ? selectedCategories.filter((id) => id !== categoryId)
//     : [...selectedCategories, categoryId]
//   setValue('categories', updated, { shouldValidate: true })
// }

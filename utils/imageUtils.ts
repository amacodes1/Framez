import * as FileSystem from 'expo-file-system';

export const convertImageToBase64 = async (uri: string): Promise<string> => {
  try {
    if (uri.startsWith('data:')) {
      return uri; // Already base64
    }
    
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
};

export const isValidImageUri = (uri: string): boolean => {
  if (!uri) return false;
  
  // Check if it's a valid HTTP/HTTPS URL
  if (uri.startsWith('http://') || uri.startsWith('https://')) {
    return true;
  }
  
  // Check if it's a base64 data URI
  if (uri.startsWith('data:image/')) {
    return true;
  }
  
  // Check if it's a local file URI
  if (uri.startsWith('file://')) {
    return true;
  }
  
  return false;
};
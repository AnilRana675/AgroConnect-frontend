import api from './api';

export interface PlantIdentificationResult {
  success: boolean;
  data?: {
    isPlant: boolean;
    scientificName: string;
    commonNames: string[];
    confidence: number;
    agriGuide: string;
  };
  error?: string;
}

class PlantService {
  /**
   * Identify a plant from base64 image data
   */
  async identifyPlant(imageBase64: string): Promise<PlantIdentificationResult> {
    try {
      const response = await api.post('/plant/identify', {
        imageBase64,
      });

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      console.error('Plant identification error:', error);

      // Handle the case where the backend returns an error object
      let errorMessage = 'Failed to identify plant';

      if (error.response?.data?.error) {
        const backendError = error.response.data.error;
        if (typeof backendError === 'string') {
          errorMessage = backendError;
        } else if (typeof backendError === 'object') {
          // Extract meaningful error messages from the complex error object
          const errorParts = [];
          if (backendError.plantId?.error)
            errorParts.push(`Plant.id: ${backendError.plantId.error}`);
          if (backendError.plantNet?.error)
            errorParts.push(`PlantNet: ${backendError.plantNet.error}`);
          if (backendError.geminiCheck?.error)
            errorParts.push(`Gemini Check: ${backendError.geminiCheck.error}`);
          if (backendError.geminiGuide?.error)
            errorParts.push(`Gemini Guide: ${backendError.geminiGuide.error}`);

          if (errorParts.length > 0) {
            errorMessage = errorParts.join('; ');
          } else {
            errorMessage = 'Service temporarily unavailable';
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Convert a File object to base64 string
   */
  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Remove the data URL prefix (data:image/png;base64,)
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Validate if the file is a valid image
   */
  validateImageFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return { valid: false, error: 'Please select a valid image file' };
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return { valid: false, error: 'Image file size must be less than 10MB' };
    }

    // Check supported formats
    const supportedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    if (!supportedTypes.includes(file.type)) {
      return { valid: false, error: 'Supported formats: JPEG, PNG, GIF, WebP' };
    }

    return { valid: true };
  }
}

const plantService = new PlantService();
export default plantService;

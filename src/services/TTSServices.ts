import api from './api';

/**
 * Check TTS processing status
 * @returns Promise<{isProcessing: boolean, queueLength: number}>
 */
export async function checkTTSStatus() {
  const response = await api.get('/tts/status');
  return response.data;
}

/**
 * Fetch TTS audio from backend with queue management
 * @param text The text to convert to speech
 * @param voice The voice to use (default: 'alloy')
 * @param onStatusUpdate Optional callback for status updates
 * @returns Promise<Blob> - The audio blob
 */
export async function fetchTTSAudio(
  text: string,
  voice = 'alloy',
  onStatusUpdate?: (status: {
    message: string;
    queuePosition?: number;
    estimatedWait?: number;
  }) => void,
): Promise<Blob> {
  // Check if TTS is already processing
  const status = await checkTTSStatus();

  if (status.isProcessing) {
    const queueMessage = `Please wait, TTS is processing. You are in queue position ${status.queueLength + 1}`;
    onStatusUpdate?.({
      message: queueMessage,
      queuePosition: status.queueLength + 1,
      estimatedWait: status.queueLength * 5,
    });
  }

  try {
    const response = await api.post(
      '/tts',
      { text, voice },
      {
        responseType: 'blob',
        timeout: 30000, // 30 second timeout for TTS processing
      },
    );

    // Check if response is actually an error message (not audio)
    const contentType = response.headers['content-type'];
    if (contentType && contentType.includes('application/json')) {
      // This is an error response, not audio
      const errorText = await response.data.text();
      const errorData = JSON.parse(errorText);
      throw new Error(
        errorData.message || errorData.error || 'TTS request failed',
      );
    }

    return response.data; // This will be a Blob
  } catch (error: any) {
    if (error.response?.status === 202) {
      // This is a "please wait" response
      const errorData = JSON.parse(await error.response.data.text());
      onStatusUpdate?.(errorData);
      throw new Error(errorData.message || 'TTS is busy, please wait');
    }
    throw error;
  }
}

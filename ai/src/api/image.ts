/**
 * Ai Image Generation, generate image from text
 * @param prompt - The prompt to generate the image
 * @returns The image URL or base64 image
 */
 export async function generateImage(prompt: string) {
    const startTime = Date.now();
    console.log('🎨 Starting AI image generation:', { prompt: prompt.substring(0, 100) + '...' });
  
    const config = globalThis.ywConfig?.ai_config?.image_generator;
    if (!config) {
      throw new Error('❌ API Error - Image generator config not found');
    }
  
    try {
      const response = await fetch('https://api.youware.com/public/v1/ai/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-YOUWARE'
        },
        body: JSON.stringify({
          model: config.model,
          prompt: config.prompt_template ? config.prompt_template({ description: prompt }) : prompt,
          response_format: config.response_format
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ API Error - Image generation failed:', errorData);
        throw new Error(`Image generation failed: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log('✅ AI API Response (Image Generation):', {
        imagesGenerated: data.data?.length || 0,
        processingTime: `${Date.now() - startTime}ms`
      });
  
      if (data?.data?.[0]) {
        const imageData = data.data[0];
        return imageData.b64_json
          ? `data:image/png;base64,${imageData.b64_json}`
          : imageData.url;
      }
      console.error('❌ API Error - Invalid response format', data);
      throw new Error('API Error - Invalid response format');
    } catch (error: any) {
      console.error('❌ API Error - Image generation failed:', error);
      throw error;
    }
  }
  
  /**
   * Ai Image Editing, edit image from image
   * @param prompt - The prompt to edit the image
   * @param uploadedImage - The image to edit
   * @returns The edited image URL or base64 image
   */
  export async function editImage(prompt: string, uploadedImage: File) {
    const startTime = Date.now();
    console.log('🎨 Starting AI image editing:', { prompt: prompt.substring(0, 100) + '...' });
  
    const config = globalThis.ywConfig?.ai_config?.image_generator;
    if (!config) {
      throw new Error('❌ API Error - Image editor config not found');
    }
  
    try {
      const formData = new FormData();
      formData.append('model', config.model);
      formData.append('prompt', config.prompt_template ? config.prompt_template({ description: prompt }) : prompt);
      formData.append('response_format', config.response_format);
      formData.append('image', uploadedImage);
  
      const response = await fetch('https://api.youware.com/public/v1/ai/images/edits', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer sk-YOUWARE' },
        body: formData
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ API Error - Image editing failed:', errorData);
        throw new Error(`Image editing failed: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log('✅ AI API Response (Image Edit):', {
        imagesGenerated: data.data?.length || 0,
        processingTime: `${Date.now() - startTime}ms`
      });
  
      if (data?.data?.[0]) {
        const imageData = data.data[0];
        return imageData.b64_json
          ? `data:image/png;base64,${imageData.b64_json}`
          : imageData.url;
      }
      console.error('❌ API Error - Invalid response format', data);
      throw new Error('API Error - Invalid response format');
    } catch (error: any) {
      console.error('❌ API Error - Image editing failed:', error);
      throw error;
    }
  }
  
export interface VideoTask {
    task_id: string;
    status: 'submitted' | 'queued' | 'in_progress' | 'completed' | 'failed';
    data?: { url: string }[];
    error?: any;
  }
  
  export async function generateVideo(prompt: string, duration?: string, withAudio?: boolean, aspectRatio?: string): Promise<VideoTask> {
    const config = globalThis.ywConfig?.ai_config?.video_generator;
    if (!config) {
      throw new Error('❌ API Error - Video generator config not found');
    }
  
    const formData = new FormData();
    
    // Construct parameters based on the model
    const params: any = {
      prompt: config.prompt_template ? config.prompt_template({ description: prompt }) : prompt,
      model: config.model,
    };
  
    if (config.model.includes('veo3')) {
      params.resolution = config.resolution || '720p';
      params.aspect_ratio = aspectRatio || config.aspect_ratio || '16:9';
      params.generate_audio = withAudio !== undefined ? withAudio : (config.generate_audio || false);
    } else if (config.model.includes('sora')) {
      // Map aspect ratio to size for sora-2
      // sora-2 supports '720x1280' (9:16) or '1280x720' (16:9)
      let size = config.size || '1280x720';
      if (aspectRatio === '16:9') {
        size = '1280x720';
      } else if (aspectRatio === '9:16') {
        size = '720x1280';
      }
      
      params.size = size;
      params.seconds = duration || config.seconds || '4';
      
      if (withAudio !== undefined) {
        params.generate_audio = withAudio;
      }
    }
  
    formData.append('generate_params', JSON.stringify(params));
  
    try {
      const response = await fetch('https://api.youware.com/public/v1/ai/videos/generations', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer sk-YOUWARE'
        },
        body: formData
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Video generation failed: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ API Error - Video generation failed:', error);
      throw error;
    }
  }
  
  export async function pollVideoStatus(taskId: string): Promise<VideoTask> {
    try {
      const response = await fetch(`https://api.youware.com/public/v1/ai/videos/generations/${taskId}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer sk-YOUWARE'
        }
      });
  
      if (!response.ok) {
        throw new Error(`Polling failed: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ API Error - Polling failed:', error);
      throw error;
    }
  }
  
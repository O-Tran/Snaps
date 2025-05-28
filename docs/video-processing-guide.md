# Video Processing Guide: Camera Recording & Upload

This guide explains how our app processes videos from two different sources: camera recordings and uploaded videos.

## Overview

Both camera recordings and uploaded videos use the same core process to extract images, they just differ in how the video is initially obtained.

## 1. Camera Recording Process

### Initial Video Capture
```typescript
const handleVideoRecorded = async (videoBlob: Blob) => {
  if (!projectTitle.trim()) {
    setProjectTitle(`Project ${new Date().toLocaleDateString()}`);
  }
  
  setIsProcessing(true);
  try {
    const videoFile = new File([videoBlob], 'recorded-video.webm', { 
      type: 'video/webm' 
    });
    const videoUrl = URL.createObjectURL(videoBlob);
    const project = await addProject(
      projectTitle.trim() || `Project ${new Date().toLocaleDateString()}`,
      videoUrl,
      {
        interval: settings.interval,
        resolution: settings.resolution
      }
    );
```

Think of this like:
1. Recording a video with your camera
2. Giving it a name (or using the current date if no name provided)
3. Creating a special link to access this video
4. Sending it to be processed into images

## 2. Video Upload Process

### Upload Validation
```typescript
const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB
const ACCEPTED_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

const validateFile = (file: File): boolean => {
  setError(null);
  
  if (!ACCEPTED_TYPES.includes(file.type)) {
    setError('Invalid file type. Please upload MP4, WebM, or MOV videos.');
    return false;
  }
  
  if (file.size > MAX_FILE_SIZE) {
    setError('File is too large. Maximum size is 200MB.');
    return false;
  }
  
  return true;
};
```

Think of this like a bouncer at a club who checks:
- If your video isn't too big (under 200MB)
- If your video is the right type (MP4, WebM, or QuickTime)

### Processing Uploaded Video
```typescript
const handleVideoUploaded = async (file: File) => {
  if (!projectTitle.trim()) {
    setProjectTitle(file.name.split('.')[0]);
  }
  
  setIsProcessing(true);
  try {
    const videoUrl = URL.createObjectURL(file);
    const project = await addProject(
      projectTitle.trim() || file.name.split('.')[0],
      videoUrl,
      {
        interval: settings.interval,
        resolution: settings.resolution
      }
    );
```

Think of this like:
1. Taking a video file from your computer
2. Using its filename as the project name (if no name provided)
3. Creating a special link to access this video
4. Sending it to be processed into images

## 3. Shared Image Extraction Process

Both camera recordings and uploaded videos use the exact same process to extract images:

```typescript
const extractImagesFromVideo = async (
  videoUrl: string, 
  options: VideoProcessingOptions,
  projectId: string
): Promise<Image[]> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.src = videoUrl;
    const images: Image[] = [];
    
    video.onloadedmetadata = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Calculate frames to extract
      const duration = video.duration * 1000;
      const interval = Math.max(options.interval, 500);
      const totalFrames = Math.floor(duration / interval);
      
      // Extract frames
      video.onseeked = () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const imageUrl = URL.createObjectURL(blob);
            images.push({
              id: `img-${Date.now()}-${framesProcessed}`,
              url: imageUrl,
              timestamp: video.currentTime,
              createdAt: new Date(),
              projectId: projectId,
            });
          }
        });
      };
    };
  });
};
```

Think of this process like:
1. Creating an invisible video player
2. Taking snapshots at regular intervals (every 200ms or more)
3. Saving each snapshot with information about when it was taken
4. Collecting all snapshots into one project

## How They Work Together

1. **Initial Difference**:
   - Camera recording: Creates video directly from camera stream
   - Upload: Gets video file from user's computer

2. **Shared Steps**:
   - Both create a URL for the video using `URL.createObjectURL`
   - Both call `addProject` with similar parameters
   - Both use the same `extractImagesFromVideo` function
   - Both store all extracted images in the same project structure

3. **Why It Works**:
   - Think of it like having one special machine that makes photo albums
   - The machine doesn't care where the video comes from
   - It just knows how to turn any video into a nice collection of photos
   - That's why both methods produce the same result!

## Key Points to Remember

1. Both methods use the same core processing code
2. The only real difference is how we get the video initially
3. All images from one video stay in one project because:
   - We create the project first
   - Extract all images
   - Add them all to that project
   - Save the project with all its images

It's like having two different ways to get photos to a photo album maker, but the photo album maker creates the same beautiful album regardless of how the photos arrived! 

----

Looking at both processes from the documentation:
For Camera Recording:
Apply to video-proces...

```typescript
;const videoFile = new File([videoBlob], 'recorded-video.webm', { 
  type: 'video/webm' 
});
const videoUrl = URL.createObjectURL(videoBlob);
```

For Upload:
Apply to video-proces...

```typescript
;const videoUrl = URL.createObjectURL(file); '''
```

Yes, both the recorded video and uploaded video end up in the same place! In both cases:
1. The videos are converted to URLs using URL.createObjectURL()
2. These URLs are then passed to the same addProject() function
3. Both go through the identical image extraction process using extractImagesFromVideo()

## The only differences are:
- Recorded videos are always in WebM format (video/webm)
- Uploaded videos can be MP4, WebM, or QuickTime (MOV) formats
- Recorded videos get a fixed filename ('recorded-video.webm') while uploaded videos keep their original filename
But in terms of storage and processing, they are handled exactly the same way after the initial creation/upload step. Both types of videos are processed through the same pipeline and stored in the same way within the application.
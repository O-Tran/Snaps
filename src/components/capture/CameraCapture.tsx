import React, { useState, useRef, useEffect } from 'react';
import { Video, StopCircle, Timer } from 'lucide-react';
import Button from '../ui/Button';

interface CameraCaptureProps {
  onVideoRecorded: (videoBlob: Blob) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onVideoRecorded }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  
  // Initialize camera
  const initCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setError(null);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access camera. Please ensure you have granted camera permissions.');
    }
  };
  
  useEffect(() => {
    initCamera();
    
    // Cleanup
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);
  
  const startRecording = () => {
    // Start with a 3 second countdown
    setCountdown(3);
    const countdownInterval = window.setInterval(() => {
      setCountdown(prevCount => {
        if (prevCount === null || prevCount <= 1) {
          clearInterval(countdownInterval);
          beginRecording();
          return null;
        }
        return prevCount - 1;
      });
    }, 1000);
  };
  
  const beginRecording = () => {
    if (!stream) return;
    
    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(stream);
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const videoBlob = new Blob(chunksRef.current, { type: 'video/webm' });
      onVideoRecorded(videoBlob);
      setDuration(0);
    };
    
    // Start recording
    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
    setIsRecording(true);
    
    // Start duration timer
    timerRef.current = window.setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // Stop all tracks in the stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      }
    }
  };
  
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-3xl rounded-lg overflow-hidden shadow-lg bg-black">
        {error ? (
          <div className="h-[300px] md:h-[400px] flex items-center justify-center text-white p-4 text-center">
            <p>{error}</p>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-[300px] md:h-[400px] object-cover"
          />
        )}
        
        {countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-6xl text-white font-bold animate-pulse">
              {countdown}
            </div>
          </div>
        )}
        
        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center bg-black/70 text-white px-3 py-1 rounded-full">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse mr-2"></div>
            <span className="text-sm font-medium">{formatDuration(duration)}</span>
          </div>
        )}
      </div>
      
      <div className="mt-6 flex justify-center space-x-4">
        {!isRecording ? (
          <Button
            onClick={startRecording}
            variant="primary"
            size="lg"
            disabled={!!error || countdown !== null}
            leftIcon={<Video className="w-5 h-5" />}
          >
            Start Recording
          </Button>
        ) : (
          <Button
            onClick={stopRecording}
            variant="danger"
            size="lg"
            leftIcon={<StopCircle className="w-5 h-5" />}
          >
            Stop Recording
          </Button>
        )}
      </div>
      
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
        <Timer className="inline w-4 h-4 mr-1" />
        Recordings are limited to 30 minutes and will be automatically processed based on your settings.
      </p>
    </div>
  );
};

export default CameraCapture;
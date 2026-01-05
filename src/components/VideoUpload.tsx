import React, { useState, useCallback } from 'react';
import { Upload, X, Video, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { logger } from '@/lib/logger';

interface VideoUploadProps {
  onVideoUploaded?: (videoUrl: string) => void;
}

export function VideoUpload({ onVideoUploaded }: VideoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const videoFile = files.find(file => file.type === 'video/mp4');
    
    if (videoFile) {
      handleVideoUpload(videoFile);
    } else {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an MP4 video file.",
      });
    }
  }, [toast]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'video/mp4') {
      handleVideoUpload(file);
    } else {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an MP4 video file.",
      });
    }
  }, [toast]);

  const handleVideoUpload = async (file: File) => {
    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload a video file smaller than 100MB.",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please sign in to upload videos.",
        });
        return;
      }

      const fileExt = 'mp4';
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('videos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Generate signed URL with 1 hour expiration for private bucket
      const { data: signedUrlData, error: urlError } = await supabase.storage
        .from('videos')
        .createSignedUrl(data.path, 3600); // 1 hour expiry

      if (urlError) throw urlError;

      toast({
        title: "Upload successful",
        description: "Your video has been uploaded successfully.",
      });

      onVideoUploaded?.(signedUrlData.signedUrl);
      
    } catch (error) {
      logger.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading your video. Please try again.",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Card className="p-6">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isUploading ? (
          <div className="space-y-4">
            <Video className="w-12 h-12 mx-auto text-primary animate-pulse" />
            <div>
              <p className="text-sm font-medium">Uploading video...</p>
              <Progress value={uploadProgress} className="mt-2" />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
            <div>
              <p className="text-lg font-medium">Upload Video</p>
              <p className="text-sm text-muted-foreground">
                Drag and drop your MP4 file here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Maximum file size: 100MB
              </p>
            </div>
            <div>
              <input
                type="file"
                accept="video/mp4"
                onChange={handleFileSelect}
                className="hidden"
                id="video-upload"
              />
              <Button asChild>
                <label htmlFor="video-upload" className="cursor-pointer">
                  Choose File
                </label>
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="text-xs text-muted-foreground">
            <p className="font-medium">Upload Requirements:</p>
            <ul className="mt-1 space-y-1">
              <li>• File format: MP4 only</li>
              <li>• Maximum size: 100MB</li>
              <li>• Authentication required</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}
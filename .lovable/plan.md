

# Replace the Partner Video — Direct Import Approach

## The problem so far

The previous two attempts tried to copy your uploaded video over `src/assets/partner-video.mp4`, but the file copy appears to have failed silently both times. The old video content is still playing. Only the aria-label text (invisible to you) was actually changed.

## What will be done differently this time

Instead of overwriting an existing file, the code will import your uploaded video directly using its upload path. This bypasses the file copy step entirely and is more reliable.

## Steps

**1. Update the import in `BrandVideoSection.tsx` (line 1)**
- Change `import partnerVideo from "@/assets/partner-video.mp4"` to import directly from the uploaded file path

**2. Delete the old unused video files**
- Remove `src/assets/partner-video.mp4` (the old file that failed to overwrite)
- Remove `src/assets/goodbody-animation.mp4` (the original GoodBody video that is no longer needed)

**3. Verify the video plays in the preview**
- Confirm the left/first video in the "Featured Partners" section now shows your new video content

## After this is done
You mentioned you have a new Medichecks video to upload as well — we will handle that as a separate step using the same direct approach.


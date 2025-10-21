import React, { useState, useCallback } from 'react';
import { correctImageLighting, enhanceImage } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import ImageDisplay from './components/ImageDisplay';
import Button from './components/Button';
import { DownloadIcon } from './components/icons';

const App: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<File | null>(null);
    const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
    const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageChange = (file: File | null) => {
        if (file) {
            setOriginalImage(file);
            const url = URL.createObjectURL(file);
            setOriginalImageUrl(url);
            setEditedImageUrl(null); // Clear previous result
            setError(null);
        }
    };

    const handleCorrection = useCallback(async () => {
        if (!originalImage) return;

        setIsLoading(true);
        setError(null);
        setEditedImageUrl(null);

        try {
            const correctionPrompt = `Transform the image to meet passport photo specifications.
- Dimensions: Crop to a 35mm x 35mm equivalent (a 1:1 square aspect ratio), centered on the face with proper headroom.
- Background: Change the background to a solid white or off-white.
- Composition: Ensure shoulders and both ears are clearly visible and the subject is looking directly at the camera. The pose must be formal.
The output must be only the corrected image.`;

            // Step 1: Correct the image to passport specs
            const correctedImageBase64 = await correctImageLighting(originalImage, correctionPrompt);

            const enhancementPrompt = `Please fix the lighting and exposure in this photo. The subject’s face is currently underexposed and appears too dark, while the white background is overexposed and too bright.

Adjust the image so that:

The face is evenly lit, bright, and naturally toned, with realistic skin color and clear facial details.

The background highlights are reduced, especially in white or bright areas, so it looks soft and not distracting.

Overall lighting should feel balanced, warm, and natural, avoiding flat or harsh contrast.

After fixing the lighting, crop the image so that:

The face is centered in the frame.

The face fills about 70–80% of the total image area, ensuring it’s clearly visible and the main focus.

Maintain a natural headroom (not cutting off the top of the head) and keep proportions natural.

Final goal: A clear, well-lit portrait with balanced exposure and a centered, close-up crop that highlights the face attractively.`;
            
            // Step 2: Enhance the lighting of the corrected image
            const finalImageBase64 = await enhanceImage(correctedImageBase64, enhancementPrompt);

            setEditedImageUrl(`data:image/png;base64,${finalImageBase64}`);
        } catch (e) {
            console.error(e);
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
            setError(`Failed to process image. ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    }, [originalImage]);

    const handleDownload = useCallback(() => {
        if (!editedImageUrl) return;

        const image = new Image();
        image.crossOrigin = 'anonymous';

        image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                setError('Could not process image for download.');
                return;
            }

            ctx.drawImage(image, 0, 0);
            const jpegUrl = canvas.toDataURL('image/jpeg', 0.95);

            const link = document.createElement('a');
            link.href = jpegUrl;
            link.download = 'passport-photo.jpeg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

        image.onerror = () => {
            setError('Failed to load the edited image for download.');
        };

        image.src = editedImageUrl;
    }, [editedImageUrl]);


    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 sm:p-8 font-sans">
            <header className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-2">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                        AI Passport Photo Creator
                    </span>
                </h1>
                <p className="text-lg text-gray-400">Upload a photo and let AI create a perfectly lit, passport-ready image.</p>
            </header>

            <main className="w-full max-w-6xl flex flex-col items-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-8">
                    <div className="w-full">
                        <h2 className="text-2xl font-bold mb-4 text-center text-gray-300">Original Image</h2>
                        {originalImageUrl ? (
                            <ImageDisplay src={originalImageUrl} alt="Original Upload" />
                        ) : (
                            <ImageUploader onImageChange={handleImageChange} />
                        )}
                    </div>
                    <div className="w-full flex flex-col">
                        <h2 className="text-2xl font-bold mb-4 text-center text-gray-300">Corrected Image</h2>
                         <div className="flex-grow">
                            <ImageDisplay src={editedImageUrl} alt="Corrected Image" isLoading={isLoading} />
                         </div>
                         {editedImageUrl && !isLoading && (
                            <div className="mt-4">
                                <Button onClick={handleDownload} disabled={isLoading}>
                                    <DownloadIcon className="w-5 h-5 mr-2" />
                                    Download JPEG
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {originalImage && !editedImageUrl && (
                    <div className="w-full max-w-sm flex flex-col items-center">
                        <Button onClick={handleCorrection} disabled={isLoading}>
                            {isLoading ? 'Processing...' : 'Create Passport Photo'}
                        </Button>
                    </div>
                )}
                 
                 {error && (
                    <div className="mt-6 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-center max-w-xl">
                        <p className="font-semibold">Error</p>
                        <p>{error}</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;
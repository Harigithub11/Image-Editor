
import React from 'react';
import { PhotoIcon } from './icons';
import Spinner from './Spinner';

interface ImageDisplayProps {
    src: string | null;
    alt: string;
    isLoading?: boolean;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ src, alt, isLoading = false }) => {
    return (
        <div className="w-full aspect-square bg-gray-800 rounded-xl flex justify-center items-center overflow-hidden shadow-lg">
            {isLoading ? (
                <div className="flex flex-col items-center">
                   <Spinner />
                   <p className="mt-4 text-gray-400">Enhancing your image...</p>
                </div>
            ) : src ? (
                <img src={src} alt={alt} className="w-full h-full object-contain" />
            ) : (
                <div className="text-center text-gray-500">
                    <PhotoIcon className="w-20 h-20 mx-auto" />
                    <p className="mt-2">Corrected image will appear here</p>
                </div>
            )}
        </div>
    );
};

export default ImageDisplay;

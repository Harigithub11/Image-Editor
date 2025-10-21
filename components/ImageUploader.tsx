
import React, { useCallback, useRef } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
    onImageChange: (file: File | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onImageChange(file);
        }
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const file = event.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            onImageChange(file);
        }
    }, [onImageChange]);

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };


    return (
        <div 
            className="w-full aspect-square bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-xl flex flex-col justify-center items-center text-center p-6 cursor-pointer hover:bg-gray-800 hover:border-purple-500 transition-all duration-300"
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />
            <UploadIcon className="w-16 h-16 text-gray-500 mb-4" />
            <p className="text-lg font-semibold text-gray-300">Click to upload or drag & drop</p>
            <p className="text-sm text-gray-500">PNG, JPG, WEBP, etc.</p>
        </div>
    );
};

export default ImageUploader;

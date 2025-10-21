
import React from 'react';
import Spinner from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, disabled, ...props }) => {
    const isLoading = typeof children === 'string' && children.includes('...');

    return (
        <button
            className="w-full flex justify-center items-center text-lg font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
            disabled={disabled}
            {...props}
        >
            {isLoading && <Spinner className="mr-2" />}
            {children}
        </button>
    );
};

export default Button;

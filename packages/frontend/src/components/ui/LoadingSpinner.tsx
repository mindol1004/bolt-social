type SpinnerSize = 'small' | 'medium' | 'large';

type LoadingSpinnerProps = {
  size?: SpinnerSize;
  className?: string;
};

export default function LoadingSpinner({ size = 'medium', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'h-4 w-4 border-2',
    medium: 'h-8 w-8 border-3',
    large: 'h-12 w-12 border-4',
  };
  
  return (
    <div className={`${className} flex justify-center items-center`}>
      <div
        className={`${sizeClasses[size]} rounded-full border-gray-300 border-t-primary-500 animate-spin`}
      />
    </div>
  );
}
"use client";
import { Button as BaseButton } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'gradient';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function CustomButton({
  variant = 'default',
  size = 'default',
  loading = false,
  children,
  className,
  disabled,
  ...props
}: CustomButtonProps) {
  const gradientVariant = variant === 'gradient' ? 
    'relative overflow-hidden bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.98] border-0 animate-gradient-x' :
    '';

  return (
    <BaseButton
      variant={variant === 'gradient' ? 'default' : variant}
      size={size}
      disabled={disabled || loading}
      className={cn(
        'relative overflow-hidden group transition-all duration-300',
        gradientVariant,
        variant !== 'gradient' && 'hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 active:translate-y-0',
        className
      )}
      {...props}
    >
      {/* Shimmer effect for gradient variant */}
      {variant === 'gradient' && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </>
      )}
      
      {/* Ripple effect */}
      <div className="absolute inset-0 rounded-md opacity-0 group-active:opacity-100 bg-white/20 animate-ping" />
      
      {loading && (
        <Loader2 className="h-4 w-4 mr-2 animate-spin relative z-10" />
      )}
      
      <span className={cn(
        "relative z-10 flex items-center justify-center transition-all duration-200",
        loading && "opacity-80"
      )}>
        {children}
      </span>
      
      {/* Enhanced glow effect for gradient variant */}
      {variant === 'gradient' && (
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-pink-500/50 rounded-lg blur opacity-0 group-hover:opacity-75 transition-opacity duration-500 -z-10 animate-pulse" />
      )}
    </BaseButton>
  );
}
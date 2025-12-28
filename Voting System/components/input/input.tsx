"use client";
import { Input as BaseInput } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

export default function CustomInput({
  label,
  icon: Icon,
  error,
  helperText,
  className,
  containerClassName,
  ...props
}: CustomInputProps) {
  return (
    <div className={cn('space-y-2', containerClassName)}>
      {label && (
        <Label htmlFor={props.id} className="text-sm font-medium text-foreground">
          {label}
        </Label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
            <Icon className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
          </div>
        )}
        <BaseInput
          {...props}
          className={cn(
            'relative bg-background/50 backdrop-blur-sm border-border/40 focus:border-primary/60 focus:ring-primary/20 transition-all duration-300 hover:border-border/60',
            Icon && 'pl-10',
            error && 'border-destructive focus:border-destructive focus:ring-destructive/20',
            className
          )}
        />
        <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
      {error && (
        <p className="text-sm text-destructive animate-in slide-in-from-left-1 duration-200">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">
          {helperText}
        </p>
      )}
    </div>
  );
}
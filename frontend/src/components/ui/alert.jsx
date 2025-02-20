import React from 'react';
import { twMerge } from "tailwind-merge";

const Alert = React.forwardRef(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={twMerge(
      "relative w-full rounded-lg border p-4",
      variant === "default" ? "bg-background text-foreground" : "",
      variant === "destructive" ? "border-destructive/50 text-destructive dark:border-destructive" : "",
      className
    )}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={twMerge("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertDescription };
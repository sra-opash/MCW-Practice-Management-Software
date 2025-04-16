"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@mcw/utils";

type FormFieldContextValue = {
  id?: string;
  name?: string;
  value?: string;
  onChange?: (name: string, value: string) => void;
  error?: string;
};

// FormField Context for managing form items
const FormFieldContext = React.createContext<FormFieldContextValue | null>(
  null,
);

type FormFieldProps = {
  name: string;
  children: React.ReactNode;
  value?: string;
  onChange?: (name: string, value: string) => void;
  error?: string;
};

// Custom form field component
const FormField: React.FC<FormFieldProps> = ({
  name,
  children,
  value,
  onChange,
  error,
}) => {
  return (
    <FormFieldContext.Provider value={{ name, value, onChange, error }}>
      {children}
    </FormFieldContext.Provider>
  );
};

// Custom FormItem component
const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId();
  return (
    <FormFieldContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormFieldContext.Provider>
  );
});

FormItem.displayName = "FormItem";

// Custom FormLabel component
const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const fieldContext = React.useContext(FormFieldContext);
  const id = fieldContext?.id;

  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(className)}
      htmlFor={id}
      {...props}
    />
  );
});

FormLabel.displayName = "FormLabel";

// Custom FormControl component
const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const fieldContext = React.useContext(FormFieldContext);
  const id = fieldContext?.id;

  return <Slot ref={ref} id={id} {...props} />;
});

FormControl.displayName = "FormControl";

// Custom FormDescription component
const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const fieldContext = React.useContext(FormFieldContext);
  const id = fieldContext?.id;

  return (
    <p
      ref={ref}
      id={`${id}-description`}
      className={cn("text-[0.8rem] text-muted-foreground", className)}
      {...props}
    />
  );
});

FormDescription.displayName = "FormDescription";

// Custom FormMessage component for showing error messages
const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const fieldContext = React.useContext(FormFieldContext);
  const id = fieldContext?.id;

  return (
    <p
      ref={ref}
      id={`${id}-error`}
      className={cn("text-[0.8rem] font-medium text-destructive", className)}
      {...props}
    >
      {children}
    </p>
  );
});

FormMessage.displayName = "FormMessage";

type FormData = Record<string, string>;
type FormErrors = Record<string, string>;

interface FormProps {
  children: React.ReactNode;
  onSubmit: (data: FormData) => void;
}

// Form component
const Form = ({ children, onSubmit }: FormProps) => {
  const [formState, setFormState] = React.useState<FormData>({});
  const [errors, setErrors] = React.useState<FormErrors>({});

  const handleChange = (name: string, value: string) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors: FormErrors = {};

    for (const field in formState) {
      if (!formState[field]) {
        validationErrors[field] = "This field is required";
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      onSubmit(formState);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {React.Children.map(children, (child) => {
        if (
          React.isValidElement<FormFieldProps>(child) &&
          child.type === FormField &&
          typeof child.props.name === "string"
        ) {
          return React.cloneElement(child, {
            value: formState[child.props.name],
            onChange: handleChange,
            error: errors[child.props.name],
          } as Partial<FormFieldProps>);
        }
        return child;
      })}
    </form>
  );
};

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
};

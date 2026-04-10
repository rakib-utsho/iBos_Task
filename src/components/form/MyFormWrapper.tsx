/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { FieldValues, FormProvider, Resolver, useForm, useWatch } from "react-hook-form"; // Fixed missing useWatch import

interface MyFormWrapperProps<TFieldValues extends FieldValues> {
  onSubmit: (data: TFieldValues) => void;
  className?: string;
  children: React.ReactNode;
  defaultValues?: Partial<TFieldValues>;
  resolver?: Resolver<TFieldValues, any>;
  setFormState?: (data: Partial<TFieldValues>) => void; // Optional state setter function
}

const MyFormWrapper = <TFieldValues extends FieldValues>({
  onSubmit,
  className,
  children,
  defaultValues,
  resolver,
  setFormState, // Optional setter function
}: MyFormWrapperProps<TFieldValues>) => {
  const methods = useForm<TFieldValues>({
    defaultValues,
    resolver,
  });
  const { handleSubmit, reset, control } = methods;

  // Watch the entire form state
  const formValues = useWatch({ control });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  // Update external state on change
  useEffect(() => {
    if (setFormState) {
      setFormState(formValues);
    }
  }, [formValues, setFormState]);

  const submit = (data: TFieldValues) => {
    onSubmit(data);
    reset();
  };

  return (
    <FormProvider {...methods}>
      <form className={cn("", className)} onSubmit={handleSubmit(submit)}>
        {children}
      </form>
    </FormProvider>
  );
};

export default MyFormWrapper;

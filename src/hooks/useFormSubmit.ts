import { useState } from 'react';

type SubmitFunction<T, R = unknown> = (data: T) => Promise<R>;

interface UseFormSubmitResult<T, R> {
  handleSubmit: (data: T) => Promise<R>;
  isSubmitting: boolean;
  error: string | null;
  data: R | null;
  successMessage: string | null;
}

export function useFormSubmit<T, R = unknown>(
  submitFn: SubmitFunction<T, R>,
  onSuccess?: (data: R) => void,
  onError?: (error: Error) => void,
  successMsg?: string
): UseFormSubmitResult<T, R> {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<R | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (formData: T): Promise<R> => {
    console.log('🚀 [useFormSubmit] Starting form submission');
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      console.log('📤 [useFormSubmit] Calling submit function with data:', formData);
      const result = await submitFn(formData);
      console.log('✅ [useFormSubmit] Submit function completed successfully:', result);
      
      setData(result);
      setSuccessMessage(successMsg || 'Operation completed successfully');
      onSuccess?.(result);
      return result;
    } catch (err) {
      console.error('❌ [useFormSubmit] Submit function failed:', err);
      console.error('❌ [useFormSubmit] Error type:', typeof err);
      console.error('❌ [useFormSubmit] Error constructor:', err?.constructor?.name);
      
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('❌ [useFormSubmit] Processed error message:', errorMessage);
      
      setError(errorMessage);
      onError?.(err as Error);
      throw err;
    } finally {
      console.log('🏁 [useFormSubmit] Form submission completed');
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting,
    error,
    data,
    successMessage
  };
}

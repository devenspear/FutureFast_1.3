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
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const result = await submitFn(formData);
      setData(result);
      setSuccessMessage(successMsg || 'Operation completed successfully');
      onSuccess?.(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      onError?.(err as Error);
      throw err;
    } finally {
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

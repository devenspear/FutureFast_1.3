import { useState } from 'react';

type SubmitFunction<T> = (data: T) => Promise<any>;

export function useFormSubmit<T>(
  submitFn: SubmitFunction<T>,
  onSuccess?: (data: any) => void,
  onError?: (error: Error) => void
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const handleSubmit = async (formData: T) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await submitFn(formData);
      setData(result);
      if (onSuccess) onSuccess(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      if (onError) onError(err as Error);
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
  };
}

'use client';

import { useState, useEffect, useRef } from 'react';

interface UseFormInputProps {
  initialValue?: string;
  validate?: (value: string) => string | undefined;
  autoFocus?: boolean;
}

export function useFormInput({ initialValue = '', validate, autoFocus }: UseFormInputProps = {}) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (validate) {
      const validationError = validate(newValue);
      setError(validationError);
    }
  };

  return {
    value,
    setValue,
    error,
    setError,
    inputRef,
    handleChange,
    inputProps: {
      ref: inputRef,
      value,
      onChange: handleChange,
    },
  };
}
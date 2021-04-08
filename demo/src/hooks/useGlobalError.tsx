import React, { useContext, useState, createContext } from "react";

interface Error {
  title: string;
  message: string;
}

interface Context {
  errors: Array<Error>;
  addError: (error: Error) => void;
  clearErrors: () => void;
}

export const ErrorContext = createContext(null);

export const ErrorProvider = ({ children }) => {
  const [errors, setErrors] = useState([]);

  const addError = (error: Error) => setErrors(errors.concat([error]));
  const clearErrors = () => setErrors([]);

  return (
    <ErrorContext.Provider value={{ errors, addError, clearErrors }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useGlobalError = (): Context => useContext(ErrorContext);

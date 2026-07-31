import { useState } from "react";

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window === "undefined") {
        return initialValue;
      }
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      if (typeof window === "undefined") {
        return;
      }
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(`Error setting localStorage key "${key}":`, error);
    }
  };

  const setTitle = (title) => {
    try {
      if (typeof window === "undefined") {
        return;
      }
      window.localStorage.setItem("title", JSON.stringify(title));
    } catch (error) {
      console.log(`Error setting localStorage key "title":`, error);
    }
  };

  const getTitle = () => {
    try {
      if (typeof window === "undefined") {
        return null;
      }
      const item = window.localStorage.getItem("title");
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.log(`Error reading localStorage key "title":`, error);
      return null;
    }
  };

  return [storedValue, setValue, { setTitle, getTitle }];
};

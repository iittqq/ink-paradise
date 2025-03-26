import { useState } from "react";

export const useThemeMode = () => {
  const [theme, setTheme] = useState<number>(0);

  const setMode = (mode: number) => {
    window.localStorage.setItem("theme", mode.toString());
    setTheme(mode);
  };

  const themeToggler = (newTheme: number) => setMode(newTheme);

  return { theme, themeToggler };
};

export default useThemeMode;

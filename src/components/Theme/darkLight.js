import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  return (
    <button className="btn btn-primary" onClick={toggleTheme}>
      Switch to {theme == "light" ? "Dark" : "Light"} Mode
    </button>
  );
};

export default ThemeToggle;

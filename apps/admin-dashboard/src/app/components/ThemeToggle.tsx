import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="p-2 border rounded-xl">
      {isDark ? <Sun /> : <Moon />}
    </button>
  );
}

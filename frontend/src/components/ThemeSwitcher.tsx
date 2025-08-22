import { useThemeStore } from "@/store/useThemeStore";

const themes = ["light", "dark", "cupcake", "business", "emerald", "dracula"];

export default function ThemeSwitcher() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  return (
    <select
      className="select select-bordered"
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
    >
      {themes.map((t) => (
        <option key={t} value={t}>
          {t}
        </option>
      ))}
    </select>
  );
}

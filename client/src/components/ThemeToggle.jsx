import React from "react";

export default function ThemeToggle({ theme, setTheme }) {
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      style={{
        padding: "0.5rem 1rem",
        borderRadius: "5px",
        border: "none",
        background: theme === "dark" ? "#6a0dad" : "#0d1b2a",
        color: "#fff",
        fontWeight: "bold",
      }}
    >
      {theme === "dark" ? "Light Mode" : "Dark Mode"}
    </button>
  );
}
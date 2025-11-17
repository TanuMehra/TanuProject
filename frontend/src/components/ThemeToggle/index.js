import React from "react";

export default function ThemeToggle({ theme, toggleTheme }) {
  return React.createElement(
    "button",
    { className: "theme-btn", onClick: toggleTheme },
    theme === "light" ? "Switch Dark" : "Switch Light"
  );
}

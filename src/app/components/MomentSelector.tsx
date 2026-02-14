"use client";

import { useEffect, useState } from "react";
import { MomentType, momentOptions } from "../data/questions";

interface MomentSelectorProps {
  value: MomentType;
  onChange: (value: MomentType) => void;
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    justifyContent: "center",
  },
  button: {
    padding: "8px 16px",
    borderRadius: 9999,
    fontSize: 14,
    fontWeight: 300,
    border: "1px solid #E9F0F7",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.25s ease, border-color 0.25s ease",
  },
  selected: {
    backgroundColor: "#5AA9E6",
    color: "white",
    borderColor: "transparent",
    boxShadow: "0 1px 2px rgba(90, 169, 230, 0.2)",
  },
  unselected: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    color: "#1C1C1C",
  },
  pulse: {
    transform: "scale(1.06)",
    boxShadow: "0 0 8px rgba(90, 169, 230, 0.25)",
  },
};

export default function MomentSelector({ value, onChange }: MomentSelectorProps) {
  const [justChanged, setJustChanged] = useState<string | null>(null);

  useEffect(() => {
    setJustChanged(value);
    const timer = setTimeout(() => setJustChanged(null), 400);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div style={styles.container}>
      {momentOptions.map((option) => {
        const isSelected = value === option.value;
        const shouldPulse = isSelected && justChanged === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value as MomentType)}
            style={{
              ...styles.button,
              ...(isSelected ? styles.selected : styles.unselected),
              ...(shouldPulse ? styles.pulse : {}),
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}


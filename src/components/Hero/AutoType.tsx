import { useEffect, useState } from "react";
import { RandomizedTextEffect } from "../ui/text-randomized";
import { useTheme } from "../../context/ThemeProvider";

const AutoType = () => {
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const { theme } = useTheme();
  const titles = ["Developer.", "Designer."];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTitleIndex((prev) => (prev + 1) % titles.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [titles.length]);

  return (
    <div>
      <h1
        className={`relative z-10  leading-tight ${
          theme === "dark" ? "text-[#a8e6cf]" : "text-[#0C0D12]"
        }  `}
      >
        <RandomizedTextEffect text={titles[currentTitleIndex]} />
      </h1>
    </div>
  );
};

export default AutoType;

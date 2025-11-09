import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeProvider";
import {
  FaLightbulb,
  // FaRegLightbulb
} from "react-icons/fa";

const UpDown: React.FC = () => {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");
  const { theme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      setScrollDirection(progress <= 0.5 ? "down" : "up");
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const scrollToBottom = () =>
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });

  const handleClick = () => {
    if (scrollDirection === "down") {
      scrollToBottom();
    } else {
      scrollToTop();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-5 md:right-5 z-50">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className="relative block p-0 border-0 bg-transparent cursor-pointer"
        style={{ outline: "none", boxShadow: "none" }}
        aria-label={
          scrollDirection === "up" ? "Scroll to top" : "Scroll to bottom"
        }
      >
        {/* GLOW EFFECT — ONLY IN DARK MODE */}
        {theme === "dark" && (
          <>
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full blur-3xl"
              style={{ background: "rgba(250, 204, 21, 0.5)" }}
            />
            <motion.div
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 rounded-full blur-2xl"
              style={{ background: "rgba(250, 204, 21, 0.6)" }}
            />
            <motion.div
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute inset-4 rounded-full blur-xl"
              style={{ background: "rgba(250, 204, 21, 0.7)" }}
            />
          </>
        )}

        {/* BULB — FontAwesome with proper wrapper */}
        <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
          {theme === "dark" ? (
            <FaLightbulb className="w-10 h-10 md:w-12 md:h-12 text-[#FACC15] drop-shadow(0 0 12px rgba(250, 204, 21, 0.8))" />
          ) : (
            <FaLightbulb
              // <FaRegLightbulb
              className="w-10 h-10 md:w-12 md:h-12 text-[#FACC15] drop-shadow(0 0 16px rgba(250, 204, 21, 0.9))"
            />
          )}
        </div>
      </motion.button>
    </div>
  );
};

export default UpDown;

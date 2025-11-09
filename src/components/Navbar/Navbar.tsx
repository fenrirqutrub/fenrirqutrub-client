import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router";
import "./Navbar.css";
import { useTheme } from "../../context/ThemeProvider";
import DayNightToggle from "./DayNightToggle";

// ------------------ TYPES ------------------

type MenuItemName =
  | "home"
  | "projects"
  | "articles"
  | "articles/category/:category"
  | "articles/detail/:slug";

interface MenuItem {
  readonly name: MenuItemName;
  readonly path: string;
}

interface NavbarState {
  mobileMenuOpen: boolean;
  scrolled: boolean;
}

// ------------------ MENU ITEMS ------------------

const MENU_ITEMS: readonly MenuItem[] = [
  { name: "home", path: "/" },
  { name: "projects", path: "/projects" },
  { name: "articles", path: "/articles/category" },
] as const;

// ------------------ ANIMATION VARIANTS ------------------

const OVERLAY_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3, delay: 0.2 } },
} as const;

const MENU_CONTAINER_VARIANTS = {
  hidden: {
    clipPath: "circle(0% at 100% 0%)",
    transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
  },
  visible: {
    clipPath: "circle(150% at 100% 0%)",
    transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] },
  },
  exit: {
    clipPath: "circle(0% at 100% 0%)",
    transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
  },
} as const;

const MENU_ITEMS_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
} as const;

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 30, rotateX: -90 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] },
  },
} as const;

const CLOSE_BUTTON_VARIANTS = {
  hidden: { opacity: 0, rotate: -180, scale: 0 },
  visible: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: { delay: 0.4, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
  },
} as const;

// ------------------ THEME COLORS ------------------

const THEME_COLORS = {
  dark: {
    bg: {
      primary: "#0D0F14",
      secondary: "#171B1F",
      mobile: "#0C0D12",
    },
    text: {
      primary: "#F8F9FA",
      secondary: "#94A3B8",
    },
    border: "rgba(248, 249, 250, 0.1)",
    hover: "rgba(248, 249, 250, 0.05)",
  },
  light: {
    bg: {
      primary: "#FFFFFF",
      secondary: "#F1F5F9",
      mobile: "#F8FAFC",
    },
    text: {
      primary: "#0F172A",
      secondary: "#64748B",
    },
    border: "oklch(70.7% 0.022 261.325)",
    hover: "rgba(15, 23, 42, 0.05)",
  },
} as const;

// ------------------ COMPONENT ------------------

const Navbar: React.FC = () => {
  const [state, setState] = useState<NavbarState>({
    mobileMenuOpen: false,
    scrolled: false,
  });

  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const colors = THEME_COLORS[theme];

  // Detect active menu
  const activeItem: MenuItemName = React.useMemo(() => {
    const path = location.pathname;

    if (path === "/") return "home";
    if (path.startsWith("/projects")) return "projects";

    if (path.startsWith("/articles")) return "articles";

    return "home";
  }, [location.pathname]);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () =>
      setState((prev) => ({ ...prev, scrolled: window.scrollY > 20 }));
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = state.mobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [state.mobileMenuOpen]);

  // Handlers
  const toggleMobileMenu = () =>
    setState((prev) => ({ ...prev, mobileMenuOpen: !prev.mobileMenuOpen }));

  const handleNavigation = (path: string) => {
    setState((prev) => ({ ...prev, mobileMenuOpen: false }));
    navigate(path);
  };

  const handleLogo = () => {
    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    const maxScroll = scrollHeight - clientHeight;

    const nearTop = scrollTop <= 50;
    const nearBottom = maxScroll - scrollTop <= 50;

    if (nearTop) {
      window.scrollTo({
        top: scrollHeight,
        behavior: "smooth",
      });
    } else if (nearBottom) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      if (scrollTop < maxScroll / 2) {
        window.scrollTo({ top: scrollHeight, behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  // ------------------ RENDER ------------------

  return (
    <>
      <nav
        className={`fixed z-50 transition-all duration-300 ${
          state.scrolled
            ? "top-3 left-2 right-2 py-3  rounded-2xl border"
            : "top-0 left-0 right-0 py-4 "
        }`}
        style={{
          backgroundColor: state.scrolled ? colors.bg.primary : "transparent",
          backdropFilter: state.scrolled ? "blur(12px)" : "none",
          borderColor: state.scrolled ? colors.border : "transparent",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/">
              <button
                className="relative text-2xl md:text-3xl pacifico leading-none cursor-pointer"
                aria-label="Fenrir Qutrub"
                onClick={handleLogo}
              >
                {/* Desktop: single clean layer */}
                <span
                  className="hidden md:inline-block"
                  style={{ color: colors.text.primary }}
                >
                  Fenrir Qutrub
                </span>

                {/* Mobile: stacked layers to simulate bold (three offset back layers + top layer) */}
                <span
                  className="md:hidden block relative"
                  style={{ lineHeight: 1 }}
                  aria-hidden="false"
                >
                  {/* back layer 1 */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      transform: "translate(0.6px, 0.6px)",
                      color: colors.text.primary,
                      zIndex: 5,
                      opacity: 1,
                    }}
                  >
                    Fenrir Qutrub
                  </span>

                  {/* back layer 2 */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      transform: "translate(-0.6px, -0.6px)",
                      color: colors.text.primary,
                      zIndex: 6,
                      opacity: 1,
                    }}
                  >
                    Fenrir Qutrub
                  </span>

                  {/* back layer 3 (slight vertical offset) */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      transform: "translate(0.0px, 0.9px)",
                      color: colors.text.primary,
                      zIndex: 7,
                      opacity: 1,
                    }}
                  >
                    Fenrir Qutrub
                  </span>

                  {/* top layer (visible text) */}
                  <span
                    className="relative"
                    style={{ color: colors.text.primary, zIndex: 10 }}
                  >
                    Fenrir Qutrub
                  </span>
                </span>
              </button>
            </Link>

            {/* Desktop Menu */}
            <ul className="hidden md:flex items-center space-x-1 relative">
              {MENU_ITEMS.map((item) => {
                const isActive = activeItem === item.name;
                return (
                  <li key={item.name} className="relative">
                    <button
                      onClick={() => navigate(item.path)}
                      className="px-5 py-2.5 rounded-lg font-medium capitalize transition-all cursor-pointer relative z-10"
                      style={{
                        color: isActive
                          ? colors.text.primary
                          : colors.text.secondary,
                      }}
                    >
                      {item.name}
                    </button>
                    {isActive && (
                      <motion.div
                        layoutId="desktopActiveTab"
                        className="absolute inset-0 rounded-lg border"
                        style={{
                          backgroundColor: colors.bg.secondary,
                          borderColor: colors.border,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 30,
                          mass: 0.8,
                        }}
                      />
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Right side actions */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:block">
                <DayNightToggle size={35} animationSpeed={0.5} />
              </div>

              {/* Mobile menu button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2.5 rounded-lg transition-all z-[60] relative"
                style={{ backgroundColor: colors.bg.secondary }}
              >
                {state.mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence mode="wait">
        {state.mobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-[55] md:hidden"
              variants={OVERLAY_VARIANTS}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={toggleMobileMenu}
            />

            {/* Menu container */}
            <motion.div
              className="fixed inset-0 z-[56] md:hidden"
              style={{ backgroundColor: colors.bg.mobile }}
              variants={MENU_CONTAINER_VARIANTS}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="h-full flex flex-col relative">
                {/* Close button */}
                <motion.button
                  onClick={toggleMobileMenu}
                  className="absolute top-8 right-8 p-3 rounded-full z-10 backdrop-blur-sm transition-colors"
                  style={{
                    backgroundColor: colors.hover,
                    color: colors.text.primary,
                  }}
                  variants={CLOSE_BUTTON_VARIANTS}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6" />
                </motion.button>

                {/* Menu content */}
                <div className="flex-1 flex items-center justify-center px-8">
                  <motion.div
                    className="w-full max-w-md"
                    variants={MENU_ITEMS_VARIANTS}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <motion.h2
                      className="text-5xl md:text-6xl font-bold mb-16 pacifico"
                      style={{ color: colors.text.primary }}
                      variants={ITEM_VARIANTS}
                    >
                      Fenrir Qutrub
                    </motion.h2>

                    {/* Items */}
                    <nav className="space-y-3">
                      {MENU_ITEMS.map((item) => {
                        const isActive = activeItem === item.name;
                        return (
                          <motion.div
                            key={item.name}
                            variants={ITEM_VARIANTS}
                            whileHover={{ x: 10 }}
                            className="relative"
                          >
                            <button
                              onClick={() => handleNavigation(item.path)}
                              className="w-full group relative overflow-hidden"
                            >
                              <motion.div
                                className="absolute inset-0 rounded-2xl"
                                style={{ backgroundColor: colors.hover }}
                                initial={{ scaleX: 0 }}
                                whileHover={{ scaleX: 1 }}
                                transition={{ duration: 0.3 }}
                              />

                              <div className="relative flex items-center justify-between px-6 py-5">
                                <span
                                  className="text-3xl font-semibold capitalize transition-colors duration-300"
                                  style={{
                                    color: isActive
                                      ? colors.text.primary
                                      : colors.text.secondary,
                                  }}
                                >
                                  {item.name}
                                </span>

                                {isActive && (
                                  <motion.span
                                    className="text-sm"
                                    style={{ color: colors.text.secondary }}
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                  >
                                    Current page
                                  </motion.span>
                                )}
                              </div>

                              {isActive && (
                                <motion.div
                                  className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full"
                                  style={{
                                    backgroundColor: colors.text.primary,
                                  }}
                                  layoutId="mobileActiveIndicator"
                                  transition={{
                                    type: "spring",
                                    stiffness: 350,
                                    damping: 30,
                                    mass: 0.8,
                                  }}
                                />
                              )}
                            </button>
                          </motion.div>
                        );
                      })}
                    </nav>

                    {/* Theme toggle mobile */}
                    <motion.div className="mt-8 pt-8" variants={ITEM_VARIANTS}>
                      <div
                        className="border-t mb-6"
                        style={{ borderColor: colors.border }}
                      />
                      <div className="flex items-center justify-center">
                        <DayNightToggle size={40} animationSpeed={0.7} />
                      </div>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Footer */}
                <motion.div
                  className="p-8"
                  variants={ITEM_VARIANTS}
                  initial="hidden"
                  animate="visible"
                >
                  <p
                    className="text-sm"
                    style={{ color: colors.text.secondary }}
                  >
                    © 2025 Fenrir Qutrub
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

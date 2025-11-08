import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import ProjectModal from "./ProjectModal";
import type { Project } from "./Project";
import { useTheme } from "../../context/ThemeProvider";
import "swiper/swiper-bundle.css";
import axios from "axios";

// 3D Magnet Card Component
const MagneticProjectCard = ({
  project,
  onClick,
  isActive,
}: {
  project: Project;
  onClick: () => void;
  isActive: boolean;
}) => {
  const { theme } = useTheme();

  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const magnetStrength = 35;
  const rotationFactor = 1;
  const scaleFactor = 1.05;

  const handleMouseMove = (e: React.MouseEvent) => {
    // Only apply magnetic effect if this is the active slide
    if (!cardRef.current || !isActive) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } =
      cardRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const x = (clientX - centerX) / (width / 2);
    const y = (clientY - centerY) / (height / 2);
    setPosition({
      x: x * magnetStrength,
      y: y * magnetStrength,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    // Only set hover state if this is the active slide
    if (isActive) {
      setIsHovered(true);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative w-full cursor-pointer ${
        theme === "dark"
          ? "bg-[#0C0D12] text-[#E9EBED]"
          : "bg-[#E9EBED] text-[#0C0D12]"
      } border-[#30363D] rounded-lg overflow-hidden border shadow-xl`}
      animate={{
        // Only apply magnetic effect if this is the active slide
        x: isActive ? position.x : 0,
        y: isActive ? position.y : 0,
        rotateX: isActive ? position.y * rotationFactor : 0,
        rotateY: isActive ? position.x * -rotationFactor : 0,
        scale: isActive && isHovered ? scaleFactor : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 250,
        damping: 20,
        mass: 1,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={onClick}
      style={{
        // Add pointer events only for active slide
        pointerEvents: isActive ? "auto" : "none",
      }}
    >
      <div className="flex flex-col justify-between h-full">
        {/* Image */}
        <div className="w-full h-48 overflow-hidden bg-[#0D1117]">
          <img
            src={project.image}
            alt={project.title}
            className="object-cover w-full h-full"
          />
        </div>
        {/* Content */}
        <div className="flex flex-col p-5 space-y-2 flex-grow">
          <h3
            className={`text-xl font-bold ${
              theme === "dark"
                ? "bg-[#0C0D12] text-[#E9EBED]"
                : "bg-[#E9EBED] text-[#0C0D12]"
            }`}
          >
            {project.title}
          </h3>
          <p className="text-sm text-gray-400 font line-clamp-2">
            {project.description}
          </p>
          {/* Tech Stack */}
          {project.technologies && (
            <div className="flex flex-wrap gap-2 pt-2">
              {project.technologies.slice(0, 3).map((tech, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 text-xs rounded-full ${
                    theme === "dark"
                      ? "bg-red-200 text-red-600 border border-red-300"
                      : "bg-blue-200 text-blue-400 border border-blue-300"
                  }`}
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 3 && (
                <span className="px-2 py-1 text-xs rounded-full bg-[#30363D] text-gray-400">
                  +{project.technologies.length - 3}
                </span>
              )}
            </div>
          )}
          <div className="mt-auto pt-4 flex gap-3">
            <button
              className={`flex-1 py-2 rounded ${
                theme === "dark"
                  ? "bg-[#E9EBED] text-[#0C0D12]"
                  : "bg-[#0C0D12] text-[#E9EBED]"
              } text-sm font-medium transition`}
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function Projects() {
  const { theme } = useTheme();

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // ✅ Fetch projects from server API
  const {
    data: projectsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/projects`
      );
      return data;
    },
  });

  const projects = projectsResponse?.data || [];

  if (isLoading)
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-[#0C0D12]" : "bg-[#E9EBED]"
        }`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className={theme === "dark" ? "text-[#E9EBED]" : "text-[#0C0D12]"}>
            Loading projects...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-[#0C0D12]" : "bg-[#E9EBED]"
        }`}
      >
        <p className="text-red-500">Error: {(error as Error).message}</p>
      </div>
    );

  return (
    <section className="min-h-fit">
      <AnimatePresence mode="wait">
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>

      <div
        className={`${
          theme === "dark"
            ? "bg-[#0C0D12] text-[#F8f9fa]"
            : "bg-[#E9EBED] text-[#0C0D12]"
        } px-4`}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="flex justify-start items-center gap-x-2 title mt-20">
            <h2 className="text-3xl md:text-5xl rubik-bold ml-16">PROJECTS</h2>
          </div>
        </motion.div>

        {projects && projects.length > 0 ? (
          <motion.div layout className="w-full pb-12">
            <Swiper
              effect="coverflow"
              grabCursor={true}
              centeredSlides={true}
              slidesPerView="auto"
              coverflowEffect={{
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              loop={true}
              modules={[EffectCoverflow, Autoplay]}
              className="w-full py-12"
              style={{
                paddingBottom: "50px",
              }}
              onSlideChange={(swiper: SwiperType) => {
                setActiveIndex(swiper.realIndex);
              }}
              onSwiper={(swiper: SwiperType) => {
                setActiveIndex(swiper.realIndex);
              }}
            >
              {projects.map((project: Project, index: number) => (
                <SwiperSlide
                  key={project._id || project.id}
                  style={{
                    width: "300px",
                    maxWidth: "90vw",
                  }}
                >
                  <MagneticProjectCard
                    project={project}
                    onClick={() => setSelectedProject(project)}
                    isActive={index === activeIndex}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-2xl text-gray-400 font-medium font">
              Projects coming soon...
            </p>
            <p className="text-gray-500 mt-2 font">
              Stay tuned for exciting updates!
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

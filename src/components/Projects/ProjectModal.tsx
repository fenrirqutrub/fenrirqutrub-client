import { motion } from "framer-motion";
import { ExternalLink, Github, X } from "lucide-react";
import type {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  Key,
} from "react";
import type { ProjectModalProps } from "./Project";
import { useTheme } from "../../context/ThemeProvider";

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const { theme } = useTheme();

  const imageUrl = project.image.startsWith("http")
    ? project.image
    : `/works/${project.image.split("/").pop()}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className={`fixed inset-0  bg-[#0a0a0a]/80 backdrop-blur-sm z-30 flex items-center justify-center p-4 mt-14`}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className={`${
          theme === "dark"
            ? "bg-[#0C0D12] text-[#E9EBED]"
            : "bg-[#E9EBED] text-[#0C0D12]"
        }  rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
        <div className="p-6">
          <div className="aspect-video w-full rounded-xl overflow-hidden mb-6">
            <img
              src={imageUrl}
              alt={project.title}
              width={800}
              height={600}
              className="w-full h-full object-cover"
            />
          </div>
          <h3
            className={`text-2xl font-bold ${
              theme === "dark"
                ? "bg-[#0C0D12] text-[#E9EBED]"
                : "bg-[#E9EBED] text-[#0C0D12]"
            }  mb-4`}
          >
            {project.title}
          </h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies.map(
              (
                tech:
                  | string
                  | number
                  | bigint
                  | boolean
                  | ReactElement<
                      unknown,
                      string | JSXElementConstructor<unknown>
                    >
                  | Iterable<ReactNode>
                  | ReactPortal
                  | Promise<
                      | string
                      | number
                      | bigint
                      | boolean
                      | ReactPortal
                      | ReactElement<
                          unknown,
                          string | JSXElementConstructor<unknown>
                        >
                      | Iterable<ReactNode>
                      | null
                      | undefined
                    >
                  | null
                  | undefined,
                index: Key | null | undefined
              ) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full ${
                    theme === "dark"
                      ? "bg-red-200 text-red-600 border border-red-300"
                      : "bg-blue-200 text-blue-400 border border-blue-300"
                  }      text-sm`}
                >
                  {tech}
                </span>
              )
            )}
          </div>
          <p className="text-gray-400 mb-6">{project.fullDescription}</p>
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 ${
                  theme === "dark"
                    ? "bg-[#E9EBED] text-[#0C0D12]"
                    : "bg-[#0C0D12] text-[#E9EBED]"
                }   px-4 py-2 rounded transition-colors hover:bg-[#1a1a1a]`}
              >
                <Github size={20} />
                <span>View Code</span>
              </a>
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 ${
                  theme === "dark"
                    ? "bg-[#E9EBED] text-[#0C0D12]"
                    : "bg-[#0C0D12] text-[#E9EBED]"
                }   px-4 py-2 rounded`}
              >
                <ExternalLink size={20} />
                <span>Live Demo</span>
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

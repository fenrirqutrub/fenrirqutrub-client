export interface Project {
  _id: number;
  thumbnail: string;
  id: number;
  title: string;
  description: string;
  fullDescription: string;
  image: string;
  category: "web" | "team" | "mobile";
  technologies: string[];
  github: string;
  demo: string;
}

export interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

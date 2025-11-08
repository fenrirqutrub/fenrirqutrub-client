// Article Types
export interface Article {
  _id: string;
  category: string;
  avatar: string;
  img: string;
  title: string;
  description: string;
  code: string;
  slug: string;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  total?: number;
  page?: number;
  totalPages?: number;
  message?: string;
}

export interface ArticlesApiResponse extends ApiResponse<Article[]> {
  count: number;
  total: number;
  page: number;
  totalPages: number;
}

export type SingleArticleApiResponse = ApiResponse<Article>;

// Category Types
export interface CategoryData {
  name: string;
  count: number;
  articles: Article[];
  icon: string;
  color: string;
  bg: string;
  border: string;
  text: string;
}

// Comment Types
export interface Comment {
  id: number;
  user: string;
  text: string;
  time: string;
  likes: number;
}

// Component Props Types
export interface ArticleCardProps {
  article: Article;
  index: number;
  theme: string;
}

export interface CategoryCardProps {
  category: CategoryData;
  index: number;
  theme: string;
}

export interface PageButtonProps {
  pageNumber: number;
  isActive: boolean;
  onClick: (pageNumber: number) => void;
  theme: string;
}

// Location State Types (for React Router)
export interface ArticleLocationState {
  article?: Article;
  articleId?: string;
}

import { Route, Routes } from "react-router";
import Root from "../layout/Root";
import Home from "../components/Home/Home";
import Articles from "../pages/Articles/Articles";
import ArticlesDetails from "../pages/Articles/ArticleCardDetail";
import AdminLogin from "../pages/Admin/Auth/AdminLogin";
import ProjectsPage from "../pages/projects/ProjectsPage";
import Dashboard from "../pages/Admin/Dashboard";
import AddArticles from "../pages/Admin/AddNewItem/AddArticles";
import AdminLayout from "../layout/AdminLayout";
import NotFound from "../pages/NotFound/NotFound";
import ArticleCategoryList from "../pages/Articles/Articlecategorylist";
import ArticlesByCategory from "../pages/Articles/ArticleCategory";
import ManageCategory from "../pages/Admin/Management/ManageCategory";
import AddCategory from "../pages/Admin/AddNewItem/AddCategory";
import ManageArticles from "../pages/Admin/Management/ManageArticles";
import PrivateRoute from "./PrivateRoute";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Root />}>
        <Route index element={<Home />} />
        <Route path="/projects" element={<ProjectsPage />} />

        <Route path="/articles" element={<Articles />} />
        <Route path="/articles/category" element={<ArticleCategoryList />} />
        <Route
          path="/articles/category/:category"
          element={<ArticlesByCategory />}
        />
        <Route path="/articles/detail/:slug" element={<ArticlesDetails />} />

        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/admin-login" element={<AdminLogin />} />

      <Route
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/managecategory" element={<ManageCategory />} />
        <Route path="/addcategory" element={<AddCategory />} />
        <Route path="/managearticles" element={<ManageArticles />} />
        <Route path="/addarticles" element={<AddArticles />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default Router;

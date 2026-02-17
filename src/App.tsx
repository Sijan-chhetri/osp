import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/osp/Navbar'
import Footer from './components/osp/Footer'
import Hero from './pages/osp/Hero'
import Software from './pages/osp/Software'
import Contact from './pages/osp/Contact'
import Activationkey from './pages/osp/Activationkey'
import EgHero from './pages/eg/eghero'
import EgProduct from './pages/eg/egproduct'
import EgFooter from './components/eg/egFooter'

import AdminRoute from "./components/AdminRoute.tsx";
import AdminLayout from "./admin/layouts/AdminLayout.tsx";
import Dashboard from "./admin/pages/dashboard.tsx";
import SoftwareCategories from "./admin/pages/softwareCategoryList.tsx";
import SoftwareCategoryCreate from "./admin/pages/softwareCategoryCreate.tsx";
import SoftwareBrands from "./admin/pages/softwareBrandList.tsx";
import SoftwareBrandCreate from "./admin/pages/softwareBrandCreate.tsx";
import SoftwareProducts from "./admin/pages/softwareProductList.tsx";
import SoftwareProductCreate from "./admin/pages/softwareProductCreate.tsx";
import SoftwarePlanList from "./admin/pages/softwarePlanList.tsx";
import SoftwarePlanCreate from "./admin/pages/softwarePlanCreate.tsx";
import AdminProfile from "./admin/pages/adminProfile.tsx";
import Login from "./pages/osp/Login.tsx";


function App() {
  return (
    
    <Router>
      <Routes>
        {/* OSP Home Page Route */}
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-white">
              <Navbar />
              <Hero />
              <Software />
              <Contact />
              <Footer />
            </div>
          }
        />
        {/* OSP Activation Key Route */}
        <Route
          path="/activation"
          element={
            <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-white">
              <Navbar />
              <Activationkey />
              <Footer />
            </div>
          }
        />
        {/* EG Cartridge Page Route */}
        <Route
          path="/eg"
          element={
            <>
              <EgHero />
              <EgProduct />
              <EgFooter />
            </>
          }
        />

        <Route path="/login" element={<Login />} />

        {/* =====================
        Admin Routes (Nested)
    ===================== */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="category">
            <Route index element={<SoftwareCategories />} />
            <Route
              path="softwareCategoryCreate"
              element={<SoftwareCategoryCreate />}
            />
          </Route>

          <Route path="brands">
            <Route index element={<SoftwareBrands />} />
            <Route
              path="softwareBrandCreate"
              element={<SoftwareBrandCreate />}
            />
          </Route>

          <Route path="products">
            <Route index element={<SoftwareProducts />} />
            <Route
              path="softwareProductCreate"
              element={<SoftwareProductCreate />}
            />
          </Route>

          <Route path="plans">
            <Route index element={<SoftwarePlanList />} />
            <Route path="softwarePlanCreate" element={<SoftwarePlanCreate />} />
          </Route>

          <Route path="adminProfile" element={<AdminProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App

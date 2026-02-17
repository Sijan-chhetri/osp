import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/osp/Navbar'
import Footer from './components/osp/Footer'
import Hero from './pages/osp/Hero'
import Software from './pages/osp/Software'
import Contact from './pages/osp/Contact'
import Activationkey from './pages/osp/Activationkey'
import Checkout from './pages/osp/Checkout'
import UserLogin from './pages/osp/UserLogin'
import Register from './pages/osp/Register'
import UserProfile from './pages/osp/UserProfile'
import Cart from './pages/osp/Cart'
import EgHero from './pages/eg/eghero'
import EgProduct from './pages/eg/egproduct'
import EgFooter from './components/eg/egFooter'
import CartridgeDetail from './pages/eg/CartridgeDetail'
import CartridgeCart from './pages/eg/CartridgeCart'
import CartridgeCheckout from './pages/eg/CartridgeCheckout'

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

// Cartridge Management Pages
import CartridgeBrandList from "./admin/pages/cartridgeBrandList.tsx";
import CartridgeBrandCreate from "./admin/pages/cartridgeBrandCreate.tsx";
import CartridgeBrandEdit from "./admin/pages/cartridgeBrandEdit.tsx";
import CartridgeCategoryList from "./admin/pages/cartridgeCategoryList.tsx";
import CartridgeCategoryCreate from "./admin/pages/cartridgeCategoryCreate.tsx";
import CartridgeCategoryEdit from "./admin/pages/cartridgeCategoryEdit.tsx";
import CartridgeProductList from "./admin/pages/cartridgeProductList.tsx";
import CartridgeProductCreate from "./admin/pages/cartridgeProductCreate.tsx";
import CartridgeProductEdit from "./admin/pages/cartridgeProductEdit.tsx";
import CartridgeQRList from "./admin/pages/cartridgeQRList.tsx";


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
        {/* OSP Checkout Route */}
        <Route path="/checkout" element={<Checkout />} />
        {/* User Login Route */}
        <Route path="/user-login" element={<UserLogin />} />
        {/* Register Route */}
        <Route path="/register" element={<Register />} />
        {/* User Profile Route */}
        <Route path="/profile" element={<UserProfile />} />
        {/* Cart Route */}
        <Route path="/cart" element={<Cart />} />
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
        {/* EG Cartridge Detail Route */}
        <Route path="/eg/cartridge/:id" element={<CartridgeDetail />} />
        {/* EG Cart Route */}
        <Route path="/eg/cart" element={<CartridgeCart />} />
        {/* EG Checkout Route */}
        <Route path="/eg/checkout" element={<CartridgeCheckout />} />

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

          {/* Cartridge Management Routes */}
          <Route path="cartridge">
            <Route path="brands">
              <Route index element={<CartridgeBrandList />} />
              <Route path="create" element={<CartridgeBrandCreate />} />
              <Route path="edit/:id" element={<CartridgeBrandEdit />} />
            </Route>

            <Route path="categories">
              <Route index element={<CartridgeCategoryList />} />
              <Route path="create" element={<CartridgeCategoryCreate />} />
              <Route path="edit/:id" element={<CartridgeCategoryEdit />} />
            </Route>

            <Route path="products">
              <Route index element={<CartridgeProductList />} />
              <Route path="create" element={<CartridgeProductCreate />} />
              <Route path="edit/:id" element={<CartridgeProductEdit />} />
            </Route>

            <Route path="qr-codes" element={<CartridgeQRList />} />
          </Route>

          <Route path="adminProfile" element={<AdminProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App

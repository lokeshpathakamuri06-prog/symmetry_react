import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { SearchProvider } from './context/SearchContext';
import { SiteContentProvider } from './context/SiteContentContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';

import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import SearchModal from './components/SearchModal';
import FloatingActionStack from './components/FloatingActionStack';
import SmoothScroll from './components/SmoothScroll';
import ScrollProgressBar from './components/ScrollProgressBar';
import SiteOpener from './components/SiteOpener';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Sourcing from './pages/Sourcing';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Journal from './pages/Journal';
import JournalDetail from './pages/JournalDetail';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPageContent from './pages/admin/AdminPageContent';
import AdminBanners from './pages/admin/AdminBanners';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminCollections from './pages/admin/AdminCollections';
import AdminProjects from './pages/admin/AdminProjects';
import AdminBlogs from './pages/admin/AdminBlogs';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminTeam from './pages/admin/AdminTeam';
import AdminInquiries from './pages/admin/AdminInquiries';
import AdminOrders from './pages/admin/AdminOrders';
import AdminMedia from './pages/admin/AdminMedia';
import AdminSettings from './pages/admin/AdminSettings';

// Shell Layout Wrapper
const StorefrontShell = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return <div className="min-h-screen bg-[#07121C] text-[#F5F1E8]">{children}</div>;
  }

  return (
    <SmoothScroll>
      <div className="min-h-screen flex flex-col bg-[#F4F7F6] dark:bg-[#07121C] text-[#131E20] dark:text-[#F5F1E8] transition-colors duration-300 relative selection:bg-[#36656B]/20 selection:text-[#36656B]">
        <ScrollProgressBar />
        <ScrollToTop />
        <Header />

        <main className="flex-1">
          {children}
        </main>

        <Footer />
        <FloatingActionStack />
        <SearchModal />
      </div>
    </SmoothScroll>
  );
};

export const App = () => {
  return (
    <ThemeProvider>
      <CartProvider>
        <SearchProvider>
          <SiteContentProvider>
            <AdminAuthProvider>
              <BrowserRouter>
                <SiteOpener />
                <StorefrontShell>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/projects/:id" element={<ProjectDetail />} />
                    <Route path="/sourcing" element={<Sourcing />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/shop/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-success" element={<OrderSuccess />} />
                    <Route path="/journal" element={<Journal />} />
                    <Route path="/journal/:id" element={<JournalDetail />} />
                    <Route path="/contact" element={<Contact />} />
                    
                    {/* Admin Unprotected Route */}
                    <Route path="/admin/login" element={<AdminLogin />} />

                    {/* Admin Protected Routes */}
                    <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
                    <Route path="/admin/content" element={<AdminProtectedRoute><AdminPageContent /></AdminProtectedRoute>} />
                    <Route path="/admin/banners" element={<AdminProtectedRoute><AdminBanners /></AdminProtectedRoute>} />
                    <Route path="/admin/products" element={<AdminProtectedRoute><AdminProducts /></AdminProtectedRoute>} />
                    <Route path="/admin/categories" element={<AdminProtectedRoute><AdminCategories /></AdminProtectedRoute>} />
                    <Route path="/admin/collections" element={<AdminProtectedRoute><AdminCollections /></AdminProtectedRoute>} />
                    <Route path="/admin/projects" element={<AdminProtectedRoute><AdminProjects /></AdminProtectedRoute>} />
                    <Route path="/admin/blogs" element={<AdminProtectedRoute><AdminBlogs /></AdminProtectedRoute>} />
                    <Route path="/admin/testimonials" element={<AdminProtectedRoute><AdminTestimonials /></AdminProtectedRoute>} />
                    <Route path="/admin/team" element={<AdminProtectedRoute><AdminTeam /></AdminProtectedRoute>} />
                    <Route path="/admin/inquiries" element={<AdminProtectedRoute><AdminInquiries /></AdminProtectedRoute>} />
                    <Route path="/admin/orders" element={<AdminProtectedRoute><AdminOrders /></AdminProtectedRoute>} />
                    <Route path="/admin/media" element={<AdminProtectedRoute><AdminMedia /></AdminProtectedRoute>} />
                    <Route path="/admin/settings" element={<AdminProtectedRoute><AdminSettings /></AdminProtectedRoute>} />

                    {/* Fallback 404 Routes */}
                    <Route path="/404" element={<NotFound />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </StorefrontShell>
              </BrowserRouter>
            </AdminAuthProvider>
          </SiteContentProvider>
        </SearchProvider>
      </CartProvider>
    </ThemeProvider>
  );
};

export default App;

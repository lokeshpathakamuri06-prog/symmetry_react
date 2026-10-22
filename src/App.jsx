import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LazyMotion, MotionConfig } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { SearchProvider, useSearch } from './context/SearchContext';
import { PublicContentProvider } from './context/PublicContentContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { CustomerProvider } from './context/CustomerContext';
import RequireCustomer from './components/RequireCustomer';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';

import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import FloatingActionStack from './components/FloatingActionStack';
import CartToast from './components/shop/CartToast';
import SmoothScroll from './components/SmoothScroll';
import PageTransition, { RouteFallback } from './components/motion/PageTransition';
import SiteOpener from './components/SiteOpener';

// Not needed for the first screen: the chat loads once the page is idle, search when first opened
const ChatBot = lazy(() => import('./components/ChatBot'));
const SearchModal = lazy(() => import('./components/SearchModal'));

const WhenIdle = ({ children }) => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1500));
    const cancel = window.cancelIdleCallback || clearTimeout;
    const id = idle(() => setReady(true), { timeout: 4000 });
    return () => cancel(id);
  }, []);
  return ready ? <Suspense fallback={null}>{children}</Suspense> : null;
};

const SearchWhenOpened = () => {
  const { isOpen } = useSearch();
  const [used, setUsed] = useState(false);
  if (isOpen && !used) setUsed(true);
  return used ? <Suspense fallback={null}><SearchModal /></Suspense> : null;
};

// Home ships in the main bundle (most visits start there; measured faster than loading it separately).
// Other pages load on demand; the server's page head preloads the current page's file (app/seo.py).
import Home from './pages/Home';
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Sourcing = lazy(() => import('./pages/Sourcing'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const Journal = lazy(() => import('./pages/Journal'));
const JournalDetail = lazy(() => import('./pages/JournalDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const Careers = lazy(() => import('./pages/Careers'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AccountLogin = lazy(() => import('./pages/account/AccountLogin'));
const Account = lazy(() => import('./pages/account/Account'));
const AccountOrder = lazy(() => import('./pages/account/Account').then((m) => ({ default: m.AccountOrder })));

// Admin pages: separate chunks, downloaded only when someone opens the admin
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminPageContent = lazy(() => import('./pages/admin/AdminPageContent'));
const AdminBanners = lazy(() => import('./pages/admin/AdminBanners'));
const AdminPageBanners = lazy(() => import('./pages/admin/AdminPageBanners'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminCollections = lazy(() => import('./pages/admin/AdminCollections'));
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects'));
const AdminBlogs = lazy(() => import('./pages/admin/AdminBlogs'));
const AdminTestimonials = lazy(() => import('./pages/admin/AdminTestimonials'));
const AdminTeam = lazy(() => import('./pages/admin/AdminTeam'));
const AdminInquiries = lazy(() => import('./pages/admin/AdminInquiries'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminDeliveries = lazy(() => import('./pages/admin/AdminDeliveries'));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'));
const AdminInvoice = lazy(() => import('./pages/admin/AdminInvoice'));
const AdminInventory = lazy(() => import('./pages/admin/AdminInventory'));
const AdminMedia = lazy(() => import('./pages/admin/AdminMedia'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminCareers = lazy(() => import('./pages/admin/AdminCareers'));
const AdminApplications = lazy(() => import('./pages/admin/AdminApplications'));

// Once the visitor starts interacting, quietly fetch the other public pages so navigation is instant.
// Admin code is never prefetched for visitors.
const PUBLIC_PAGE_LOADERS = [
  () => import('./pages/About'),
  () => import('./pages/Services'),
  () => import('./pages/Projects'),
  () => import('./pages/ProjectDetail'),
  () => import('./pages/Sourcing'),
  () => import('./pages/Shop'),
  () => import('./pages/ProductDetail'),
  () => import('./pages/Cart'),
  () => import('./pages/Checkout'),
  () => import('./pages/OrderSuccess'),
  () => import('./pages/Journal'),
  () => import('./pages/JournalDetail'),
  () => import('./pages/Contact'),
  () => import('./pages/Careers'),
  () => import('./pages/NotFound'),
];

const PrefetchPublicPages = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  useEffect(() => {
    if (isAdmin) return undefined;
    // Wait until the visitor interacts (or 6 s), so loading other pages never competes with the first one
    const events = ['pointerdown', 'scroll', 'keydown', 'mousemove', 'touchstart'];
    let timer;
    function cleanup() {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, start));
    }
    function start() {
      cleanup();
      const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 200));
      idle(() => PUBLIC_PAGE_LOADERS.forEach((load) => load().catch(() => {})));
    }
    timer = setTimeout(start, 6000);
    events.forEach((e) => window.addEventListener(e, start, { once: true, passive: true }));
    return cleanup;
  }, [isAdmin]);
  return null;
};

// Intro animation is for the public site only, not the admin console
const StorefrontOpener = () => {
  const location = useLocation();
  return location.pathname.startsWith('/admin') ? null : <SiteOpener />;
};

// Shell Layout Wrapper
const StorefrontShell = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return <div className="admin-theme min-h-screen bg-adm-bg text-adm-fg">{children}</div>;
  }

  return (
    <SmoothScroll>
      <div className="min-h-screen flex flex-col bg-canvas text-fg transition-colors duration-300 relative">
        <ScrollToTop />
        <Header />

        {/* flow-root: the page bar's top margin stays inside (no jump when a page finishes loading);
            min height: the footer never flashes into view while a page loads */}
        <main className="flex-1 flow-root min-h-[100svh]">
          <PageTransition>{children}</PageTransition>
        </main>

        <Footer />
        <FloatingActionStack />
        <WhenIdle><ChatBot /></WhenIdle>
        <CartToast />
        <SearchWhenOpened />
      </div>
    </SmoothScroll>
  );
};

// Animation engine downloads after first paint; <m.*> elements wait for it
const loadMotionFeatures = () => import('./lib/motionFeatures').then((mod) => mod.default);

export const App = () => {
  return (
    // reducedMotion="user": visitors who turn motion off in their settings get fades only
    <MotionConfig reducedMotion="user">
    <LazyMotion features={loadMotionFeatures} strict>
    <ThemeProvider>
        <SearchProvider>
            <PublicContentProvider>
            <CustomerProvider>
            <AdminAuthProvider>
              <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || undefined}>
              <CartProvider>
                <StorefrontOpener />
                <PrefetchPublicPages />
                <StorefrontShell>
                  <Suspense fallback={<RouteFallback />}>
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
                    <Route path="/cart" element={<RequireCustomer><Cart /></RequireCustomer>} />
                    <Route path="/checkout" element={<RequireCustomer><Checkout /></RequireCustomer>} />
                    <Route path="/order-success" element={<OrderSuccess />} />
                    <Route path="/journal" element={<Journal />} />
                    <Route path="/journal/:id" element={<JournalDetail />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/careers" element={<Careers />} />
                    <Route path="/account/login" element={<AccountLogin />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/account/orders/:number" element={<AccountOrder />} />
                    
                    {/* Admin Unprotected Route */}
                    <Route path="/admin/login" element={<AdminLogin />} />

                    {/* Admin Protected Routes */}
                    <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
                    <Route path="/admin/content" element={<AdminProtectedRoute><AdminPageContent /></AdminProtectedRoute>} />
                    <Route path="/admin/banners" element={<AdminProtectedRoute><AdminBanners /></AdminProtectedRoute>} />
                    <Route path="/admin/page-banners" element={<AdminProtectedRoute><AdminPageBanners /></AdminProtectedRoute>} />
                    <Route path="/admin/products" element={<AdminProtectedRoute><AdminProducts /></AdminProtectedRoute>} />
                    <Route path="/admin/categories" element={<AdminProtectedRoute><AdminCategories /></AdminProtectedRoute>} />
                    <Route path="/admin/collections" element={<AdminProtectedRoute><AdminCollections /></AdminProtectedRoute>} />
                    <Route path="/admin/projects" element={<AdminProtectedRoute><AdminProjects /></AdminProtectedRoute>} />
                    <Route path="/admin/blogs" element={<AdminProtectedRoute><AdminBlogs /></AdminProtectedRoute>} />
                    <Route path="/admin/testimonials" element={<AdminProtectedRoute><AdminTestimonials /></AdminProtectedRoute>} />
                    <Route path="/admin/team" element={<AdminProtectedRoute><AdminTeam /></AdminProtectedRoute>} />
                    <Route path="/admin/inquiries" element={<AdminProtectedRoute><AdminInquiries /></AdminProtectedRoute>} />
                    <Route path="/admin/orders" element={<AdminProtectedRoute><AdminOrders /></AdminProtectedRoute>} />
                    <Route path="/admin/orders/:id/invoice" element={<AdminProtectedRoute><AdminInvoice /></AdminProtectedRoute>} />
                    <Route path="/admin/deliveries" element={<AdminProtectedRoute><AdminDeliveries /></AdminProtectedRoute>} />
                    <Route path="/admin/customers" element={<AdminProtectedRoute><AdminCustomers /></AdminProtectedRoute>} />
                    <Route path="/admin/inventory" element={<AdminProtectedRoute><AdminInventory /></AdminProtectedRoute>} />
                    <Route path="/admin/media" element={<AdminProtectedRoute><AdminMedia /></AdminProtectedRoute>} />
                    <Route path="/admin/settings" element={<AdminProtectedRoute><AdminSettings /></AdminProtectedRoute>} />
                    <Route path="/admin/careers" element={<AdminProtectedRoute><AdminCareers /></AdminProtectedRoute>} />
                    <Route path="/admin/applications" element={<AdminProtectedRoute><AdminApplications /></AdminProtectedRoute>} />

                    {/* Fallback 404 Routes */}
                    <Route path="/404" element={<NotFound />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  </Suspense>
                </StorefrontShell>
              </CartProvider>
              </BrowserRouter>
            </AdminAuthProvider>
            </CustomerProvider>
            </PublicContentProvider>
        </SearchProvider>
    </ThemeProvider>
    </LazyMotion>
    </MotionConfig>
  );
};

export default App;

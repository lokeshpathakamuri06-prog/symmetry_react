import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { SearchProvider } from './context/SearchContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import SearchModal from './components/SearchModal';
import FloatingActionStack from './components/FloatingActionStack';
import SmoothScroll from './components/SmoothScroll';
import ScrollProgressBar from './components/ScrollProgressBar';
import SiteOpener from './components/SiteOpener';

// Pages
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

export const App = () => {
  return (
    <ThemeProvider>
      <CartProvider>
        <SearchProvider>
          <BrowserRouter>
            <SiteOpener />
            <SmoothScroll>
              <div className="min-h-screen flex flex-col bg-[#F4F7F6] dark:bg-[#07121C] text-[#131E20] dark:text-[#F5F1E8] transition-colors duration-300 relative selection:bg-[#36656B]/20 selection:text-[#36656B]">
                <ScrollProgressBar />
                <ScrollToTop />
                <Header />

                <main className="flex-1">
                <Routes>
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
                  <Route path="/404" element={<NotFound />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>

              <Footer />
              <FloatingActionStack />
              <SearchModal />
            </div>
            </SmoothScroll>
          </BrowserRouter>
        </SearchProvider>
      </CartProvider>
    </ThemeProvider>
  );
};

export default App;

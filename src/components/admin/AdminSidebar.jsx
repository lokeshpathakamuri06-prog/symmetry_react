import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Sliders, 
  Package, 
  Grid, 
  Layers, 
  FolderKanban, 
  BookOpen, 
  Quote, 
  Users, 
  MessageSquare, 
  ShoppingBag, 
  Image as ImageIcon, 
  Settings, 
  ExternalLink,
  LogOut,
  ChevronLeft,
  Sparkles
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const { logoutAdmin } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/admin/login');
  };

  const navGroups = [
    {
      title: 'Main Overview',
      items: [
        { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
        { label: 'Page Content CMS', path: '/admin/content', icon: FileText, badge: 'All Pages' }
      ]
    },
    {
      title: 'Catalog & Store',
      items: [
        { label: 'Products', path: '/admin/products', icon: Package },
        { label: 'Categories', path: '/admin/categories', icon: Grid },
        { label: 'Collections', path: '/admin/collections', icon: Layers },
        { label: 'Customer Orders', path: '/admin/orders', icon: ShoppingBag }
      ]
    },
    {
      title: 'Content & Portfolio',
      items: [
        { label: 'Hero Banners', path: '/admin/banners', icon: Sliders },
        { label: 'Interior Projects', path: '/admin/projects', icon: FolderKanban },
        { label: 'Journal Articles', path: '/admin/blogs', icon: BookOpen },
        { label: 'Testimonials', path: '/admin/testimonials', icon: Quote },
        { label: 'Team Profiles', path: '/admin/team', icon: Users }
      ]
    },
    {
      title: 'CRM & Assets',
      items: [
        { label: 'Contact Enquiries', path: '/admin/inquiries', icon: MessageSquare },
        { label: 'Media Library', path: '/admin/media', icon: ImageIcon }
      ]
    },
    {
      title: 'System',
      items: [
        { label: 'Settings & Database', path: '/admin/settings', icon: Settings }
      ]
    }
  ];

  return (
    <aside 
      className={`fixed top-0 left-0 z-40 h-screen w-72 bg-[#0A1622] border-r border-[#1B2E3D] text-[#F5F1E8] flex flex-col transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Brand Header */}
      <div className="p-6 border-b border-[#1B2E3D] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#36656B]"></span>
            <h1 className="font-serif text-xl tracking-[0.2em] font-semibold text-[#F5F1E8]">SYMMETRY</h1>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-white/50 mt-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#36656B]" /> Admin Control Center
          </p>
        </div>
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-1.5 text-white/60 hover:text-white rounded-lg hover:bg-white/5"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 custom-scrollbar">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx}>
            <p className="px-3 text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 mb-2">
              {group.title}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const IconComponent = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.exact}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group ${
                        isActive
                          ? 'bg-[#36656B] text-white shadow-lg shadow-[#36656B]/20 font-semibold'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-4 h-4 transition-transform group-hover:scale-110" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer / Storefront Switcher */}
      <div className="p-4 border-t border-[#1B2E3D] bg-[#07121C]/60 space-y-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-white/70 hover:text-white hover:bg-white/5 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-[#36656B]" /> Live Storefront
          </span>
          <span className="text-[10px] text-white/40">Open site ↗</span>
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <span className="flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Sign Out
          </span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;

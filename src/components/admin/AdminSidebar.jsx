import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
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
  Briefcase,
  UserCheck
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useTheme } from '../../context/ThemeContext';
import adminDataService from '../../services/adminDataService';
import logoImg from '../../assets/logo.png';
import logoDarkImg from '../../assets/logo-dark.png';

export const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const { logoutAdmin } = useAdminAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [newApplications, setNewApplications] = useState(0);

  useEffect(() => {
    adminDataService.getApplications().then((apps) => {
      setNewApplications((apps || []).filter((a) => a.status === 'new').length);
    });
  }, [location.pathname]);

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/admin/login');
  };

  const navGroups = [
    {
      title: 'Overview',
      items: [
        { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
        { label: 'Page Content', path: '/admin/content', icon: FileText }
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
      title: 'Careers',
      items: [
        { label: 'Job Openings', path: '/admin/careers', icon: Briefcase },
        { label: 'Applications', path: '/admin/applications', icon: UserCheck, count: newApplications }
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
    <>
      {/* Mobile scrim */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="lg:hidden fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-72 adm-glass border-r border-adm-border text-adm-fg flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="px-6 pt-6 pb-5 flex items-center justify-between">
          <div>
            <img
              src={isDark ? logoDarkImg : logoImg}
              alt="Symmetry Interiors"
              className="h-9 w-auto object-contain"
            />
            <p className="text-[11px] text-adm-muted mt-2 font-medium">Admin Console</p>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1.5 text-adm-muted hover:text-adm-fg rounded-lg hover:bg-adm-fg/5"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 pb-6 space-y-5 custom-scrollbar">
          {navGroups.map((group) => (
            <div key={group.title}>
              <p className="px-3 text-[11px] font-semibold text-adm-muted mb-1.5">
                {group.title}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.exact}
                      onClick={() => isOpen && toggleSidebar()}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2 rounded-[10px] text-[13px] transition-colors duration-150 ${
                          isActive
                            ? 'bg-adm-accent/10 text-adm-accent font-semibold'
                            : 'text-adm-fg/80 hover:bg-adm-fg/5 hover:text-adm-fg'
                        }`
                      }
                    >
                      <span className="flex items-center gap-3">
                        <IconComponent className="w-[17px] h-[17px]" strokeWidth={1.8} />
                        <span>{item.label}</span>
                      </span>
                      {item.count > 0 && (
                        <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-adm-accent text-adm-on-accent text-[10px] font-semibold flex items-center justify-center">
                          {item.count}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer / Storefront Switcher */}
        <div className="p-3 border-t border-adm-border space-y-0.5">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-[10px] text-[13px] text-adm-fg/80 hover:text-adm-fg hover:bg-adm-fg/5 transition-colors"
          >
            <span className="flex items-center gap-3">
              <ExternalLink className="w-[17px] h-[17px] text-adm-accent" strokeWidth={1.8} /> View Website
            </span>
            <span className="text-[11px] text-adm-muted">↗</span>
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-[10px] text-[13px] text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-[17px] h-[17px]" strokeWidth={1.8} /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;

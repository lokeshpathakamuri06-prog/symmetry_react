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
  UserCheck,
  PanelTop,
  Truck,
  Boxes,
  Contact
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { INBOX_CHANGED_EVENT, inboxCounts } from '../../services/adminApi';
import logoDarkImg from '../../assets/logo-dark.png';

export const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const { logoutAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const refresh = () => inboxCounts().then(setCounts).catch(() => {});
    refresh();
    window.addEventListener(INBOX_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(INBOX_CHANGED_EVENT, refresh);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/admin/login');
  };

  const navGroups = [
    {
      title: 'Overview',
      items: [{ label: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true }],
    },
    {
      title: 'Sales',
      items: [
        { label: 'Orders', path: '/admin/orders', icon: ShoppingBag, count: counts.pendingOrders },
        { label: 'Deliveries', path: '/admin/deliveries', icon: Truck },
        { label: 'Customers', path: '/admin/customers', icon: Contact },
        { label: 'Enquiries', path: '/admin/inquiries', icon: MessageSquare, count: counts.unreadInquiries },
      ],
    },
    {
      title: 'Catalogue',
      items: [
        { label: 'Products', path: '/admin/products', icon: Package },
        { label: 'Inventory', path: '/admin/inventory', icon: Boxes },
        { label: 'Categories', path: '/admin/categories', icon: Grid },
        { label: 'Collections', path: '/admin/collections', icon: Layers },
      ],
    },
    {
      title: 'Website',
      items: [
        { label: 'Home Banners', path: '/admin/banners', icon: Sliders },
        { label: 'Page Banners', path: '/admin/page-banners', icon: PanelTop },
        { label: 'Page Content', path: '/admin/content', icon: FileText },
        { label: 'Projects', path: '/admin/projects', icon: FolderKanban },
        { label: 'Journal', path: '/admin/blogs', icon: BookOpen },
        { label: 'Testimonials', path: '/admin/testimonials', icon: Quote },
        { label: 'Team', path: '/admin/team', icon: Users },
        { label: 'Media Library', path: '/admin/media', icon: ImageIcon },
      ],
    },
    {
      title: 'Careers',
      items: [
        { label: 'Job Openings', path: '/admin/careers', icon: Briefcase },
        { label: 'Applications', path: '/admin/applications', icon: UserCheck, count: counts.newApplications },
      ],
    },
    {
      title: 'System',
      items: [{ label: 'Settings', path: '/admin/settings', icon: Settings }],
    },
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
        className={`adm-sidebar fixed top-0 left-0 z-40 h-screen w-72 border-r border-adm-border text-adm-fg flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="px-6 pt-6 pb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoDarkImg} alt="" className="h-11 w-11 object-contain" />
            <div className="leading-tight">
              <p className="wordmark text-[15px] text-adm-fg">SYMMETRY</p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-adm-gold mt-1">Admin</p>
            </div>
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
              <p className="px-3 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-adm-muted/80 mb-1.5">
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
                            ? 'bg-adm-accent/[0.14] text-adm-accent font-semibold shadow-[inset_3px_0_0_rgb(var(--adm-accent))]'
                            : 'text-adm-fg/75 hover:bg-white/[0.06] hover:text-adm-fg'
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
            href={import.meta.env.BASE_URL}
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
            className="w-full flex items-center gap-3 px-3 py-2 rounded-[10px] text-[13px] text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-[17px] h-[17px]" strokeWidth={1.8} /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;

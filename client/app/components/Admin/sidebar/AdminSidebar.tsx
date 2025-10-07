'use client';

import { useState, useEffect } from 'react';
import {
  Home,
  Users,
  Receipt,
  BarChart3,
  MapPin,
  Video,
  Globe,
  HelpCircle,
  Grid as GridIcon,
  UserCog,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  PlaySquare,
  LucideIcon,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Avatar from '../../../../public/assests/avatar.png';

interface MenuItemType {
  title: string;
  icon: LucideIcon;
  path: string;
}

interface MenuSection {
  title: string;
  items: MenuItemType[];
}

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [selected, setSelected] = useState('Dashboard');
  const [mounted, setMounted] = useState(false);

  const { user } = useSelector((state: RootState) => state.auth);

  const pathname = usePathname();
  const router = useRouter();

  // Ensure component is mounted before rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update selected item based on current pathname
  useEffect(() => {
    if (!pathname) return;

    const routeMap: Record<string, string> = {
      '/admin': 'Dashboard',
      '/admin/users': 'Users',
      '/admin/invoices': 'Invoices',
      '/admin/create-course': 'Create Course',
      '/admin/courses': 'Live Courses',
      '/admin/hero': 'Hero',
      '/admin/faq': 'FAQ',
      '/admin/categories': 'Categories',
      '/admin/team': 'Manage Team',
      '/admin/courses-analytics': 'Courses Analytics',
      '/admin/orders-analytics': 'Orders Analytics',
      '/admin/users-analytics': 'Users Analytics',
      '/admin/settings': 'Settings',
    };

    const matchedTitle = routeMap[pathname];
    if (matchedTitle) {
      setSelected(matchedTitle);
    }
  }, [pathname]);

  const menuSections: MenuSection[] = [
    {
      title: 'Main',
      items: [{ title: 'Dashboard', icon: Home, path: '/admin' }],
    },
    {
      title: 'Data',
      items: [
        { title: 'Users', icon: Users, path: '/admin/users' },
        { title: 'Invoices', icon: Receipt, path: '/admin/invoices' },
      ],
    },
    {
      title: 'Content',
      items: [
        { title: 'Create Course', icon: PlaySquare, path: '/admin/create-course' },
        { title: 'Live Courses', icon: Video, path: '/admin/courses' },
      ],
    },
    {
      title: 'Customization',
      items: [
        { title: 'Hero', icon: Globe, path: '/admin/hero' },
        { title: 'FAQ', icon: HelpCircle, path: '/admin/faq' },
        { title: 'Categories', icon: GridIcon, path: '/admin/categories' },
      ],
    },
    {
      title: 'Analytics',
      items: [
        { title: 'Courses Analytics', icon: BarChart3, path: '/admin/courses-analytics' },
        { title: 'Orders Analytics', icon: MapPin, path: '/admin/orders-analytics' },
        { title: 'Users Analytics', icon: BarChart3, path: '/admin/users-analytics' },
      ],
    },
    {
      title: 'Settings',
      items: [
        { title: 'Manage Team', icon: UserCog, path: '/admin/team' },
        { title: 'Settings', icon: Settings, path: '/admin/settings' },
      ],
    },
  ];

  const handleLogout = () => {
    router.push('/');
  };

  // Close mobile menu when screen becomes larger
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!mounted) return null;

  const MenuItem = ({ item, isActive }: { item: MenuItemType; isActive: boolean }) => {
    const Icon = item.icon;
    return (
      <a
        href={item.path}
        onClick={(e) => {
          e.preventDefault();
          setSelected(item.title);
          router.push(item.path);
        }}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden cursor-pointer
          ${isActive
            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/50'
            : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-slate-800/50 dark:hover:text-white'
          }
          ${isCollapsed ? 'justify-center' : ''}
        `}
      >
        <Icon
          className={`relative z-10 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${
            isActive ? 'animate-pulse' : ''
          }`}
          size={20}
        />
        {!isCollapsed && (
          <span className="relative z-10 font-medium text-sm truncate">{item.title}</span>
        )}
        {isCollapsed && (
          <div className="absolute left-full ml-6 px-3 py-2 bg-gray-800 dark:bg-slate-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl pointer-events-none">
            {item.title}
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-gray-800 dark:border-r-slate-800"></div>
          </div>
        )}
      </a>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-slate-700/50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              StudyBuddy
            </h1>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsCollapsed(!isCollapsed);
              setIsMobileOpen(false);
            }}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors lg:block hidden text-gray-900 dark:text-white cursor-pointer"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors lg:hidden text-gray-900 dark:text-white cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* User Profile */}
      {!isCollapsed && (
        <div className="p-6 border-b border-gray-200 dark:border-slate-700/50">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Image
                src={user?.avatar.url || Avatar}
                alt="User avatar"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full ring-4 ring-indigo-500/30 transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate text-gray-900 dark:text-white">
                {user?.name || 'Guest User'}
              </h3>
              <p className="text-xs truncate text-gray-600 dark:text-gray-400">
                ~ {user?.role || 'User'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed Profile */}
      {isCollapsed && (
        <div className="p-4 border-b border-gray-200 dark:border-slate-700/50 flex justify-center">
          <div className="relative group">
            <Image
              src={user?.avatar.url || Avatar}
              alt="User avatar"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full ring-4 ring-indigo-500/30 transition-transform duration-300 hover:scale-110"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
          </div>
        </div>
      )}

      {/* Menu Sections */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-6 custom-scrollbar">
        {menuSections.map((section, idx) => (
          <div key={idx}>
            {!isCollapsed && (
              <h2 className="text-xs font-semibold uppercase tracking-wider mb-3 px-2 text-gray-600 dark:text-gray-500">
                {section.title}
              </h2>
            )}
            {isCollapsed && section.items.length > 0 && (
              <div className="h-px mb-3 bg-gray-200 dark:bg-slate-700/50"></div>
            )}
            <div className="space-y-1">
              {section.items.map((item, itemIdx) => (
                <MenuItem key={itemIdx} item={item} isActive={selected === item.title} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200 dark:border-slate-700/50">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-300 group cursor-pointer
            ${isCollapsed ? 'justify-center' : ''}
          `}
        >
          <LogOut
            className="relative z-10 flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
            size={20}
          />
          {!isCollapsed && (
            <span className="relative z-10 font-medium text-sm">Logout</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-10 p-3 bg-white dark:bg-slate-900 text-gray-900 dark:text-white rounded-xl shadow-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-white z-40 transition-all duration-300 ease-in-out shadow-2xl
          ${isCollapsed ? 'w-20' : 'w-72'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <SidebarContent />
      </aside>

      {/* Main Content Spacer */}
      <div
        className={`hidden lg:block transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-72'
        }`}
      ></div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </>
  );
};

export default Sidebar;

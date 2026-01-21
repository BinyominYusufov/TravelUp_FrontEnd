import { useLocation, Link } from 'react-router-dom';
import { Home, Search, Calendar, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/destinations', label: 'Explore', icon: Search },
  { href: '/bookings', label: 'My Bookings', icon: Calendar },
  { href: '/profile', label: 'Profile', icon: User },
];

export const BottomNavigation = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border md:hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors',
                  active
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className={cn('w-5 h-5 transition-transform', active && 'scale-110')} />
                <span className={cn('text-xs font-medium', active && 'font-semibold')}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

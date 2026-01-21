import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { BottomNavigation } from './BottomNavigation';

interface LayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

export const Layout = ({ children, showFooter = true }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16 pb-20 md:pb-0">{children}</main>
      {showFooter && <Footer />}
      <BottomNavigation />
    </div>
  );
};

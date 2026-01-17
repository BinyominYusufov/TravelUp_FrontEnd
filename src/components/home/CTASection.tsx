import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CTASection = () => {
  return (
    <section className="py-24 gradient-hero relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/3 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold text-white text-balance">
            Start Your Journey Today
          </h2>
          <p className="text-xl text-white/80 max-w-xl mx-auto">
            Join thousands of travelers discovering their dream destinations
          </p>
          <Button
            size="lg"
            className="bg-white text-primary hover:bg-white/90 shadow-lg px-8 py-6 text-lg font-semibold group"
            asChild
          >
            <Link to="/register">
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Activity,
  BarChart3,
  Heart,
  Users,
  ArrowRight,
  Shield,
  CheckCircle,
  Star,
} from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Kidney Match Pro
            </span>
          </div>
          <Button onClick={() => navigate('/login')} variant="outline">
            Login
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e5,#06b6d4)] opacity-10" />
        <div className="relative mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
               Kidney Paired Matching Systems 
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Advanced analytics and real-time matching for healthcare professionals.
              Streamline your kidney transplant matching process with precision and care.
              <div className="my-8 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-primary/20"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-background px-4">
                    <Star className="h-6 w-6 text-primary/40" />
                  </span>
                </div>
              </div>
              <p className="font-['Noto_Naskh_Arabic'] text-2xl sm:text-3xl text-primary/90 my-4 leading-relaxed">
                ومن أحياها فكأنما أحيا الناس جميعا
              </p>
              <p className="italic text-muted-foreground">
                "If any one saved a life, it would be as if he saved the life of the whole people."
              </p>
              <div className="my-8 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-primary/20"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-background px-4">
                    <Star className="h-6 w-6 text-primary/40" />
                  </span>
                </div>
              </div>
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Button size="lg" onClick={() => navigate('/login')} className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/learn-more')}>
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Activity}
              title="Real-Time Matching"
              description="Advanced HLA and PRA analysis for optimal donor-recipient matching."
            />
            <FeatureCard
              icon={Shield}
              title="Secure Data Management"
              description="HIPAA-compliant storage and handling of sensitive medical data."
            />
            <FeatureCard
              icon={CheckCircle}
              title="Automated Compatibility"
              description="Instant compatibility checks based on multiple medical criteria."
            />
            <FeatureCard
              icon={Users}
              title="Patient Management"
              description="Comprehensive donor and recipient data management system."
            />
            <FeatureCard
              icon={BarChart3}
              title="Analytics Dashboard"
              description="Real-time statistics and insights for informed decision making."
            />
            <FeatureCard
              icon={Heart}
              title="Medical Compliance"
              description="Built to medical standards with healthcare professional input."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Transplant Program?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join leading healthcare institutions in revolutionizing kidney transplant
            matching with our advanced platform.
          </p>
          <Button size="lg" onClick={() => navigate('/login')} className="gap-2">
            Start Now <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2024 Kidney Match Pro. All rights reserved.</p>
          <p className="mt-2">
            Designed for healthcare professionals to streamline kidney transplant matching.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Activity;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-6 transition-all hover:shadow-lg">
      <Icon className="h-12 w-12 text-primary mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Heart,
  ArrowLeft,
  Microscope,
  Code,
  Shield,
  Brain,
  Database,
  Users,
} from 'lucide-react';

export function LearnMore() {
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
          <Button onClick={() => navigate('/')} variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* System Overview */}
        <section className="mb-16">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            About Kidney Match Pro
          </h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-muted-foreground">
              Kidney Match Pro is a comprehensive donation and matching system designed to revolutionize
              the process of managing kidney donors and transplant recipients. Our platform combines
              cutting-edge technology with medical expertise to provide a robust solution for healthcare
              professionals.
            </p>
            <div className="my-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-primary/20"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-4">
                  <Heart className="h-6 w-6 text-primary/40" />
                </span>
              </div>
            </div>
            <div className="text-center">
              <p className="font-['Noto_Naskh_Arabic'] text-2xl sm:text-3xl text-primary/90 my-4 leading-relaxed">
                ومن أحياها فكأنما أحيا الناس جميعا
              </p>
              <p className="italic text-muted-foreground">
                "If any one saved a life, it would be as if he saved the life of the whole people."
              </p>
            </div>
            <div className="my-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-primary/20"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-4">
                  <Heart className="h-6 w-6 text-primary/40" />
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Key System Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">System Features</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Brain}
              title="Advanced Matching Algorithms"
              description="Sophisticated algorithms considering HLA typing, PRA levels, and other clinical parameters for optimal matching."
            />
            <FeatureCard
              icon={Shield}
              title="Security First"
              description="Role-based access controls and secure data handling ensuring HIPAA compliance and patient data protection."
            />
            <FeatureCard
              icon={Database}
              title="Comprehensive Data Management"
              description="Efficient storage and processing of donor and recipient information with advanced filtering capabilities."
            />
            <FeatureCard
              icon={Users}
              title="Multi-Role Support"
              description="Specialized interfaces for administrators, doctors, and nurses to streamline their specific workflows."
            />
            <FeatureCard
              icon={Microscope}
              title="Clinical Integration"
              description="Seamless integration with existing clinical workflows and decision-making processes."
            />
            <FeatureCard
              icon={Code}
              title="Modern Architecture"
              description="Built with the latest technology stack ensuring scalability, reliability, and performance."
            />
          </div>
        </section>

        {/* Leadership Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Leadership & Expertise</h2>
          
          {/* Scientific Supervision */}
          <div className="mb-12 bg-card rounded-lg p-8 border">
            <h3 className="text-2xl font-semibold mb-4">Scientific Supervision</h3>
            <div className="flex flex-col gap-4">
              <div>
                <h4 className="text-xl font-medium text-primary">Dr. Ali Faqehi</h4>
                <p className="text-muted-foreground">Head of Nephrology Department</p>
                <p className="mt-2">
                  Leads the medical oversight of the system, ensuring all processes align with
                  current medical standards and ethical guidelines. Responsible for validating
                  the clinical accuracy of matching algorithms and treatment protocols.
                </p>
              </div>
            </div>
          </div>

          {/* Development Team */}
          <div className="bg-card rounded-lg p-8 border">
            <h3 className="text-2xl font-semibold mb-4">Design and Development</h3>
            <div className="flex flex-col gap-4">
              <div>
                <h4 className="text-xl font-medium text-primary">Dr. Mohammed Aayed Al-Shahri</h4>
                <p className="text-muted-foreground">Internal Medicine Physician & Technical Lead</p>
                <p className="mt-2">
                  Member of the Alpha-medi Information Technology Foundation, bringing together
                  medical expertise and technical innovation. Oversees the platform's
                  technical architecture, user experience design, and implementation of
                  security protocols.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2024 Kidney Match Pro. All rights reserved.</p>
          <p className="mt-2">
            Committed to advancing kidney transplant care through technology and expertise.
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
  icon: typeof Brain;
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
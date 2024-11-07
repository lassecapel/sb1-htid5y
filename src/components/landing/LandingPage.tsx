import React from 'react';
import { HeroSection } from './HeroSection';
import { ScientificMethodsSection } from './ScientificMethodsSection';
import { FeaturesSection } from './FeaturesSection';
import { MetricsSection } from './MetricsSection';
import { TestimonialsSection } from './TestimonialsSection';
import { CTASection } from './CTASection';

export function LandingPage() {
  const handleLearnMore = (e: React.MouseEvent) => {
    e.preventDefault();
    const scienceSection = document.getElementById('science');
    if (scienceSection) {
      scienceSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <HeroSection onLearnMore={handleLearnMore} />
      <ScientificMethodsSection />
      <FeaturesSection />
      <MetricsSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}
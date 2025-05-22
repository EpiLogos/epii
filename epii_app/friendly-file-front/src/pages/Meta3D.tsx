/**
 * Meta3D Page
 *
 * This page component renders the Meta3D visualization using the refactored
 * Bimba-aligned vertical slice architecture.
 */

import React from 'react';
import Meta3DIntegration from '../subsystems/1_paramasiva/5_integration/Meta3DIntegration';
import PageTransition from '../components/layout/PageTransition';
import GeometricBackground from '../components/ui/GeometricBackground';
import ModuleNavigation from '../components/layout/ModuleNavigation';
import { Info } from 'lucide-react';

const Meta3D: React.FC = () => {
  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16">
        <GeometricBackground density={8} opacity={0.02} />

        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-light mb-2">Meta Structure 3D</h1>
            <p className="text-foreground/70">
              Explore the Epi-Logos meta structure in 3D. This visualization represents the quaternary logic (Paramasiva)
              at the heart of Epi-Logos, where epistemology, form, and function interconnect in three dimensions.
            </p>

            {/* Module Navigation */}
            <ModuleNavigation currentModule="0/1" />
          </div>

          {/* Meta3D Integration */}
          <Meta3DIntegration />

          {/* Philosophical Framework Note */}
          <div className="mt-8 bg-epii-dark/40 neo-glow rounded-lg p-6">
            <div className="flex items-start gap-3">
              <Info className="text-epii-neon mt-1 h-5 w-5" />
              <div>
                <h3 className="text-lg text-epii-neon mb-2">About the Meta Structure</h3>
                <p className="text-foreground/70 text-sm">
                  This 3D visualization represents the quaternary logic (Paramasiva) at the heart of Epi-Logos,
                  where epistemology, form, and function interconnect. The diamond structure embodies the
                  Bimba-Pratibimba architecture, with mapped nodes positioned according to their Bimba coordinates
                  and unmapped nodes orbiting their parents in a dynamic, self-organizing system.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Meta3D;

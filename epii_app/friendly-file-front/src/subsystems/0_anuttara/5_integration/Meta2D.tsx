/**
 * Meta2D Page
 *
 * This page displays the 2D visualization of the Epi-Logos meta structure.
 * It uses the Meta2DIntegration component from the subsystems directory.
 * It aligns with the #0000 module (Anuttara).
 */

import React from 'react';
import Meta2DIntegration from './Meta2DIntegration';
import PageTransition from '../../../shared/components/layout/PageTransition';
import GeometricBackground from '../../../shared/components/ui/GeometricBackground';
import ModuleNavigation from '../../../shared/components/layout/ModuleNavigation';
import { Info } from 'lucide-react';

const Meta2D: React.FC = () => {
  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16">
        <GeometricBackground density={8} opacity={0.02} />

        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-light mb-2">Meta Structure 2D</h1>
            <p className="text-foreground/70">
              Explore the Epi-Logos meta structure in 2D. This visualization represents the foundational structure (Anuttara)
              at the heart of Epi-Logos, where epistemology, form, and function interconnect.
            </p>

            {/* Module Navigation */}
            <ModuleNavigation currentModule="0000" />
          </div>

          {/* Meta2D Integration */}
          <Meta2DIntegration />

          {/* Philosophical Framework Note */}
          <div className="mt-8 bg-epii-dark/40 neo-glow rounded-lg p-6">
            <div className="flex items-start gap-3">
              <Info className="text-epii-neon mt-1 h-5 w-5" />
              <div>
                <h3 className="text-lg text-epii-neon mb-2">About the Meta Structure</h3>
                <p className="text-foreground/70 text-sm">
                  This 2D visualization represents the foundational structure (Anuttara) at the heart of Epi-Logos,
                  where epistemology, form, and function interconnect. The hexagonal layout embodies the quaternary logic
                  of the Bimba-Pratibimba architecture, with mapped nodes positioned according to their Bimba coordinates
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

export default Meta2D;

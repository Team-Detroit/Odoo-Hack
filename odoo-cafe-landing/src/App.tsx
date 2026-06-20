import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ValueProp } from './components/ValueProp';
import { CoreModules } from './components/CoreModules';
import { ProcessFlow } from './components/ProcessFlow';
import { RoleBasedExperience } from './components/RoleBasedExperience';
import { SelfOrderQR } from './components/SelfOrderQR';
import { KitchenDisplay } from './components/KitchenDisplay';
import { Reporting } from './components/Reporting';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
export function App() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-brand-100 selection:text-brand-900">
      <Navbar />
      <main>
        <Hero />
        <ValueProp />
        <CoreModules />
        <ProcessFlow />
        <RoleBasedExperience />
        <SelfOrderQR />
        <KitchenDisplay />
        <Reporting />
        <FinalCTA />
      </main>
      <Footer />
    </div>);

}
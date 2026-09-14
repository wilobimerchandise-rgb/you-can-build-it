import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import AgeTracks from '@/components/AgeTracks';
import UISpec from '@/components/UISpec';
import UserFlows from '@/components/UserFlows';
import Templates from '@/components/Templates';
import WhyUs from '@/components/WhyUs';
import ParentHQ from '@/components/ParentHQ';
import Safety from '@/components/Safety';
import Playbook from '@/components/Playbook';
import Roadmap from '@/components/Roadmap';
import Pricing from '@/components/Pricing';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ink-950">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <AgeTracks />
        <UISpec />
        <UserFlows />
        <Templates />
        <WhyUs />
        <ParentHQ />
        <Safety />
        <Playbook />
        <Roadmap />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;

import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import WhyUsSection from '../components/landing/WhyUsSection';
import ContactSection from '../components/landing/ContactSection';

const LandingPage = () => {
    return (
        <div className="w-full bg-white text-gray-800">
            <HeroSection />
            <FeaturesSection />
            <WhyUsSection />
            <ContactSection />
        </div>
    );
};

export default LandingPage;

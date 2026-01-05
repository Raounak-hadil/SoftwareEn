"use client";

import { useEffect, useState } from "react";

type NavItem = {
  id: string;
  label: string;
  target: string;
};

type NavbarProps = {
  onLoginClick?: () => void;
};

const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", target: "home" },
  { id: "mission", label: "Mission", target: "mission" },
  { id: "donors", label: "Permanent Donors", target: "donors" },
  { id: "hospitals", label: "Hospitals", target: "hospitals" },
  { id: "statistics", label: "Statistics", target: "statistics" },
  { id: "faq", label: "FAQ", target: "faq" },
];

const scrollToSection = (targetId: string): void => {
  const element = document.getElementById(targetId);
  if (!element) return;

  const offset = 80;
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;
  window.scrollTo({ top: offsetPosition, behavior: "smooth" });
};

const Navbar = ({ onLoginClick }: NavbarProps): JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = (): void => {
      setScrolled(window.scrollY > 30);
      const currentSection = NAV_ITEMS.find((item) => {
        const element = document.getElementById(item.target);
        if (!element) return false;

        const rect = element.getBoundingClientRect();
        return rect.top <= 120 && rect.bottom >= 120;
      });

      if (currentSection) {
        setActiveSection(currentSection.target);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (item: NavItem): void => {
    scrollToSection(item.target);
    setIsMenuOpen(false);
  };

  return (
    <>
      <header
        className={`hidden md:block fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
          scrolled ? "shadow-md" : ""
        }`}
      >
        <div className="flex items-center justify-end px-8 h-16 max-w-7xl mx-auto">
          <nav className="flex items-center gap-6">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.target;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item)}
                  className={`text-sm font-medium transition-all duration-300 py-1 ${
                    isActive
                      ? "text-gray-900 border-b-2 border-gray-900"
                      : "text-gray-700 hover:text-[#C50000]"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={onLoginClick}
              className="px-6 py-2 bg-[#C50000] text-white rounded font-medium hover:bg-[#A00000] transition-all duration-300"
            >
              Log In
            </button>
          </nav>
        </div>
      </header>

      <header
        className={`md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 ${
          scrolled ? "shadow-md" : ""
        }`}
      >
        <div className="flex items-center justify-between px-4 h-16">
          <span className="text-lg font-bold text-[#C50000]">BloodManagement</span>
          <button
            type="button"
            className="p-2 transition-transform duration-300 hover:scale-110 active:scale-95"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              <span
                className={`absolute top-0 left-0 w-6 h-0.5 bg-gray-900 transition-all duration-300 ${
                  isMenuOpen ? "rotate-45 top-2.5" : ""
                }`}
              />
              <span
                className={`absolute top-2.5 left-0 w-6 h-0.5 bg-gray-900 transition-all duration-300 ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`absolute top-5 left-0 w-6 h-0.5 bg-gray-900 transition-all duration-300 ${
                  isMenuOpen ? "-rotate-45 top-2.5" : ""
                }`}
              />
            </div>
          </button>
        </div>

        <div
          className={`bg-white border-t border-gray-200 transition-all duration-300 overflow-hidden ${
            isMenuOpen ? "max-h-[500px]" : "max-h-0"
          }`}
        >
          <div className="px-6 py-4 space-y-3">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item)}
                className={`w-full text-left py-2 ${
                  activeSection === item.target ? "text-[#C50000] font-semibold" : "text-gray-700"
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                onLoginClick?.();
              }}
              className="w-full bg-[#C50000] text-white py-2 rounded-lg font-medium hover:bg-[#A00000] transition-all duration-300"
            >
              Log In
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;

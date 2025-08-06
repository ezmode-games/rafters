import { gsap } from 'gsap';
import { Layers, Palette, Space, Type } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface SidebarSection {
  id: 'color' | 'typography' | 'spacing' | 'depth';
  name: string;
  completed: boolean;
  collapsed: boolean;
  primaryValue?: string; // Main color, font name, spacing value, shadow value
}

export interface ProgressiveSidebarProps {
  sections: SidebarSection[];
  onSectionClick: (sectionId: string) => void;
}

export function ProgressiveSidebar({ sections, onSectionClick }: ProgressiveSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  // Show all sections for now (not just completed and collapsed)
  const visibleSections = sections;

  // Icon mapping
  const iconMap = {
    color: Palette,
    typography: Type,
    spacing: Space,
    depth: Layers,
  };

  // Genie hover effect
  const playGenieEffect = useCallback((sectionId: string) => {
    const iconRef = iconRefs.current[sectionId];
    if (!iconRef) return;

    gsap.to(iconRef, {
      scale: 1.3,
      duration: 0.2,
      ease: 'back.out(1.7)',
      yoyo: true,
      repeat: 1,
    });
  }, []);

  // Animate icon appearance when section becomes visible
  const animateIconIn = useCallback((iconElement: HTMLElement, index: number) => {
    gsap.fromTo(
      iconElement,
      {
        opacity: 0,
        scale: 0,
        y: 20,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.4,
        delay: index * 0.1, // Stagger appearance
        ease: 'back.out(1.4)',
      }
    );
  }, []);

  // Animate icon removal when section is no longer visible
  const animateIconOut = (iconElement: HTMLElement) => {
    gsap.to(iconElement, {
      opacity: 0,
      scale: 0,
      y: -20,
      duration: 0.3,
      ease: 'back.in(1.4)',
    });
  };

  // Handle hover effects
  useEffect(() => {
    if (hoveredSection) {
      playGenieEffect(hoveredSection);
    }
  }, [hoveredSection, playGenieEffect]);

  // Handle icon animations when visibility changes
  useEffect(() => {
    for (const [index, section] of visibleSections.entries()) {
      const iconElement = iconRefs.current[section.id];
      if (iconElement) {
        // Check if this icon just became visible
        const wasVisible = iconElement.style.opacity !== '0';
        if (!wasVisible) {
          animateIconIn(iconElement, index);
        }
      }
    }
  }, [visibleSections, animateIconIn]);

  // Don't render anything if no sections are completed and collapsed
  if (visibleSections.length === 0) {
    return null;
  }

  return (
    <div ref={sidebarRef} className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50">
      <div className="flex flex-col gap-4">
        {visibleSections.map((section, index) => {
          const IconComponent = iconMap[section.id];

          return (
            <button
              key={section.id}
              ref={(el) => {
                iconRefs.current[section.id] = el;
              }}
              type="button"
              className="relative group cursor-pointer border-none bg-transparent p-0"
              onMouseEnter={() => setHoveredSection(section.id)}
              onMouseLeave={() => setHoveredSection(null)}
              onClick={() => onSectionClick(section.id)}
              tabIndex={0}
              aria-label={`Open ${section.name} section`}
              style={{ opacity: 0 }} // Start invisible, animate in
            >
              {/* Icon Container */}
              <div className="w-14 h-14 bg-white rounded-xl shadow-lg flex items-center justify-center transition-shadow hover:shadow-xl">
                <IconComponent className="w-7 h-7 text-gray-700" />
              </div>

              {/* Primary Value Display */}
              {section.primaryValue && (
                <div className="absolute -right-1 -top-1 w-6 h-6 rounded-full border-2 border-white shadow-sm overflow-hidden">
                  {section.id === 'color' ? (
                    <div
                      className="w-full h-full"
                      style={{ backgroundColor: section.primaryValue }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-600">
                        {section.id === 'typography' ? 'T' : section.id === 'spacing' ? 'S' : 'D'}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Hover Label */}
              <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-gray-900 text-white text-sm px-2 py-1 rounded whitespace-nowrap">
                  {section.name}
                  {section.primaryValue && section.id !== 'color' && (
                    <span className="ml-2 text-gray-300">{section.primaryValue}</span>
                  )}
                </div>
                {/* Arrow */}
                <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Progress Indicator */}
      <div className="mt-6 flex flex-col items-center">
        <div className="w-px h-8 bg-gray-200" />
        <div className="text-xs text-gray-500 mt-2 writing-mode-vertical text-center">
          {visibleSections.length}/4
        </div>
      </div>
    </div>
  );
}

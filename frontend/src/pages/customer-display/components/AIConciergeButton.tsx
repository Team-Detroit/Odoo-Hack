import React, { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles } from 'lucide-react';

interface AIConciergeButtonProps {
  onClick: () => void;
  isOpen: boolean;
  showIndicator: boolean;
}

export const AIConciergeButton: React.FC<AIConciergeButtonProps> = ({ onClick, isOpen, showIndicator }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const initialPos = useRef({ x: 0, y: 0 });

  // Initialize position in bottom right
  useEffect(() => {
    const handleResize = () => {
      // Position 24px from right, 24px from bottom
      const initialX = window.innerWidth - 80;
      const initialY = window.innerHeight - 80;
      setPosition({ x: initialX, y: initialY });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only capture left click
    if (e.button !== 0) return;
    setIsDragging(false); // Reset dragging state on mouse down
    dragStart.current = { x: e.clientX, y: e.clientY };
    initialPos.current = { x: position.x, y: position.y };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;

    // Determine if user has dragged past threshold to avoid false clicks
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      setIsDragging(true);
    }

    let newX = initialPos.current.x + dx;
    let newY = initialPos.current.y + dy;

    // Keep button within screen bounds
    const btnWidth = buttonRef.current?.offsetWidth || 56;
    const btnHeight = buttonRef.current?.offsetHeight || 56;
    newX = Math.max(16, Math.min(newX, window.innerWidth - btnWidth - 16));
    newY = Math.max(16, Math.min(newY, window.innerHeight - btnHeight - 16));

    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(false);
    const touch = e.touches[0];
    dragStart.current = { x: touch.clientX, y: touch.clientY };
    initialPos.current = { x: position.x, y: position.y };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleTouchMove = (e: TouchEvent) => {
    const touch = e.touches[0];
    const dx = touch.clientX - dragStart.current.x;
    const dy = touch.clientY - dragStart.current.y;

    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      setIsDragging(true);
    }

    let newX = initialPos.current.x + dx;
    let newY = initialPos.current.y + dy;

    const btnWidth = buttonRef.current?.offsetWidth || 56;
    const btnHeight = buttonRef.current?.offsetHeight || 56;
    newX = Math.max(10, Math.min(newX, window.innerWidth - btnWidth - 10));
    newY = Math.max(10, Math.min(newY, window.innerHeight - btnHeight - 10));

    setPosition({ x: newX, y: newY });
  };

  const handleTouchEnd = () => {
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  };

  const [bubbleClosed, setBubbleClosed] = useState(false);

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    // If user dragged, do not trigger click callback
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onClick();
  };

  return (
    <div
      className="fixed z-[9999]"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transition: isDragging ? 'none' : 'all 0.15s ease-out',
      }}
    >
      {/* Reto Speech Bubble popup */}
      {!isOpen && !bubbleClosed && (
        <div className="absolute bottom-20 right-0 animate-slide-up select-none whitespace-nowrap z-50">
          <div className="bg-white border-2 border-black rounded-2xl px-4 py-2.5 shadow-[4px_4px_0px_#000] text-xs font-black text-gray-800 flex items-center gap-2 relative">
            {/* Close Button on speech bubble */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setBubbleClosed(true);
              }}
              className="absolute -top-2.5 -left-2.5 w-5 h-5 bg-orange-500 hover:bg-orange-600 border-2 border-black rounded-full flex items-center justify-center text-white text-[9px] font-black cursor-pointer shadow transition-transform hover:scale-110"
            >
              ✕
            </button>

            <span>👉 Ask me anything about Odoo Cafe!</span>
            
            {/* Triangular pointer */}
            <div className="absolute right-6 -bottom-2 w-3.5 h-3.5 bg-white border-r-2 border-b-2 border-black rotate-45"></div>
          </div>
        </div>
      )}

      {/* Barista Cat Circular Button */}
      <button
        ref={buttonRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={handleClick}
        className={`w-16 h-16 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing border-2 border-black transition-all duration-200 relative shadow-[4px_4px_0px_#000] hover:scale-105 active:scale-95 z-40
          ${isOpen 
            ? 'bg-[#00A09D]' 
            : 'bg-[#714B67]'
          }`}
      >
        <div className="w-13 h-13 rounded-full border border-black overflow-hidden bg-white">
          <img src="/barista-cat.png" alt="Barista Cat Mascot" className="w-full h-full object-cover" />
        </div>
        <div className="absolute -top-1 -right-1 bg-[#00A09D] border border-black rounded-full p-1 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
        </div>
      </button>

      {showIndicator && !isOpen && bubbleClosed && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-[#714B67] text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow border border-black uppercase tracking-wider animate-bounce flex items-center gap-1 select-none whitespace-nowrap">
          <span>↗ Ask Odoo</span>
        </div>
      )}
    </div>
  );
};

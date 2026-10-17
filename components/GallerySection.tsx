"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryPhoto {
  id: string;
  imageSrc: string;
  title: string;
  caption: string;
  frameSrc: string;
  width: number;
  height: number;
  top: string;
  left: string;
  floatDuration: number;
  rotationDrift: number;
  isCenterpiece?: boolean;
}

const GALLERY_ITEMS: GalleryPhoto[] = [
  // Top Row (mirroring Sirius, Umbridge/McGonagall, Bellatrix)
  {
    id: "mem-1",
    imageSrc: "/gallery/event-1.jpg",
    title: "The Gathering",
    caption: "Attendees kicking off the day at WCE.",
    frameSrc: "/frames/frame-square.png",
    width: 230,
    height: 290,
    top: "3%",
    left: "7%",
    floatDuration: 6.2,
    rotationDrift: 1.8,
  },
  {
    id: "mem-2",
    imageSrc: "/gallery/event-2.jpg",
    title: "Microservices Workshop",
    caption: "Hands-on microservice architectures and deployments.",
    frameSrc: "/frames/frame-oval.png",
    width: 240,
    height: 290,
    top: "2%",
    left: "40%",
    floatDuration: 7.8,
    rotationDrift: -1.5,
  },
  {
    id: "mem-3",
    imageSrc: "/gallery/event-3.jpg",
    title: "Git & GitHub Labs",
    caption: "Demystifying commits, branching, and interactive rebasing.",
    frameSrc: "/frames/frame-gothic.png",
    width: 230,
    height: 290,
    top: "4%",
    left: "73%",
    floatDuration: 6.8,
    rotationDrift: 2.0,
  },

  // Middle Tier (mirroring Lucius, Grand Centerpiece Dumbledore, Snape)
  {
    id: "mem-4",
    imageSrc: "/gallery/event-4.jpg",
    title: "Terminal Sorcery",
    caption: "Late afternoon problem solving and mentoring.",
    frameSrc: "/frames/frame-square.png",
    width: 240,
    height: 300,
    top: "34%",
    left: "13%",
    floatDuration: 5.9,
    rotationDrift: -1.9,
  },
  {
    id: "mem-5",
    imageSrc: "/gallery/event-5.jpg",
    title: "The Grand Assembly",
    caption: "The keynote hall alive with open source passion and energy.",
    frameSrc: "/frames/frame-gothic.png",
    width: 295,
    height: 380,
    top: "26%",
    left: "38%",
    floatDuration: 8.4,
    rotationDrift: 1.2,
    isCenterpiece: true,
  },
  {
    id: "mem-6",
    imageSrc: "/gallery/event-6.jpg",
    title: "Code & Collaboration",
    caption: "Peer programming, architecture debates, and lightning hacks.",
    frameSrc: "/frames/frame-square.png",
    width: 240,
    height: 300,
    top: "33%",
    left: "69%",
    floatDuration: 6.6,
    rotationDrift: 1.7,
  },

  // Bottom Row (mirroring Hagrid, Hedwig/Rita, Lockhart)
  {
    id: "mem-7",
    imageSrc: "/gallery/event-7.jpg",
    title: "The Mentorship Circle",
    caption: "Senior engineers guiding newcomers through their first contributions.",
    frameSrc: "/frames/frame-square.png",
    width: 250,
    height: 310,
    top: "66%",
    left: "9%",
    floatDuration: 6.4,
    rotationDrift: 2.1,
  },
  {
    id: "mem-8",
    imageSrc: "/gallery/event-8.jpg",
    title: "Open Source Odyssey",
    caption: "Exploring distributed systems and real-world Linux tools.",
    frameSrc: "/frames/frame-oval.png",
    width: 235,
    height: 290,
    top: "68%",
    left: "40.5%",
    floatDuration: 7.4,
    rotationDrift: -1.6,
  },
  {
    id: "mem-9",
    imageSrc: "/gallery/event-9.jpg",
    title: "The Finale",
    caption: "Certificates, swags, and closing open source celebrations.",
    frameSrc: "/frames/frame-gothic.png",
    width: 240,
    height: 300,
    top: "65%",
    left: "72%",
    floatDuration: 6.9,
    rotationDrift: -1.8,
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 320 : -320,
    opacity: 0,
    scale: 0.9,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 320 : -320,
    opacity: 0,
    scale: 0.9,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  }),
};

export default function GallerySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<number>(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowRight") paginate(1);
      if (e.key === "ArrowLeft") paginate(-1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex]);

  const paginate = (newDirection: number) => {
    if (selectedIndex === null) return;
    setDirection(newDirection);
    setSelectedIndex((prev) => {
      if (prev === null) return 0;
      const next = prev + newDirection;
      if (next < 0) return GALLERY_ITEMS.length - 1;
      if (next >= GALLERY_ITEMS.length) return 0;
      return next;
    });
  };

  return (
    <section id="gallery" className="relative w-full min-h-[130vh] bg-[#0E081F] overflow-hidden select-none py-20 px-4">
      {/* Background glow effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-purple-900/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[450px] h-[450px] bg-amber-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Section Header */}
      <div className="relative z-10 text-center mb-10 flex flex-col items-center">
        <p className="flex items-center gap-3 text-[#ffd15c] text-base font-semibold mb-3">
          <img
            src="/assets/images/lantern-icon.webp"
            alt=""
            width={73}
            height={120}
            className="w-auto h-[34px] -rotate-2"
          />
          Stop 3: Memory Lane
        </p>
        <h2 className="text-4xl md:text-5xl font-normal text-[#f6f0ff] tracking-normal font-serif">
          The Hall of Memories
        </h2>
        <p className="text-[#d8ccf0] text-sm md:text-base mt-3 max-w-[56ch]">
          Click any floating frame to view
        </p>
      </div>

      {/* Salon Wall Floating Canvas */}
      <div ref={containerRef} className="relative w-full max-w-[1240px] mx-auto h-[1050px]">
        {GALLERY_ITEMS.map((item, index) => (
          <motion.div
            key={item.id}
            drag
            dragConstraints={containerRef}
            dragElastic={0.2}
            whileHover={{ scale: 1.05, zIndex: 50 }}
            whileTap={{ scale: 0.98 }}
            animate={{
              y: [0, -16, 14, 0],
              rotate: [0, item.rotationDrift, -item.rotationDrift, 0],
            }}
            transition={{
              y: {
                duration: item.floatDuration,
                repeat: Infinity,
                ease: "easeInOut",
              },
              rotate: {
                duration: item.floatDuration * 1.25,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            onClick={() => {
              setDirection(0);
              setSelectedIndex(index);
            }}
            style={{
              position: "absolute",
              top: item.top,
              left: item.left,
              width: item.width,
              height: item.height,
              zIndex: item.isCenterpiece ? 15 : 10,
            }}
            className="cursor-pointer flex items-center justify-center filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.65)] hover:drop-shadow-[0_20px_40px_rgba(255,122,0,0.3)] transition-all"
          >
            {/* Inner Photo */}
            <div className="absolute w-[62%] h-[66%] rounded-sm overflow-hidden z-10 bg-black/60">
              <img
                src={item.imageSrc}
                alt={item.title}
                className="w-full h-full object-cover pointer-events-none"
              />
            </div>

            {/* Clay Frame Overlay */}
            <img
              src={item.frameSrc}
              alt="Clay Frame"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none z-20"
            />
          </motion.div>
        ))}
      </div>

      {/* Lightbox Slider Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setSelectedIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              className="relative flex flex-col items-center max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedIndex(null)}
                className="absolute -top-10 right-0 text-amber-200/80 hover:text-amber-100 text-sm font-semibold tracking-wider flex items-center gap-1.5 transition-colors"
                aria-label="Close"
              >
                <span>CLOSE</span> ✕
              </button>

              {/* Slider Viewport with Fixed Frame */}
              <div className="relative w-[340px] h-[430px] md:w-[420px] md:h-[520px] flex items-center justify-center filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
                {/* Sliding Photo Mask */}
                <div className="absolute w-[62%] h-[66%] rounded-sm overflow-hidden z-10 bg-black/50">
                  <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    <motion.img
                      key={selectedIndex}
                      src={GALLERY_ITEMS[selectedIndex].imageSrc}
                      alt={GALLERY_ITEMS[selectedIndex].title}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.4}
                      onDragEnd={(_, info) => {
                        if (info.offset.x > 80) paginate(-1);
                        else if (info.offset.x < -80) paginate(1);
                      }}
                      className="w-full h-full object-cover cursor-grab active:cursor-grabbing"
                    />
                  </AnimatePresence>
                </div>

                {/* Frame Bezel */}
                <img
                  src={GALLERY_ITEMS[selectedIndex].frameSrc}
                  alt="Frame Bezel"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none z-20"
                />

                {/* Left/Right Controls */}
                <button
                  onClick={() => paginate(-1)}
                  className="absolute -left-12 md:-left-16 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-purple-950/80 border border-purple-500/30 text-amber-300 hover:bg-purple-900 transition-all flex items-center justify-center z-30 text-lg shadow-lg"
                  aria-label="Previous image"
                >
                  ◀
                </button>
                <button
                  onClick={() => paginate(1)}
                  className="absolute -right-12 md:-right-16 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-purple-950/80 border border-purple-500/30 text-amber-300 hover:bg-purple-900 transition-all flex items-center justify-center z-30 text-lg shadow-lg"
                  aria-label="Next image"
                >
                  ▶
                </button>
              </div>

              {/* Caption and Page Indicator */}
              <div className="text-center mt-6 z-30 max-w-sm">
                <h3 className="text-xl font-bold text-amber-200">
                  {GALLERY_ITEMS[selectedIndex].title}
                </h3>
                <p className="text-purple-300/80 text-xs md:text-sm mt-1">
                  {GALLERY_ITEMS[selectedIndex].caption}
                </p>
                <span className="inline-block mt-3 px-3 py-1 rounded-full bg-purple-900/50 border border-purple-500/20 text-purple-300 text-xs font-mono">
                  {selectedIndex + 1} / {GALLERY_ITEMS.length}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

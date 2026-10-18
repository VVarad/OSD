"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryPhoto {
  id: string;
  imageSrc: string;
  title: string;
  caption: string;
  frameSrc: string;
  frameStyle: "gold" | "silver" | "bronze";
  width: number;
  height: number;
  top: string;
  left: string;
  floatDuration: number;
  rotationDrift: number;
  isCenterpiece?: boolean;
}

const GALLERY_ITEMS: GalleryPhoto[] = [
  // Top Row (Sirius, McGonagall/Umbridge, Bellatrix)
  {
    id: "mem-1",
    imageSrc: "/gallery/event-1.webp",
    title: "The Gathering",
    caption: "Attendees kicking off the day at WCE Sangli.",
    frameSrc: "/frames/frame-square.webp",
    frameStyle: "gold",
    width: 165,
    height: 190,
    top: "25px",
    left: "55px",
    floatDuration: 6.2,
    rotationDrift: 0.9,
  },
  {
    id: "mem-2",
    imageSrc: "/gallery/event-2.webp",
    title: "Microservices Workshop",
    caption: "Hands-on microservice architectures, containers, and deployments.",
    frameSrc: "/frames/frame-oval.webp",
    frameStyle: "gold",
    width: 200,
    height: 135,
    top: "20px",
    left: "370px",
    floatDuration: 7.2,
    rotationDrift: -0.8,
  },
  {
    id: "mem-3",
    imageSrc: "/gallery/event-3.webp",
    title: "Git & GitHub Labs",
    caption: "Demystifying commits, branching, pull requests, and interactive rebasing.",
    frameSrc: "/frames/frame-gothic.webp",
    frameStyle: "gold",
    width: 165,
    height: 190,
    top: "25px",
    left: "720px",
    floatDuration: 6.6,
    rotationDrift: 1.1,
  },

  // Middle Row (Lucius Malfoy, Grand Centerpiece Dumbledore, Severus Snape)
  {
    id: "mem-4",
    imageSrc: "/gallery/event-4.webp",
    title: "Terminal Sorcery",
    caption: "Late afternoon command-line mastery and debugging puzzles.",
    frameSrc: "/frames/frame-square.webp",
    frameStyle: "gold",
    width: 165,
    height: 215,
    top: "195px",
    left: "180px",
    floatDuration: 5.8,
    rotationDrift: -0.9,
  },
  {
    id: "mem-5",
    imageSrc: "/gallery/event-5.webp",
    title: "The Grand Assembly",
    caption: "The keynote hall alive with open source passion and energy.",
    frameSrc: "/frames/frame-gothic.webp",
    frameStyle: "silver",
    width: 220,
    height: 280,
    top: "165px",
    left: "360px",
    floatDuration: 8.0,
    rotationDrift: 0.6,
    isCenterpiece: true,
  },
  {
    id: "mem-6",
    imageSrc: "/gallery/event-6.webp",
    title: "Code & Collaboration",
    caption: "Peer programming, architecture debates, and lightning hacks.",
    frameSrc: "/frames/frame-square.webp",
    frameStyle: "gold",
    width: 165,
    height: 215,
    top: "195px",
    left: "595px",
    floatDuration: 6.5,
    rotationDrift: 0.9,
  },

  // Bottom Row (Hagrid, Rita/Hedwig, Gilderoy Lockhart)
  {
    id: "mem-7",
    imageSrc: "/gallery/event-7.webp",
    title: "The Learning Circle",
    caption: "Guiding newcomers through their first contributions.",
    frameSrc: "/frames/frame-square.webp",
    frameStyle: "bronze",
    width: 165,
    height: 220,
    top: "360px",
    left: "55px",
    floatDuration: 6.4,
    rotationDrift: 1.0,
  },
  {
    id: "mem-8",
    imageSrc: "/gallery/event-8.webp",
    title: "Open Source Odyssey",
    caption: "Exploring distributed systems and real-world Linux tools.",
    frameSrc: "/frames/frame-oval.webp",
    frameStyle: "gold",
    width: 200,
    height: 125,
    top: "465px",
    left: "370px",
    floatDuration: 7.0,
    rotationDrift: -0.8,
  },
  {
    id: "mem-9",
    imageSrc: "/gallery/event-9.webp",
    title: "The Finale",
    caption: "Certificates, swags, and closing open source celebrations.",
    frameSrc: "/frames/frame-gothic.webp",
    frameStyle: "gold",
    width: 165,
    height: 220,
    top: "360px",
    left: "720px",
    floatDuration: 6.8,
    rotationDrift: -1.0,
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
    <section id="gallery" className="relative w-full min-h-[110vh] bg-[#0E081F] overflow-hidden select-none py-16 px-4">
      {/* Background glow effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-purple-900/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[450px] h-[450px] bg-amber-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Section Header */}
      <div className="relative z-10 text-center mb-9 flex flex-col items-center">
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
        <h2 className="text-4xl md:text-5xl font-normal text-[#f6f0ff] tracking-normal font-serif mb-3">
          The Hall of Memories
        </h2>
        <p className="text-[#d8ccf0] text-sm md:text-base max-w-[56ch]">
          Click any floating frame to view
        </p>
      </div>

      {/* Pinned Salon Wall Exhibition Frame */}
      <div className="relative w-full max-w-[1200px] mx-auto flex justify-center px-4 mt-[90px] overflow-visible">
        <div
          ref={containerRef}
          className="relative w-[940px] h-[620px] rounded-[18px] bg-[radial-gradient(circle_at_50%_32%,rgba(255,180,50,0.09)_0%,transparent_60%),radial-gradient(circle_at_18%_78%,rgba(138,77,255,0.12)_0%,transparent_50%),radial-gradient(circle_at_82%_78%,rgba(255,122,0,0.08)_0%,transparent_50%),linear-gradient(145deg,#160e29_0%,#0d071b_50%,#060210_100%)] shadow-[0_35px_100px_rgba(0,0,0,0.95),0_0_50px_rgba(255,122,0,0.15),inset_0_0_100px_rgba(0,0,0,0.92)] shrink-0 origin-top scale-[0.66] -mb-[210px]"
        >
          {/* Master Rectangular Frame Overlay */}
          <img
            src="/frames/frame-square.webp"
            alt="Master Rectangular Frame"
            className="absolute -top-[130px] -left-[190px] w-[1320px] max-w-none h-[885px] max-h-none object-fill pointer-events-none z-25 filter drop-shadow-[0_25px_60px_rgba(0,0,0,0.95)] drop-shadow-[0_0_35px_rgba(255,122,0,0.22)]"
          />

          {GALLERY_ITEMS.map((item, index) => (
            <motion.div
              key={item.id}
              drag
              dragConstraints={containerRef}
              dragElastic={0.2}
              whileHover={{ scale: 1.08, y: -4, zIndex: 55 }}
              whileTap={{ scale: 0.98 }}
              animate={{
                y: [0, -6, 4, 0],
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
              className="cursor-pointer flex items-center justify-center filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] hover:drop-shadow-[0_22px_50px_rgba(255,190,50,0.55)] transition-all"
            >
              {/* Hanging Pin */}
              <span className="absolute -top-[7px] left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[radial-gradient(circle_at_35%_35%,#fff9d6_0%,#ffd700_40%,#b8860b_80%,#59400f_100%)] shadow-[0_3px_6px_rgba(0,0,0,0.8),0_0_8px_rgba(255,215,0,0.6)] z-25 pointer-events-none" />

              {/* Inner Photo */}
              <div className="absolute inset-0 w-full h-full rounded-sm overflow-hidden z-10 bg-[#0c071a] shadow-[inset_0_0_20px_rgba(0,0,0,0.75)]">
                <img
                  src={item.imageSrc}
                  alt={item.title}
                  className="w-full h-full object-cover object-[center_25%] pointer-events-none transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* Ornate Gilded/Silver Frame Bezel */}
              <div
                className={`absolute inset-0 pointer-events-none z-20 ${
                  item.frameStyle === "silver"
                    ? "border-[9px] border-[#b0b8c2] shadow-[0_18px_45px_rgba(0,0,0,0.95),0_0_25px_rgba(200,220,255,0.25),inset_0_0_0_2px_#ffffff,inset_0_0_0_5px_#262a30,inset_0_0_14px_rgba(0,0,0,0.85)]"
                    : item.frameStyle === "bronze"
                    ? "border-[7px] border-[#9c6e3b] shadow-[0_12px_28px_rgba(0,0,0,0.85),inset_0_0_0_2px_#e3cbb1,inset_0_0_0_4px_#42260d,inset_0_0_10px_rgba(0,0,0,0.8)]"
                    : "border-[7px] border-[#d4af37] shadow-[0_12px_28px_rgba(0,0,0,0.85),inset_0_0_0_2px_#fff3bf,inset_0_0_0_4px_#5a3e0b,inset_0_0_10px_rgba(0,0,0,0.8)]"
                }`}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Slider Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
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
              <div className="relative w-[320px] h-[220px] md:w-[520px] md:h-[350px] flex items-center justify-center filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
                {/* Sliding Photo Mask */}
                <div className="absolute w-[74%] h-[67%] rounded-sm overflow-hidden z-10 bg-black/50">
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
                  src="/frames/frame-square.webp"
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

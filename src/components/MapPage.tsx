import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronRight,
  ChevronDown,
  ArrowRight,
  ChevronLeft,
  MapPin,
  Clock,
  ExternalLink,
  Phone,
  X
} from "lucide-react";
import KazakhstanMap, {
  regionsList,
  RegionData,
  citiesList,
  CityData
} from "./KazakhstanMap";
import { gymBranches, GymBranch, getCityLabel, getBranchContact } from "../App";

// Swipe slide variants with optimal smooth translation curves
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

interface AnimatedGymCounterProps {
  target: number;
  active: boolean;
}

const AnimatedGymCounter: React.FC<AnimatedGymCounterProps> = ({
  target,
  active,
}) => {
  const [count, setCount] = useState(1);

  useEffect(() => {
    if (!active) {
      setCount(1);
      return;
    }

    let start = 1;
    const end = target;
    const duration = 1200; // ms
    const startTime = performance.now();

    let animationFrameId: number;

    const updateCount = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Beautiful easeOutExpo curve
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(start + easeProgress * (end - start));

      setCount(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    animationFrameId = requestAnimationFrame(updateCount);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [active, target]);

  return (
    <span className="inline-block tabular-nums font-extrabold text-[#e40011] drop-shadow-[0_0_15px_rgba(228,0,17,0.35)]">
      {count}
    </span>
  );
};

export interface MapPageProps {
  selectedCityId: string | null;
  setSelectedCityId: (id: string | null) => void;
  selectedRegionId: string | null;
  setSelectedRegionId: (id: string | null) => void;
  selectedGymId: string | null;
  setSelectedGymId: (id: string | null) => void;
  activeImgIndex: number;
  setActiveImgIndex: React.Dispatch<React.SetStateAction<number>>;
  slideDirection: number;
  setSlideDirection: React.Dispatch<React.SetStateAction<number>>;
  activeReviewIndex: number;
  setActiveReviewIndex: React.Dispatch<React.SetStateAction<number>>;
  activePriceTab: string;
  setActivePriceTab: (tab: string) => void;
  priceType: "subscriptions" | "one-time";
  setPriceType: (type: "subscriptions" | "one-time") => void;
  sliderProgress: number;
  setSliderProgress: React.Dispatch<React.SetStateAction<number>>;
  isImgZoomed: boolean;
  setIsImgZoomed: (val: boolean) => void;
  chosenCityId: string | null;
  setChosenCityId: (id: string | null) => void;
  chosenGymId: string | null;
  setChosenGymId: (id: string | null) => void;
  setIsBuyModalOpen: (val: boolean) => void;
  setBuyModalCityId: (id: string | null) => void;
  scrollToSectionStr: (id: string, index: number) => void;
  hasScrolledToMap: boolean;
  handleSelectCity: (cityId: string | null) => void;
  hoveredRegion: RegionData | null;
  setHoveredRegion: (region: RegionData | null) => void;
  setCookie: (name: string, value: string, days?: number) => void;
}

export const MapPage: React.FC<MapPageProps> = ({
  selectedCityId,
  setSelectedCityId,
  selectedRegionId,
  setSelectedRegionId,
  selectedGymId,
  setSelectedGymId,
  activeImgIndex,
  setActiveImgIndex,
  slideDirection,
  setSlideDirection,
  activeReviewIndex,
  setActiveReviewIndex,
  activePriceTab,
  setActivePriceTab,
  priceType,
  setPriceType,
  sliderProgress,
  setSliderProgress,
  isImgZoomed,
  setIsImgZoomed,
  chosenCityId,
  setChosenCityId,
  chosenGymId,
  setChosenGymId,
  setIsBuyModalOpen,
  setBuyModalCityId,
  scrollToSectionStr,
  hasScrolledToMap,
  handleSelectCity,
  hoveredRegion,
  setHoveredRegion,
  setCookie,
}) => {
  const selectedCityBranches = selectedCityId
    ? gymBranches.filter((b) => b.cityId === selectedCityId)
    : [];

  return (
    <div
      id="map-section"
      className="relative w-full min-h-screen flex flex-col justify-start bg-black pt-32 pb-16 px-4 sm:px-10 overflow-hidden shrink-0 mt-0"
      onClick={() => {
        if (selectedCityId || selectedRegionId || selectedGymId) {
          handleSelectCity(null);
        }
      }}
    >
      {/* Deep center background red glow behind everything */}
      <div
        className="absolute top-1/2 left-2/3 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] rounded-full bg-[#e40011]/[0.10] blur-[140px] pointer-events-none z-0 animate-pulse"
        style={{ animationDuration: "14s" }}
      />

      <div className="max-w-7xl mx-auto w-full flex flex-col justify-between z-10 relative">
        {/* Title Header for separate Map page with clean Swiss/Modern layout */}
        <div className="mb-0 text-center lg:text-left select-none">
          <span className="text-[10px] uppercase font-sans text-[#e40011] font-black tracking-[0.2em] block mb-2">
            Интерактивный навигатор
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-sans text-white tracking-tight leading-[1.05] uppercase">
            Выбор <span className="text-[#e40011]">зала</span>
          </h1>
          <p className="text-white/50 text-xs sm:text-sm font-sans mt-3 max-w-xl leading-relaxed">
            Выберите город на интерактивной карте или в меню ниже, чтобы посмотреть адреса клубов, типы абонементов, виртуальный тур и отзывы.
          </p>
        </div>

        {/* Split Screen Flex Layout and interactive glass workspace */}
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 min-h-[70vh] w-full lg:items-center items-stretch overflow-visible pt-10 animate-fadeIn">
          {/* Foreground Glassmorphic Workspace Control Panel */}
          <motion.div
            className={`bg-[#0c0c0f] border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col justify-between z-20 overflow-hidden transition-[width,min-width,max-width,height,flex] duration-[850ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${selectedCityId ? "h-fit w-full lg:w-[48%] xl:w-[42%]" : "h-fit w-full lg:w-[36%] xl:w-[32%]"}`}
            id="glassmorphic-workspace"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, x: -50, filter: "blur(8px)" }}
            animate={
              hasScrolledToMap
                ? { opacity: 1, x: 0, filter: "blur(0px)" }
                : { opacity: 0, x: -50, filter: "blur(8px)" }
            }
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.05,
            }}
          >
            <AnimatePresence mode="wait">
              {!selectedCityId ? (
                // If selectedRegionId has multiple cities, we offer the selection of cities within that region
                selectedRegionId &&
                citiesList.filter((c) => c.regionId === selectedRegionId)
                  .length > 1 ? (
                  <motion.div
                    key={`cities-choices-${selectedRegionId}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-6"
                  >
                    {/* Header with back button */}
                    <div className="flex items-center justify-between pb-4 mb-2 border-b border-white/5 pt-1 select-none shrink-0">
                      <button
                        onClick={() => handleSelectCity(null)}
                        className="flex items-center gap-2 text-white/60 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 hover:border-white/10 px-3.5 py-1.5 rounded-full transition-all duration-300 text-[9.5px] uppercase font-sans tracking-widest cursor-pointer font-black"
                      >
                        <ChevronLeft className="w-3.5 h-3.5 text-[#e40011]" />{" "}
                        <span>Все города</span>
                      </button>

                      <div className="text-white/80 text-[10px] sm:text-[11px] font-sans tracking-wide uppercase flex items-center gap-2 max-w-[65%] sm:max-w-none text-right justify-end font-extrabold text-neutral-200">
                        <span className="truncate">
                          {regionsList.find(
                            (r) => r.id === selectedRegionId,
                          )?.name || "Регион"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-2 uppercase font-display">
                        Выберите город
                      </h2>
                      <p className="text-white/60 text-[11.5px] leading-relaxed">
                        В этой области расположено несколько наших филиалов. Пожалуйста, укажите ваш город:
                      </p>
                    </div>

                    {/* List of cities in this region */}
                    <div className="space-y-3 py-1 px-1 select-none">
                      {citiesList
                        .filter((c) => c.regionId === selectedRegionId)
                        .map((city) => {
                          const isChosen = chosenCityId === city.id;
                          return (
                            <button
                              key={city.id}
                              onClick={() => handleSelectCity(city.id)}
                              className={`group w-full p-4 rounded-2xl text-left border transition-all duration-300 relative overflow-hidden flex items-center justify-between cursor-pointer hover:scale-[1.02] active:scale-95 ${
                                isChosen
                                  ? "bg-[#e40011]/10 border-[#e40011] shadow-[0_4px_20px_rgba(228,0,17,0.2)]"
                                  : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/15"
                              }`}
                            >
                              <div className="flex items-center justify-between w-full">
                                <div className="flex flex-col justify-center min-w-0">
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <h3
                                      className={`text-sm font-extrabold tracking-tight uppercase truncate transition-colors ${isChosen ? "text-[#e40011]" : "text-white group-hover:text-white"}`}
                                    >
                                      {city.name}
                                    </h3>
                                    {isChosen && (
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#e40011] shrink-0 animate-pulse" />
                                    )}
                                  </div>
                                  <p className="text-[10px] text-white/40 font-sans mt-0.5 leading-none">
                                    {city.companies}{" "}
                                    {city.companies === 1
                                      ? "зал"
                                      : city.companies < 5
                                        ? "зала"
                                        : "залов"}
                                  </p>
                                </div>

                              </div>
                            </button>
                          );
                        })}
                    </div>
                  </motion.div>
                ) : (
                  // 1. CHOOSE CITIES STATE Grid View (Upgraded to bespoke dark luxury terminal with bento cities layout)
                  <motion.div
                    key="cities-matrix"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{
                      duration: 0.35,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="flex flex-col justify-start gap-6"
                  >
                    <div>
                      <h2 className="text-2.5xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white mb-2.5 uppercase leading-none font-display flex items-baseline gap-2.5 select-none">
                        <AnimatedGymCounter
                          target={16}
                          active={hasScrolledToMap}
                        />
                        <span className="text-white">ЗАЛОВ</span>
                      </h2>
                      <p className="text-white/75 text-[11.5px] leading-relaxed">
                        От первого клуба в 2010 году до крупнейшей сети фитнес-клубов страны сегодня. Тренируйтесь в любом из 16 клубов FitnessBlitz — от Актау до Алматы.
                      </p>
                    </div>

                    {/* Beautifully sized list of cities - Bento Grid layout representing regional hubs */}
                    <div className="relative flex flex-col">
                      <div className="pr-0.5 pb-2">
                        <div className="grid grid-cols-2 gap-3">
                          {citiesList.map((city) => {
                            const isSelected = selectedCityId === city.id;
                            const isChosen = chosenCityId === city.id;
                            return (
                              <button
                                key={city.id}
                                onClick={() => handleSelectCity(city.id)}
                                className={`group p-4 rounded-2xl text-left border transition-all duration-300 relative overflow-hidden flex items-center justify-between h-[66px] cursor-pointer hover:scale-[1.02] active:scale-95 ${
                                  isSelected || isChosen
                                    ? "bg-[#e40011]/10 border-[#e40011] shadow-[0_4px_20px_rgba(228,0,17,0.2)]"
                                    : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/15"
                                }`}
                              >
                                <div className="flex items-center justify-between w-full">
                                  <div className="flex flex-col justify-center min-w-0">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                      <h3
                                        className={`text-xs sm:text-[13px] font-extrabold tracking-tight uppercase truncate transition-colors ${isSelected || isChosen ? "text-[#e40011]" : "text-white group-hover:text-white"}`}
                                      >
                                        {city.name}
                                      </h3>
                                      {(isSelected || isChosen) && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#e40011] shrink-0 animate-pulse" />
                                      )}
                                    </div>
                                    <p className="text-[10px] text-white/40 font-sans mt-0.5 leading-none">
                                      {city.companies}{" "}
                                      {city.companies === 1
                                        ? "зал"
                                        : city.companies < 5
                                          ? "зала"
                                          : "залов"}
                                    </p>
                                  </div>

                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              ) : (
                // 2. DETAILED HUB ACTIVE STATE Info View
                (() => {
                  const region = regionsList.find(
                    (r) => r.id === selectedRegionId,
                  );
                  const selectedCity = citiesList.find(
                    (c) => c.id === selectedCityId,
                  );
                  if (!selectedCity) return null;

                  const branches = gymBranches.filter(
                    (b) => b.cityId === selectedCity.id,
                  );
                  const showSelection =
                    branches.length > 1 && !selectedGymId;

                  if (showSelection) {
                    return (
                      <motion.div
                        key={`branches-choice-${selectedCity.id}`}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col"
                      >
                        {/* Inner Back Row Header - Fixed at the top */}
                        <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/5 pt-1 select-none shrink-0">
                          <button
                            onClick={() => handleSelectCity(null)}
                            className="flex items-center gap-2 text-white/60 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 hover:border-white/10 px-3.5 py-1.5 rounded-full transition-all duration-300 text-[9.5px] uppercase font-sans tracking-widest cursor-pointer font-black"
                          >
                            <ChevronLeft className="w-3.5 h-3.5 text-[#e40011]" />{" "}
                            <span>Все города</span>
                          </button>

                          <div className="text-white/80 text-[10px] sm:text-[11px] font-sans tracking-wide uppercase flex items-center gap-2 max-w-[65%] sm:max-w-none text-right justify-end font-extrabold text-neutral-200">
                            <span className="truncate flex items-center gap-1.5">
                              <span>{selectedCity.name}</span>
                              <span className="text-[#e40011] font-sans text-xs font-black select-none">
                                ({branches.length} ф)
                              </span>
                            </span>
                          </div>
                        </div>

                        {/* Branches custom buttons container with visual layout */}
                        <div className="space-y-4">
                          <div className="text-white text-xs sm:text-sm font-sans font-black tracking-wide uppercase text-neutral-400 mb-1">
                            Выберите филиал фитнес-клуба:
                          </div>
                          <div className="grid grid-cols-1 gap-3.5 py-1 px-1 select-none max-h-[50vh] overflow-y-auto pr-1">
                            {branches.map((branch) => (
                              <button
                                key={branch.id}
                                onClick={() =>
                                  setSelectedGymId(branch.id)
                                }
                                className="group w-full p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#e40011]/50 hover:bg-white/[0.05] transition-all duration-300 cursor-pointer flex items-center gap-4 text-left hover:scale-[1.01] active:scale-[0.99] overflow-hidden"
                              >
                                {/* Gym background photo inside button */}
                                <div className="w-[110px] h-[74px] rounded-xl overflow-hidden shrink-0 bg-neutral-900 border border-white/10 relative">
                                  <img
                                    src={branch.image}
                                    alt={branch.name}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                  />
                                  <div className="absolute inset-0 bg-black/15" />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <h3 className="text-white text-xs sm:text-[13px] font-sans font-black tracking-wide uppercase leading-tight group-hover:text-[#e40011] transition-colors mb-1">
                                    {branch.name}
                                  </h3>
                                  <p className="text-white/80 font-sans text-[10.5px] leading-snug truncate">
                                    {branch.address}
                                  </p>
                                  <div className="text-white/40 font-sans text-[9px] mt-2 tracking-wider uppercase font-extrabold truncate flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#e40011]" />
                                    {branch.microdistrict}
                                  </div>
                                </div>

                                <div className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center shrink-0 group-hover:bg-[#e40011] group-hover:border-[#e40011] transition-all duration-300">
                                  <ChevronRight className="w-4 h-4 text-white" />
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    );
                  }

                  const activeBranch =
                    branches.find((b) => b.id === selectedGymId) ||
                    branches[0];
                  if (!activeBranch) return null;

                  const kokshetauReviews = [
                    {
                      reviewer: "Данияр Б.",
                      date: "Март 2026",
                      rating: 5,
                      text: "Прекрасный спортзал в центре города! Просторные зоны свободных весов, чистые душевые и вежливый персонал на входе. Тренеры настоящие профи, рекомендую.",
                      link: "https://2gis.kz/reviews/70000001053104194/review/214620698",
                    },
                    {
                      reviewer: "Анастасия Коваль",
                      date: "Январь 2026",
                      rating: 5,
                      text: "Занимаюсь тут по абонементу уже полгода. Очень радует наличие современных тренажеров и идеальная чистота в залах. Атмосфера мотивирует достигать результатов ежедневно.",
                      link: "https://2gis.kz/reviews/70000001053104194/review/225448471",
                    },
                    {
                      reviewer: "Максат Нургалиев",
                      date: "Ноябрь 2025",
                      rating: 5,
                      text: "Лучшее соотношение цены и качества в Кокшетау. Крутые групповые занятия и функциональные тренировки. Мой любимый фитнес-клуб!",
                      link: "https://2gis.kz/reviews/70000001053104194/review/200345709",
                    },
                  ];

                  const defaultReviews = [
                    {
                      reviewer: "Тимур А.",
                      date: "Февраль 2026",
                      rating: 5,
                      text: "Отличный сетевой фитнес-клуб! Качественные новые тренажеры, просторные раздевалки и классная вентиляция. Доступные абонементы.",
                      link: "https://2gis.kz/",
                    },
                    {
                      reviewer: "Сабина С.",
                      date: "Январь 2026",
                      rating: 5,
                      text: "Прекрасный сервис, очень доброжелательный персонал и всегда чисто. Регулярно хожу на йогу и в тренажерный зал — всё супер!",
                      link: "https://2gis.kz/",
                    },
                  ];

                  const genericImages = [
                    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
                    "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80",
                    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
                  ];

                  const currentImages =
                    activeBranch.images && activeBranch.images.length > 0
                      ? activeBranch.images
                      : genericImages;
                  const currentReviews =
                    selectedCity.id === "KOKSHETAU"
                      ? kokshetauReviews
                      : defaultReviews;

                  const imgIndexToUse =
                    activeImgIndex % currentImages.length;
                  const reviewIndexToUse =
                    activeReviewIndex % currentReviews.length;

                  return (
                    <motion.div
                      key={`zoomed-${selectedCity.id}-${activeBranch.id}`}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col"
                    >
                      {/* Inner Back Row Header - Fixed at the top */}
                      <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/5 pt-1 select-none shrink-0">
                        {branches.length > 1 ? (
                          <button
                            onClick={() => setSelectedGymId(null)}
                            className="flex items-center gap-2 text-white/60 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 hover:border-white/10 px-3.5 py-1.5 rounded-full transition-all duration-300 text-[9.5px] uppercase font-sans tracking-widest cursor-pointer font-black"
                          >
                            <ChevronLeft className="w-3.5 h-3.5 text-[#e40011]" />{" "}
                            <span>К залам ({selectedCity.name})</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSelectCity(null)}
                            className="flex items-center gap-2 text-white/60 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 hover:border-white/10 px-3.5 py-1.5 rounded-full transition-all duration-300 text-[9.5px] uppercase font-sans tracking-widest cursor-pointer font-black"
                          >
                            <ChevronLeft className="w-3.5 h-3.5 text-[#e40011]" />{" "}
                            <span>Все города</span>
                          </button>
                        )}

                        <div className="text-white/80 text-[10px] sm:text-[11px] font-sans tracking-wide uppercase flex items-center gap-2 max-w-[65%] sm:max-w-none text-right justify-end">
                          {/* 2GIS Prize SVG Icon */}
                          <div className="relative group/tooltip flex items-center shrink-0">
                            <img
                              src="https://disk.2gis.com/rubricator/thenomineesd5fc3fe077e03b4c544c55602eee949e.svg"
                              alt="Премия 2ГИС"
                              referrerPolicy="no-referrer"
                              className="w-[17px] h-[17px] cursor-help hover:scale-110 active:scale-95 transition-all drop-shadow-[0_0_6px_rgba(101,188,60,0.55)]"
                            />
                            {/* Elegant hovering tooltip positioned below */}
                            <div className="absolute right-0 top-full mt-2 w-48 bg-[#0a0a0c]/95 border border-white/10 text-[10px] text-neutral-200 p-2.5 rounded-xl shadow-2xl opacity-0 translate-y-[-4px] group-hover/tooltip:translate-y-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all duration-300 z-50 text-center normal-case tracking-normal font-sans backdrop-blur-md">
                              <div className="text-[#cdd8e6] font-black text-[11px] tracking-wide mb-0.5">
                                ПРЕМИЯ 2ГИС
                              </div>
                              Номинант Премии 2ГИС 2026
                            </div>
                          </div>

                          <span className="truncate flex items-center gap-1">
                            <span className="font-extrabold text-white">
                              {selectedCity.name}
                            </span>
                            <span className="text-white/40 normal-case font-normal font-sans select-all truncate text-[10px] sm:text-[11px]">
                              , {activeBranch.address}
                            </span>
                          </span>
                        </div>
                      </div>

                      <div className="pr-0.5 py-1">
                        {/* Detailed Information Grid */}
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-7 xl:items-start items-start">
                          {/* Left Column (xl:col-span-6) - Image, Hours, Location */}
                          <div className="xl:col-span-6 flex flex-col gap-5">
                            {/* Image Slider */}
                            <div
                              className="relative w-full aspect-[4/3] sm:aspect-[16/10] xl:aspect-[16/10.5] rounded-2xl overflow-hidden bg-neutral-950 group border border-white/5"
                              id="gym-photo-slider"
                            >
                              <AnimatePresence
                                initial={false}
                                custom={slideDirection}
                              >
                                <motion.img
                                  key={imgIndexToUse}
                                  src={currentImages[imgIndexToUse]}
                                  alt={`${activeBranch.name} gym`}
                                  custom={slideDirection}
                                  variants={slideVariants}
                                  initial="enter"
                                  animate="center"
                                  exit="exit"
                                  transition={{
                                    x: {
                                      type: "spring",
                                      stiffness: 300,
                                      damping: 30,
                                    },
                                    opacity: { duration: 0.25 },
                                  }}
                                  className="absolute inset-0 w-full h-full object-cover select-none cursor-zoom-in group-hover:scale-[1.02] transition-transform duration-[600ms]"
                                  referrerPolicy="no-referrer"
                                  onClick={() => setIsImgZoomed(true)}
                                />
                              </AnimatePresence>

                              {/* Top and Bottom Fade Overlays */}
                              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />
                              <div className="absolute inset-x-0 top-0 h-[60px] bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

                              <div className="absolute inset-y-0 inset-x-2 flex justify-between items-center z-10 pointer-events-none">
                                <button
                                  onClick={() => {
                                    setSlideDirection(-1);
                                    setActiveImgIndex(
                                      (prev) =>
                                        (prev -
                                          1 +
                                          currentImages.length) %
                                        currentImages.length,
                                    );
                                    setSliderProgress(0);
                                  }}
                                  className="bg-black/60 hover:bg-[#e40011] hover:border-transparent text-white rounded-full transition-all cursor-pointer flex items-center justify-center w-10 h-10 pointer-events-auto border border-white/10 hover:scale-105 active:scale-95"
                                >
                                  <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setSlideDirection(1);
                                    setActiveImgIndex(
                                      (prev) =>
                                        (prev + 1) % currentImages.length,
                                    );
                                    setSliderProgress(0);
                                  }}
                                  className="bg-black/60 hover:bg-[#e40011] hover:border-transparent text-white rounded-full transition-all cursor-pointer flex items-center justify-center w-10 h-10 pointer-events-auto border border-white/10 hover:scale-105 active:scale-95"
                                >
                                  <ChevronRight className="w-5 h-5" />
                                </button>
                              </div>
                            </div>

                            {/* Unique custom premium Story-style progress indicators */}
                            <div className="flex gap-1.5 items-center justify-between w-full px-1">
                              {currentImages.map((_, idx) => {
                                const isActive = imgIndexToUse === idx;
                                const isCompleted = idx < imgIndexToUse;
                                return (
                                  <button
                                    key={idx}
                                    onClick={() => {
                                      setSlideDirection(
                                        idx > imgIndexToUse ? 1 : -1,
                                      );
                                      setActiveImgIndex(idx);
                                      setSliderProgress(0);
                                    }}
                                    className="flex-1 h-1.5 rounded-full bg-white/20 hover:bg-white/30 overflow-hidden relative cursor-pointer outline-none select-none transition-all duration-300"
                                    title={`Фото ${idx + 1}`}
                                  >
                                    <div
                                      className="absolute inset-y-0 left-0 bg-[#e40011] rounded-full transition-all ease-linear"
                                      style={{
                                        width: isActive
                                          ? `${sliderProgress}%`
                                          : isCompleted
                                            ? "100%"
                                            : "0%",
                                        transitionDuration: isActive
                                          ? "20ms"
                                          : "0ms",
                                      }}
                                    />
                                  </button>
                                );
                              })}
                            </div>

                            {/* Location Address and Contacts Section */}
                            <div className="bg-white/[0.015] border border-white/5 rounded-xl p-3.5 space-y-3 text-left">
                              <div className="min-h-[36px]">
                                <h4 className="text-white text-xs font-bold font-sans leading-snug">
                                  <a
                                    href={
                                      activeBranch.mapLink ||
                                      "https://2gis.kz/search/fitnessblitz"
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-[#e40011] transition-colors duration-200 inline-flex items-center gap-1.5 group/address"
                                  >
                                    <span>
                                      {activeBranch.address}{" "}
                                      {activeBranch.microdistrict
                                        ? `(${activeBranch.microdistrict})`
                                        : ""}
                                    </span>
                                    <ExternalLink className="w-3.5 h-3.5 text-white/40 group-hover/address:text-[#e40011] transition-colors shrink-0" />
                                  </a>
                                </h4>
                              </div>

                              <div className="border-t border-white/5 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div>
                                  <span className="block text-[8px] uppercase tracking-widest text-white/40 font-bold font-sans">
                                    Телефон
                                  </span>
                                  <a
                                    href={`tel:${getBranchContact(activeBranch).phone.replace(/[^+\d]/g, "")}`}
                                    className="text-white hover:text-[#e40011] text-[11px] font-bold font-sans transition-colors duration-200 mt-0.5 block"
                                  >
                                    {getBranchContact(activeBranch).phone}
                                  </a>
                                </div>
                                <div className="min-w-0">
                                  <span className="block text-[8px] uppercase tracking-widest text-white/40 font-bold font-sans">
                                    Почта
                                  </span>
                                  <a
                                    href={`mailto:${getBranchContact(activeBranch).email}`}
                                    className="text-white hover:text-[#e40011] text-[11px] font-bold font-sans transition-colors duration-200 mt-0.5 block truncate"
                                  >
                                    {getBranchContact(activeBranch).email}
                                  </a>
                                </div>
                              </div>
                            </div>

                            {/* Location Schedule Section */}
                            <div className="bg-white/[0.015] border border-white/5 rounded-xl p-3.5 text-left">
                              <div className="grid grid-cols-2 gap-3 items-center">
                                <div>
                                  <span className="text-[8px] uppercase tracking-widest text-white/40 font-bold font-sans block">
                                    будние дни
                                  </span>
                                  <div className="text-white text-xs font-bold mt-0.5 font-sans">
                                    06:30 — 23:30
                                  </div>
                                </div>
                                <div>
                                  <span className="text-[8px] uppercase tracking-widest text-white/40 font-bold font-sans block">
                                    выходные дни
                                  </span>
                                  <div className="text-white text-xs font-bold mt-0.5 font-sans">
                                    10:00 — 22:00
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right Column (xl:col-span-6) - Subscriptions Tiers and Reviews */}
                          <div className="xl:col-span-6 flex flex-col gap-5 text-left">
                            {/* Subscription pricing tier options */}
                            <div className="bg-white/[0.015] border border-white/5 rounded-2xl p-3.5 sm:p-5 space-y-4">
                              {/* Top Switcher for Subscriptions and One-Off/PT Services to avoid text layout bloat */}
                              <div className="flex bg-neutral-900/50 p-1.5 rounded-full border border-white/5 relative items-center gap-1">
                                <button
                                  onClick={() =>
                                    setPriceType("subscriptions")
                                  }
                                  className={`flex-1 text-center py-2.5 rounded-full text-[8.5px] sm:text-[9.5px] uppercase tracking-wider font-extrabold font-sans transition-all duration-300 cursor-pointer ${
                                    priceType === "subscriptions"
                                      ? "bg-[#e40011] text-white shadow-[0_4px_16px_rgba(228,0,17,0.35)] scale-[1.01]"
                                      : "text-white/50 hover:text-white hover:bg-white/5"
                                  }`}
                                >
                                  Абонементы
                                </button>
                                <button
                                  onClick={() => setPriceType("one-time")}
                                  className={`flex-1 text-center py-2.5 rounded-full text-[8.5px] sm:text-[9.5px] uppercase tracking-wider font-extrabold font-sans transition-all duration-300 cursor-pointer ${
                                    priceType === "one-time"
                                      ? "bg-[#e40011] text-white shadow-[0_4px_16px_rgba(228,0,17,0.35)] scale-[1.01]"
                                      : "text-white/50 hover:text-white hover:bg-white/5"
                                  }`}
                                >
                                  Разовые & Тренеры
                                </button>
                              </div>

                              {priceType === "subscriptions" ? (
                                <>
                                  <div className="flex pb-1">
                                    {/* Pill Select Tabs */}
                                    <div className="flex w-full bg-neutral-900/50 p-1.5 rounded-full border border-white/5">
                                      {[
                                        { id: "1m", label: "1 Месяц" },
                                        { id: "3m", label: "3 Месяца" },
                                        { id: "6m", label: "6 Месяцев" },
                                        {
                                          id: "12m",
                                          label: "12 Месяцев",
                                        },
                                      ].map((tab) => (
                                        <button
                                          key={tab.id}
                                          onClick={() =>
                                            setActivePriceTab(tab.id)
                                          }
                                          className={`flex-1 text-center py-2 px-1 rounded-full text-[7.5px] sm:text-[8.5px] uppercase tracking-widest font-extrabold transition-all duration-300 cursor-pointer whitespace-nowrap ${
                                            activePriceTab === tab.id
                                              ? "bg-[#e40011]/85 text-white shadow-[0_3px_12px_rgba(228,0,17,0.2)]"
                                              : "text-white/50 hover:text-white hover:bg-white/5"
                                          }`}
                                        >
                                          {tab.label}
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Tariff tiers stacked list (highly polished horizontal rows for maximum space and zero squishing) */}
                                  <div className="space-y-2.5">
                                    {[
                                      {
                                        title: "UNLIMITED",
                                        subtitle: "Полная свобода",
                                        desc: "Безлимитно • 24/7 доступ в рабочие часы залов",
                                        price:
                                          activePriceTab === "1m"
                                            ? "24 900"
                                            : activePriceTab === "3m"
                                              ? "63 500"
                                              : activePriceTab === "6m"
                                                ? "112 000"
                                                : "194 000",
                                        popular: true,
                                        badge: "Популярный",
                                      },
                                      {
                                        title: "FITDAYS",
                                        subtitle: "Дневной тренинг",
                                        desc: "Будни • Посещение строго до 18:00 часов",
                                        price:
                                          activePriceTab === "1m"
                                            ? "19 900"
                                            : activePriceTab === "3m"
                                              ? "50 500"
                                              : activePriceTab === "6m"
                                                ? "89 000"
                                                : "155 000",
                                        popular: false,
                                        badge: "Дневной",
                                      },
                                      {
                                        title: "STUDENTCARD",
                                        subtitle: "Студенческая карта",
                                        desc: "Вт, Чт, Сб, Вс • Посещение с 07:00 до 24:00",
                                        price:
                                          activePriceTab === "1m"
                                            ? "17 900"
                                            : activePriceTab === "3m"
                                              ? "45 500"
                                              : activePriceTab === "6m"
                                                ? "80 000"
                                                : "139 000",
                                        popular: false,
                                        badge: "Студенческий",
                                      },
                                    ].map((plan, pIdx) => (
                                      <div
                                        key={pIdx}
                                        className={`rounded-2xl border px-3 sm:px-4 py-3 flex items-center justify-between transition-all duration-300 relative overflow-hidden ${
                                          plan.popular
                                            ? "bg-[#e40011]/[0.015] border-[#e40011]/30 hover:border-[#e40011]/55 shadow-[0_4px_20px_rgba(228,0,17,0.05)]"
                                            : "bg-white/[0.01] border-white/5 hover:border-white/10"
                                        }`}
                                      >
                                        <div className="flex-1 min-w-0 flex flex-col gap-1 pr-2 sm:pr-4">
                                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                            <span className="text-[11px] xs:text-[11.5px] sm:text-[12.5px] font-black tracking-wider text-white font-sans">
                                              {plan.title}
                                            </span>
                                            {plan.badge && (
                                              <span
                                                className={`text-[7px] sm:text-[7.5px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider font-mono shrink-0 ${
                                                  plan.popular
                                                    ? "bg-[#e40011]/15 text-[#ff0a21] border border-[#e40011]/20"
                                                    : "bg-white/[0.04] text-white/60 border border-white/5"
                                                }`}
                                              >
                                                {plan.badge}
                                              </span>
                                            )}
                                          </div>
                                          <p className="text-[9.5px] sm:text-[10px] text-white/50 leading-relaxed font-sans">
                                            {plan.desc}
                                          </p>
                                        </div>

                                        <div className="flex flex-col items-end justify-center shrink-0 border-l border-white/5 pl-2.5 sm:pl-4 min-w-[80px] sm:min-w-[95px]">
                                          <span className="text-[8px] font-semibold text-white/35 uppercase tracking-widest leading-none mb-1">
                                            Стоимость
                                          </span>
                                          <span className="text-xs sm:text-sm font-black text-white tracking-wider font-sans leading-none">
                                            {plan.price} ₸
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Simple cohesive Freeze Indicator below the cards */}
                                  <div className="flex items-center justify-between pt-1.5 px-1 text-[10px] text-white/40 font-sans">
                                    <span className="uppercase tracking-wider">
                                      Заморозка карты:
                                    </span>
                                    <span className="font-bold text-white/80 uppercase tracking-widest">
                                      {activePriceTab === "1m"
                                        ? "15 дней"
                                        : activePriceTab === "3m"
                                          ? "30 дней"
                                          : activePriceTab === "6m"
                                            ? "45 дней"
                                            : activePriceTab === "12m"
                                              ? "60 дней"
                                              : "15 дней"}
                                    </span>
                                  </div>
                                </>
                              ) : (
                                <div className="space-y-2.5">
                                  {[
                                    {
                                      title: "РАЗОВЫЙ ВИЗИТ",
                                      desc: "Разовое посещение любого зала сети для самостоятельных тренировок",
                                      price: "5 000",
                                    },
                                    {
                                      title: "С ТРЕНЕРОМ",
                                      desc: "1 персональное занятие с тренером в FitnessBlitz",
                                      price: "3 500",
                                    },
                                    {
                                      title: "10 ЗАНЯТИЙ С ТРЕНЕРОМ",
                                      desc: "Параметры занятий под руководством персонального тренера",
                                      price: "от 20 000",
                                    },
                                  ].map((service, sIdx) => (
                                    <div
                                      key={sIdx}
                                      className="rounded-2xl border border-white/5 bg-white/[0.01] hover:border-white/10 px-3 sm:px-4 py-3 flex items-center justify-between transition-all duration-300 relative overflow-hidden group/service"
                                    >
                                      <div className="flex-1 min-w-0 flex flex-col gap-1 pr-2 sm:pr-4">
                                        <span className="text-[11px] xs:text-[11.5px] sm:text-[12.5px] font-black tracking-wider text-white font-sans group-hover/service:text-[#e40011] transition-colors">
                                          {service.title}
                                        </span>
                                        <p className="text-[9.5px] sm:text-[10px] text-white/50 leading-relaxed font-sans">
                                          {service.desc}
                                        </p>
                                      </div>
                                      <div className="flex flex-col items-end justify-center shrink-0 border-l border-white/5 pl-2.5 sm:pl-4 min-w-[80px] sm:min-w-[95px]">
                                        <span className="text-[8px] font-semibold text-white/35 uppercase tracking-widest leading-none mb-1">
                                          Стоимость
                                        </span>
                                        <span className="text-xs sm:text-sm font-black text-white tracking-wider font-sans leading-none">
                                          {service.price} ₸
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions bar at bottom */}
                      <div className="mt-5 pt-4 border-t border-white/5 flex items-center gap-2 shrink-0 z-10 w-full">
                        <button
                          onClick={() => {
                            setIsBuyModalOpen(true);
                            setBuyModalCityId(selectedCity.id);
                          }}
                          className="flex-[1.2] h-11 sm:h-12 flex items-center justify-center bg-[#e40011] hover:bg-[#ff1a2b] text-white text-[9.5px] sm:text-[10px] md:text-[10.5px] font-black uppercase tracking-wider rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-[0_6px_20px_rgba(228,0,17,0.35)] hover:shadow-[0_10px_30px_rgba(228,0,17,0.5)] font-sans whitespace-nowrap"
                        >
                          <span>КУПИТЬ АБОНЕМЕНТ</span>
                        </button>

                        <button
                          onClick={() => {
                            setChosenCityId(selectedCity.id);
                            setCookie("selected_city", selectedCity.id);
                            setChosenGymId(activeBranch.id);
                            setCookie("selected_gym", activeBranch.id);
                            scrollToSectionStr("coaches-section", 3);
                          }}
                          className="flex-[0.8] h-11 sm:h-12 flex items-center justify-center bg-white/[0.04] border border-white/10 hover:border-white/20 hover:bg-white/[0.08] text-white text-[9.5px] sm:text-[10px] md:text-[10.5px] font-black uppercase tracking-wider rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap"
                        >
                          <span>ТРЕНЕРЫ</span>
                        </button>

                        <a
                          href={
                            activeBranch.mapLink ||
                            "https://2gis.kz/search/fitnessblitz"
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center bg-white/[0.04] border border-white/10 hover:border-white/20 hover:bg-white/[0.08] text-white rounded-full transition-all duration-300 hover:scale-[1.05] active:scale-[0.95] cursor-pointer shrink-0"
                          title="Посмотреть в 2ГИС"
                        >
                          <MapPin className="w-4 h-4 text-[#e40011]" />
                        </a>
                      </div>
                    </motion.div>
                  );
                })()
              )}
            </AnimatePresence>
          </motion.div>

          {/* Background Kazakhstan Map Visualizer Column */}
          <motion.div
            className={`relative h-[42%] lg:h-[90%] flex items-center justify-center bg-transparent overflow-visible transition-[width,min-width,max-width,height,flex] duration-[850ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${selectedCityId ? "w-full lg:w-[48%] xl:w-[54%]" : "w-full lg:w-[60%] xl:w-[64%]"}`}
            onClick={() => {
              if (selectedCityId || selectedRegionId || selectedGymId) {
                handleSelectCity(null);
              }
            }}
            initial={{
              opacity: 0,
              scale: 0.94,
              filter: "blur(12px)",
              y: 30,
            }}
            animate={
              hasScrolledToMap
                ? { opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }
                : { opacity: 0, scale: 0.94, filter: "blur(12px)", y: 30 }
            }
            transition={{
              duration: 0.9,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.15,
            }}
          >
            {/* Background Map Component wrapped inside a dynamic transition */}
            <div
              className={`w-full h-full flex items-center justify-center transition-all duration-[850ms] ease-[cubic-bezier(0.16,1,0.3,1)] overflow-visible ${selectedCityId ? "scale-[1.02]" : "scale-100"}`}
            >
              <KazakhstanMap
                key="kazakhstan-map"
                hasScrolledToMap={hasScrolledToMap}
                activeRegionId={
                  selectedRegionId ||
                  (hoveredRegion ? hoveredRegion.id : null)
                }
                selectedRegionId={selectedRegionId}
                selectedCityId={selectedCityId}
                chosenCityId={chosenCityId}
                onHoverRegion={(region) => {
                  if (!selectedCityId) {
                    setHoveredRegion(region);
                  }
                }}
                onClickRegion={(regionId) => {
                  if (regionId) {
                    // If clicking the currently selected region or the region of the currently selected city, deselect/go back!
                    if (
                      selectedRegionId === regionId ||
                      (selectedCityId &&
                        citiesList.find((c) => c.id === selectedCityId)
                          ?.regionId === regionId)
                    ) {
                      handleSelectCity(null);
                      return;
                    }

                    const citiesInRegion = citiesList.filter(
                      (c) => c.regionId === regionId,
                    );
                    if (citiesInRegion.length === 1) {
                      handleSelectCity(citiesInRegion[0].id);
                    } else if (citiesInRegion.length > 1) {
                      setSelectedRegionId(regionId);
                      setSelectedCityId(null);
                      setSelectedGymId(null);
                      const region = regionsList.find(
                        (r) => r.id === regionId,
                      );
                      if (region) {
                        setHoveredRegion(region);
                      }
                    }
                  } else {
                    handleSelectCity(null);
                  }
                }}
                onSelectCity={(cityId) => {
                  // If clicking the currently selected city, deselect/go back!
                  if (selectedCityId === cityId) {
                    handleSelectCity(null);
                  } else {
                    handleSelectCity(cityId);
                  }
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

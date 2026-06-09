import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { kazakhstanSvgRegions } from "./kazakhstan-paths";

export interface RegionData {
  id: string;
  name: string;
  capital: string;
  companies: number;
  share: string;
  path: string;
  cx: number;
  cy: number;
}

export interface CityData {
  id: string;
  name: string;
  regionId: string;
  cx: number;
  cy: number;
  companies: number;
  share: string;
  status: string;
  riskLevel: string;
  industry: string;
  companiesList: string[];
  auditsCount: number;
}

// 10 designated cities list mapping to their host regions
export const citiesList: CityData[] = [
  {
    id: "ALMATY",
    name: "Алматы",
    regionId: "KZ-ALM",
    cx: 615,
    cy: 365,
    companies: 3,
    share: "19%",
    status: "полностью укомплектован",
    riskLevel: "высший рейтинг",
    industry: "силовой тренинг, кардио, кроссфит",
    companiesList: ["FitnessBlitz Абая", "FitnessBlitz Сейфуллина", "FitnessBlitz Алатау"],
    auditsCount: 3
  },
  {
    id: "ASTANA",
    name: "Астана",
    regionId: "KZ-AKM",
    cx: 485,
    cy: 132,
    companies: 1,
    share: "10%",
    status: "сертифицирован",
    riskLevel: "высший рейтинг",
    industry: "тренажерный зал, групповые занятия",
    companiesList: ["FitnessBlitz Есиль"],
    auditsCount: 1
  },
  {
    id: "KOKSHETAU",
    name: "Кокшетау",
    regionId: "KZ-AKM",
    cx: 445,
    cy: 95,
    companies: 1,
    share: "6%",
    status: "проверенный филиал",
    riskLevel: "стабильная работа",
    industry: "силовые и кардио-тренировки",
    companiesList: ["FitnessBlitz Акмола"],
    auditsCount: 1
  },
  {
    id: "SHYMKENT",
    name: "Шымкент",
    regionId: "KZ-YUZ",
    cx: 445,
    cy: 395,
    companies: 1,
    share: "8%",
    status: "активное развитие",
    riskLevel: "стабильный рейтинг",
    industry: "функциональный и круговой тренинг",
    companiesList: ["FitnessBlitz Ордабасы"],
    auditsCount: 1
  },
  {
    id: "KENTAU",
    name: "Кентау",
    regionId: "KZ-YUZ",
    cx: 425,
    cy: 355,
    companies: 1,
    share: "6%",
    status: "под наблюдением инструкторов",
    riskLevel: "стабильный рейтинг",
    industry: "силовые программы, силовая рама",
    companiesList: ["FitnessBlitz Каратау"],
    auditsCount: 1
  },
  {
    id: "TARAZ",
    name: "Тараз",
    regionId: "KZ-ZHA",
    cx: 485,
    cy: 362,
    companies: 2,
    share: "12%",
    status: "проверенный филиал",
    riskLevel: "стабильный рейтинг",
    industry: "йога, пилатес, оздоровительный фитнес",
    companiesList: ["FitnessBlitz Талап", "FitnessBlitz Жамбыл"],
    auditsCount: 2
  },
  {
    id: "KOSTANAY",
    name: "Костанай",
    regionId: "KZ-KUS",
    cx: 330,
    cy: 95,
    companies: 1,
    share: "6%",
    status: "активная поддержка",
    riskLevel: "безопасный тренинг",
    industry: "атлетическая подготовка, кардио-зона",
    companiesList: ["FitnessBlitz Тобол"],
    auditsCount: 1
  },
  {
    id: "KARAGANDA",
    name: "Караганда",
    regionId: "KZ-KAR",
    cx: 530,
    cy: 192,
    companies: 3,
    share: "19%",
    status: "полностью укомплектован",
    riskLevel: "стабильный рейтинг",
    industry: "бокс, кроссфит, пауэрлифтинг",
    companiesList: ["FitnessBlitz Сарыарка", "FitnessBlitz Темиртау", "FitnessBlitz Центральный"],
    auditsCount: 3
  },
  {
    id: "SARAN",
    name: "Сарань",
    regionId: "KZ-KAR",
    cx: 495,
    cy: 195,
    companies: 1,
    share: "6%",
    status: "проверенный филиал",
    riskLevel: "стабильный рейтинг",
    industry: "тренажерный зал, силовые тренировки",
    companiesList: ["FitnessBlitz Сарань"],
    auditsCount: 1
  },
  {
    id: "AKTAU",
    name: "Актау",
    regionId: "KZ-MAN",
    cx: 110,
    cy: 375,
    companies: 1,
    share: "6%",
    status: "полностью укомплектован",
    riskLevel: "высший рейтинг",
    industry: "функциональные тренировки, сайкл, йога",
    companiesList: ["FitnessBlitz Каспий"],
    auditsCount: 1
  },
  {
    id: "AKTOBE",
    name: "Актюбе",
    regionId: "KZ-AKT",
    cx: 242,
    cy: 223,
    companies: 1,
    share: "8%",
    status: "активное расширение",
    riskLevel: "стабильный рейтинг",
    industry: "силовые тренировки, стретчинг, кардио",
    companiesList: ["FitnessBlitz Актюбинск"],
    auditsCount: 1
  }
];

// Active regions are those that host any of our 10 designated cities
export const activeRegionIds = ["KZ-ALM", "KZ-AKM", "KZ-YUZ", "KZ-ZHA", "KZ-KUS", "KZ-KAR", "KZ-MAN", "KZ-AKT"];

// Structured region list from SVG definition
export const regionsList: RegionData[] = kazakhstanSvgRegions.map((svgRegion) => {
  const infoMap: Record<string, { name: string; capital: string; companies: number; share: string; cx: number; cy: number }> = {
    "KZ-AKM": { name: "Акмолинская область", capital: "Астана / Кокшетау", companies: 185, share: "24%", cx: 453, cy: 117 },
    "KZ-AKT": { name: "Актюбинская область", capital: "Актобе", companies: 0, share: "0%", cx: 242, cy: 223 },
    "KZ-ALM": { name: "Алматинская область", capital: "Конаев / Алматы", companies: 247, share: "29%", cx: 616, cy: 322 },
    "KZ-ATY": { name: "Атырауская область", capital: "Атырау", companies: 0, share: "0%", cx: 102, cy: 248 },
    "KZ-KAR": { name: "Карагандинская область", capital: "Караганда", companies: 142, share: "21%", cx: 459, cy: 213 },
    "KZ-KUS": { name: "Костанайская область", capital: "Костанай", companies: 74, share: "12%", cx: 343, cy: 127 },
    "KZ-KZY": { name: "Кызылординская область", capital: "Кызылорда", companies: 0, share: "0%", cx: 332, cy: 313 },
    "KZ-MAN": { name: "Мангистауская область", capital: "Актау", companies: 51, share: "9%", cx: 133, cy: 346 },
    "KZ-PAV": { name: "Павлодарская область", capital: "Павлодар", companies: 0, share: "0%", cx: 580, cy: 104 },
    "KZ-SEV": { name: "Северо-Казахстанская область", capital: "Петропавловск", companies: 0, share: "0%", cx: 457, cy: 54 },
    "KZ-VOS": { name: "Восточно-Казахстанская область", capital: "Усть-Каменогорск", companies: 0, share: "0%", cx: 688, cy: 213 },
    "KZ-YUZ": { name: "Туркестанская область", capital: "Туркестан", companies: 110, share: "16%", cx: 427, cy: 363 },
    "KZ-ZAP": { name: "Западно-Казахстанская область", capital: "Уральск", companies: 0, share: "0%", cx: 79, cy: 178 },
    "KZ-ZHA": { name: "Жамбылская область", capital: "Тараз", companies: 63, share: "11%", cx: 505, cy: 340 },
    "KZ-AS": { name: "Аральское море", capital: "нет (водный бассейн)", companies: 0, share: "0%", cx: 261, cy: 298 }
  };

  const info = infoMap[svgRegion.id] || {
    name: svgRegion.title,
    capital: "разрабатывается",
    companies: 0,
    share: "0%",
    cx: 400,
    cy: 200
  };

  return {
    id: svgRegion.id,
    path: svgRegion.d,
    ...info
  };
});

interface KazakhstanMapProps {
  key?: string | number;
  hasScrolledToMap?: boolean;
  activeRegionId: string | null;
  selectedRegionId: string | null;
  selectedCityId: string | null;
  chosenCityId: string | null;
  onHoverRegion: (region: RegionData | null) => void;
  onClickRegion: (regionId: string | null) => void;
  onSelectCity: (cityId: string | null) => void;
}

export default function KazakhstanMap({ 
  hasScrolledToMap = false,
  activeRegionId,
  selectedRegionId,
  selectedCityId,
  chosenCityId,
  onHoverRegion, 
  onClickRegion,
  onSelectCity
}: KazakhstanMapProps) {
  
  const [hasAnimatedFirstTime, setHasAnimatedFirstTime] = useState(false);
  const [animatedCityIds, setAnimatedCityIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (hasScrolledToMap) {
      const timer = setTimeout(() => {
        setHasAnimatedFirstTime(true);
      }, 500); // match fast drawing speed
      return () => clearTimeout(timer);
    }
  }, [hasScrolledToMap]);

  useEffect(() => {
    if (hasScrolledToMap) {
      const visibleCities = citiesList.filter((city) => {
        const isHostRegionZoomed = selectedRegionId === city.regionId;
        const isAnyRegionZoomed = selectedRegionId !== null;
        return !(isAnyRegionZoomed && !isHostRegionZoomed);
      });
      if (visibleCities.length > 0) {
        setAnimatedCityIds((prev) => {
          let updated = false;
          const next = { ...prev };
          visibleCities.forEach((city) => {
            if (!next[city.id]) {
              next[city.id] = true;
              updated = true;
            }
          });
          return updated ? next : prev;
        });
      }
    }
  }, [hasScrolledToMap, selectedRegionId]);

  const selectedRegion = regionsList.find((r) => r.id === selectedRegionId);
  const zoomScale = 2.6;
  
  const tx = selectedRegion ? (792.54694 * 0.60 - selectedRegion.cx * zoomScale) : 0;
  const ty = selectedRegion ? (792.54694 * 0.20 - selectedRegion.cy * zoomScale) : 0; // adjusted for 15% higher layout

  const transformStr = selectedRegion
    ? `translate(${tx}px, ${ty}px) scale(${zoomScale})`
    : `translate(0px, 0px) scale(1)`;

  return (
    <div className="relative w-full h-full flex items-center justify-center transition-all duration-[850ms] ease-[cubic-bezier(0.16,1,0.3,1)] overflow-visible">
      <svg
        viewBox="0 0 792.54694 434.92221"
        className={`w-full h-auto max-w-4xl max-h-[64vh] transition-all duration-[850ms] ease-[cubic-bezier(0.16,1,0.3,1)] z-10 overflow-visible ${
          selectedRegionId ? "cursor-zoom-out" : "cursor-default"
        }`}
        style={{ overflow: "visible" }}
        xmlns="http://www.w3.org/2000/svg"
        onClick={() => onClickRegion(null)}
      >
        <defs>
          <pattern id="map-grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255, 255, 255, 0.012)" strokeWidth="0.8" />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#map-grid)" pointerEvents="none" />

        {/* Fully transparent background overlay to capture clicks on empty map areas */}
        <rect 
          width="100%" 
          height="100%" 
          fill="rgba(0,0,0,0)" 
          pointerEvents="all" 
          className={selectedRegionId ? "cursor-zoom-out" : "cursor-default"}
          onClick={(e) => {
            e.stopPropagation();
            onClickRegion(null);
          }} 
        />

        {/* Tactical geographical background lines */}
        <g stroke="rgba(255,255,255,0.02)" strokeWidth="0.8" strokeDasharray="3,3" fill="none">
          <line x1="420" y1="115" x2="420" y2="435" />
          <line x1="660" y1="300" x2="660" y2="435" />
          <line x1="150" y1="200" x2="150" y2="435" />
        </g>

        {/* Inner Zoom Group */}
        <g
          style={{
            transform: transformStr,
            transformOrigin: "0px 0px",
            transition: "transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)"
          }}
        >
          {/* Kazakhstan Map Region Polygons */}
          <g id="regions-group">
            {regionsList.map((region) => {
              const isActiveRegion = activeRegionIds.includes(region.id);
              const isRegionInspected = activeRegionId === region.id;
              const isRegionZoomed = selectedRegionId === region.id;
              const isAralSea = region.id === "KZ-AS";

              if (isAralSea) {
                return (
                  <motion.path
                    key={region.id}
                    d={region.path}
                    fill="rgba(228, 0, 17, 0.05)"
                    stroke="rgba(228, 0, 17, 0.20)"
                    strokeWidth="0.8"
                    className="pointer-events-none"
                    initial={hasAnimatedFirstTime ? false : { opacity: 0, scale: 0.98 }}
                    animate={{
                      opacity: selectedRegionId ? (isRegionZoomed ? 1 : 0.45) : 0.85,
                      scale: 1
                    }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
                  />
                );
              }

              if (!isActiveRegion) {
                // Inactive Region: visually visible with clearer borders, but absolutely no pointer events or interactions
                return (
                  <motion.path
                    key={region.id}
                    d={region.path}
                    className="outline-none pointer-events-none"
                    fill="rgba(255, 255, 255, 0.02)"
                    stroke="rgba(255, 255, 255, 0.12)"
                    strokeWidth="0.8"
                    initial={hasAnimatedFirstTime ? false : { opacity: 0, pathLength: 0 }}
                    animate={
                      hasScrolledToMap
                        ? {
                            opacity: selectedRegionId ? 0.35 : 0.85,
                            pathLength: 1
                          }
                        : { opacity: 0, pathLength: 0 }
                    }
                    transition={{ 
                      opacity: { duration: 0.3, ease: "easeOut", delay: regionsList.indexOf(region) * 0.005 },
                      pathLength: { duration: 0.5, ease: "easeInOut", delay: regionsList.indexOf(region) * 0.005 }
                    }}
                  />
                );
              }

              // Active Region: premium metallic styling with ultra-fine, selective highlights
              return (
                <motion.path
                  key={region.id}
                  d={region.path}
                  className="transition-all duration-500 outline-none cursor-pointer"
                  fill={
                    isRegionZoomed 
                      ? "rgba(228, 0, 17, 0.22)" 
                      : isRegionInspected 
                        ? "rgba(228, 0, 17, 0.16)" 
                        : "rgba(228, 0, 17, 0.07)"
                  }
                  stroke={
                    isRegionZoomed 
                      ? "#ffffff" 
                      : isRegionInspected 
                        ? "rgba(228, 0, 17, 0.95)" 
                        : "rgba(228, 0, 17, 0.45)"
                  }
                  strokeWidth={isRegionZoomed ? "1.6" : isRegionInspected ? "1.2" : "0.9"}
                  strokeLinejoin="round"
                  onMouseEnter={() => onHoverRegion(region)}
                  onMouseLeave={() => onHoverRegion(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onClickRegion(region.id);
                  }}
                  initial={hasAnimatedFirstTime ? false : { opacity: 0, pathLength: 0, scale: 0.97 }}
                  animate={
                    hasScrolledToMap
                      ? {
                          opacity: selectedRegionId 
                            ? (isRegionZoomed ? 1 : 0.45) 
                            : 1,
                          pathLength: 1,
                          scale: 1
                        }
                      : { opacity: 0, pathLength: 0, scale: 0.97 }
                  }
                  transition={
                    hasAnimatedFirstTime
                      ? { duration: 0.2 }
                      : { 
                        opacity: { duration: 0.4, ease: "easeOut", delay: regionsList.indexOf(region) * 0.01 },
                        pathLength: { duration: 0.6, ease: "easeInOut", delay: regionsList.indexOf(region) * 0.0155 },
                        scale: { duration: 0.4, ease: "easeOut", delay: regionsList.indexOf(region) * 0.01 }
                      }
                  }
                  style={{ transformOrigin: "center" }}
                />
              );
            })}
          </g>

          {/* Interactive City Indicators with Premium Contrast Tags */}
          <g>
            {citiesList.map((city) => {
              const isSelectedCity = selectedCityId === city.id;
              const isChosenCity = chosenCityId === city.id;
              const isHostRegionZoomed = selectedRegionId === city.regionId;
              const isAnyRegionZoomed = selectedRegionId !== null;

              const isHidden = isAnyRegionZoomed && !isHostRegionZoomed;
              const hasAnimated = animatedCityIds[city.id] || false;

              const bulletRadius = isSelectedCity ? "8" : (isChosenCity ? "6.5" : "4.8");
              const bulletFill = isSelectedCity ? "#ff0a21" : (isChosenCity ? "#ff0a21" : "#ffffff");
              const bulletStroke = isSelectedCity ? "#ffffff" : (isChosenCity ? "#ffffff" : "#18181b");
              const bulletStrokeWidth = isSelectedCity ? "2.4" : (isChosenCity ? "1.8" : "1.2");

              return (
                <motion.g 
                  key={city.id}
                  className="cursor-pointer pointer-events-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCity(city.id);
                  }}
                  onMouseEnter={() => {
                    if (!selectedRegionId) {
                      onHoverRegion(regionsList.find(r => r.id === city.regionId) || null);
                    }
                  }}
                  onMouseLeave={() => {
                    if (!selectedRegionId) {
                      onHoverRegion(null);
                    }
                  }}
                  initial={hasAnimated ? false : { opacity: 0, scale: 0, y: 15 }}
                  animate={
                    hasScrolledToMap
                      ? {
                          opacity: isHidden ? 0 : 1,
                          scale: isHidden ? 0 : 1,
                          y: isHidden ? 15 : 0
                        }
                      : { opacity: 0, scale: 0, y: 15 }
                  }
                  transition={
                    hasAnimated 
                      ? { duration: 0.7, ease: [0.16, 1, 0.3, 1] } 
                      : { 
                        duration: 0.7, 
                        delay: 0.05 + citiesList.indexOf(city) * 0.02, // Snappier, beautiful staggered entry flow
                        type: "spring",
                        stiffness: 110,
                        damping: 13
                      }
                  }
                  style={{ 
                    transformOrigin: `${city.cx}px ${city.cy}px`,
                    pointerEvents: isHidden ? "none" : "auto"
                  }}
                >
                  {/* Glowing core representing a server node list */}
                  <circle 
                    cx={city.cx} 
                    cy={city.cy} 
                    r={bulletRadius} 
                    fill={bulletFill} 
                    stroke={bulletStroke} 
                    strokeWidth={bulletStrokeWidth} 
                    className="transition-all duration-300"
                  />
                  
                  {/* Slow breathing gold dashed ring for user's chosen permanent node */}
                  {isChosenCity && !isSelectedCity && (
                    <circle 
                      cx={city.cx} 
                      cy={city.cy} 
                      r="12" 
                      stroke="#fbbf24" 
                      strokeWidth="1.5" 
                      strokeDasharray="3,2"
                      fill="none" 
                      className="animate-pulse"
                    />
                  )}

                  {/* Multi-layered extreme prominence dynamic ping animation waves for the active inspected city */}
                  {isSelectedCity && (
                    <>
                      <circle 
                        cx={city.cx} 
                        cy={city.cy} 
                        r="14" 
                        stroke="#ff0a21" 
                        strokeWidth="1.2" 
                        strokeDasharray="2,2"
                        fill="none" 
                        className="animate-[spin_10s_linear_infinite]"
                        style={{ 
                          transformOrigin: `${city.cx}px ${city.cy}px`
                        }} 
                      />
                      <circle 
                        cx={city.cx} 
                        cy={city.cy} 
                        r="20" 
                        stroke="#ff0a21" 
                        strokeWidth="1.0" 
                        fill="none" 
                        className="animate-ping" 
                        style={{ 
                          transformOrigin: `${city.cx}px ${city.cy}px`,
                          animationDuration: '2s'
                        }} 
                      />
                    </>
                  )}
                  
                  {/* High contrast structured city badge floating capsule (Highly prominent for active selected ones) */}
                  <g transform={`translate(${city.cx}, ${city.cy})`}>
                    <rect 
                      x={isSelectedCity ? -(city.name.length * 4.2 + 12) : (isChosenCity ? -(city.name.length * 4.0 + 12) : -(city.name.length * 3.6 + 8))} 
                      y={isSelectedCity ? -26 : (isChosenCity ? -24 : -21)} 
                      width={isSelectedCity ? (city.name.length * 8.4 + 24) : (isChosenCity ? (city.name.length * 8.0 + 24) : (city.name.length * 7.2 + 16))} 
                      height={isSelectedCity ? "17" : (isChosenCity ? "15" : "14")} 
                      rx="4" 
                      fill={isSelectedCity ? "#ffffff" : "rgba(24, 24, 27, 0.95)"} 
                      stroke={isSelectedCity ? "#ff0a21" : (isChosenCity ? "#ff0a21" : "rgba(255, 255, 255, 0.35)")} 
                      strokeWidth={isSelectedCity ? "1.8" : (isChosenCity ? "1.4" : "0.8")} 
                      className="shadow-2xl transition-all duration-350"
                    />
                    <text 
                      x="0" 
                      y={isSelectedCity ? -14 : (isChosenCity ? -13 : -11)} 
                      textAnchor="middle" 
                      className={`font-sans tracking-widest ${
                        isSelectedCity 
                          ? "fill-black text-[9.5px] font-black uppercase" 
                          : (isChosenCity 
                            ? "fill-white text-[8.5px] font-bold uppercase" 
                            : "fill-white text-[8px] font-bold uppercase")
                      }`}
                    >
                      {isSelectedCity 
                        ? city.name 
                        : (isChosenCity 
                          ? `★ ${city.name}` 
                          : city.name)
                      }
                    </text>
                  </g>
                </motion.g>
              );
            })}
          </g>
        </g>
      </svg>

    </div>
  );
}

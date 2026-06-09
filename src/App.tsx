import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronRight,
  ChevronDown,
  ArrowRight,
  CornerDownRight,
  HelpCircle,
  User,
  FolderClosed,
  Check,
  Plus,
  Instagram,
  ChevronLeft,
  MapPin,
  Clock,
  Star,
  Trophy,
  ExternalLink,
  Dumbbell,
  X,
  Mail,
  Phone,
  MessageSquare,
  Send,
  Apple,
  Smartphone,
  Play,
  Pause,
  Video,
} from "lucide-react";
import KazakhstanMap, {
  regionsList,
  RegionData,
  citiesList,
  activeRegionIds,
  CityData,
} from "./components/KazakhstanMap";
import { OptimizedVideo } from "./components/OptimizedVideo";
import { MapPage } from "./components/MapPage";

// Cookie helper functions for persisting selected node choice across visits
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function setCookie(name: string, value: string, days = 365) {
  if (typeof document === "undefined") return;
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = `${name}=${value || ""}${expires}; path=/; SameSite=Lax; Secure`;
}

interface MediaBlockPlaceholder {
  id: string;
  label: string;
  aspect: string;
  videoUrl: string;
  instagramUrl: string;
}

// Simple highly-optimized animated counter with ease-out algorithm
function AnimatedCounter({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(1);
  const [isCounting, setIsCounting] = useState(false);

  useEffect(() => {
    let start = displayValue;
    const end = value;
    if (start === end) return;

    setIsCounting(true);
    const duration = 750; // Snappy 750ms for elegant but fast satisfaction
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Beautiful ease-out power curve
      const ease = 1 - Math.pow(1 - progress, 4);
      const currentVal = Math.floor(start + (end - start) * ease);

      setDisplayValue(currentVal);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(end);
        setIsCounting(false);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <span
      className={`inline-block transition-all duration-300 ${
        isCounting
          ? "text-[#e40011] filter drop-shadow-[0_0_20px_rgba(228,0,17,0.85)] scale-110"
          : "text-white scale-100"
      }`}
    >
      {displayValue}
    </span>
  );
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  bio: string;
  gradient: string;
  likes: number;
  projects: number;
  color: string;
  place: string;
  image?: string;
  instagram?: string;
}

export function getRawEmployeesForCity(cityId: string | null): Employee[] {
  switch (cityId) {
    case "ALMATY":
      return [
        {
          id: "sophie",
          name: "софи беннетт",
          role: "старший мастер-тренер",
          bio: "эксперт по стретчингу, пилатесу и программам здоровой спины. стаж более 8 лет.",
          gradient: "from-amber-400 via-orange-500 to-red-600",
          likes: 312,
          projects: 48,
          color: "#f97316",
          place: "филиал алматы",
        },
        {
          id: "arman",
          name: "арман сапар",
          role: "тренер по силовому тренингу",
          bio: "мастер спорта по пауэрлифтингу. подготовка к соревнованиям и эффективный набор массы.",
          gradient: "from-teal-400 via-emerald-500 to-cyan-600",
          likes: 289,
          projects: 36,
          color: "#10b981",
          place: "филиал алматы",
        },
        {
          id: "dana",
          name: "дана нургалиева",
          role: "тренер групповых программ",
          bio: "сертифицированный инструктор по зумбе, степ-аэробике и кроссфиту.",
          gradient: "from-blue-500 via-indigo-600 to-purple-700",
          likes: 420,
          projects: 55,
          color: "#3b82f6",
          place: "филиал алматы",
        },
        {
          id: "sanzhar",
          name: "санжар омаров",
          role: "функциональный тренер",
          bio: "специалист по TRX, реабилитации после травм и круговым тренировкам высокой интенсивности.",
          gradient: "from-rose-500 via-pink-600 to-red-600",
          likes: 194,
          projects: 22,
          color: "#ef4444",
          place: "филиал алматы",
        },
        {
          id: "zhanar",
          name: "жанар искакова",
          role: "фитнес-нутрициолог",
          bio: "составление индивидуальных планов питания, разбор рационов и ведение к снижению веса.",
          gradient: "from-violet-400 via-fuchsia-500 to-pink-600",
          likes: 315,
          projects: 41,
          color: "#d946ef",
          place: "филиал алматы",
        },
      ];
    case "ASTANA":
      return [
        {
          id: "damir",
          name: "дамир алиев",
          role: "мастер-тренер тренажерного зала",
          bio: "эксперт по биомеханике упражнений, силовой и функциональной подготовке атлетов.",
          gradient: "from-emerald-400 via-teal-500 to-blue-600",
          likes: 418,
          projects: 64,
          color: "#14b8a6",
          place: "филиал астана",
        },
        {
          id: "meruyert",
          name: "меруэрт байжанова",
          role: "нутрициолог-консультант",
          bio: "сопровождение питания, расчет КБЖУ, мягкая коррекция пищевых привычек.",
          gradient: "from-yellow-400 via-amber-500 to-orange-600",
          likes: 321,
          projects: 49,
          color: "#fbbf24",
          place: "филиал астана",
        },
        {
          id: "timur",
          name: "тимур жакупов",
          role: "инструктор по кроссфиту",
          bio: "высокоинтенсивные функциональные нагрузки для развития силы и взрывной выносливости.",
          gradient: "from-red-500 via-orange-600 to-yellow-600",
          likes: 452,
          projects: 73,
          color: "#dc2626",
          place: "филиал астана",
        },
        {
          id: "alina",
          name: "алина смирнова",
          role: "тренер по растяжке и йоге",
          bio: "мягкий фитнес, развитие гибкости, раскрытие суставов, снятие зажимов и медитации.",
          gradient: "from-violet-500 via-purple-600 to-blue-700",
          likes: 218,
          projects: 30,
          color: "#8b5cf6",
          place: "филиал астана",
        },
        {
          id: "bekbolat",
          name: "бекболат кадыров",
          role: "персональный фитнес-тренер",
          bio: "коррекция осанки, набор мышечной массы, похудение и ОФП для любого возраста.",
          gradient: "from-sky-400 via-blue-500 to-indigo-600",
          likes: 290,
          projects: 38,
          color: "#38bdf8",
          place: "филиал астана",
        },
      ];
    case "KOKSHETAU":
      return [
        {
          id: "vadim-tkachenko",
          name: "ткаченко вадим",
          role: "тренер",
          bio: "",
          gradient: "from-blue-600 to-indigo-900",
          likes: 245,
          projects: 38,
          color: "#2563eb",
          place: "кокшетау",
          image:
            "https://github.com/mckhll-images/videos/blob/main/Frame%2021.png?raw=true",
          instagram: "fitness01trainer",
        },
        {
          id: "rafael-tsoy",
          name: "цой рафаэль",
          role: "тренер",
          bio: "",
          gradient: "from-emerald-600 to-teal-900",
          likes: 312,
          projects: 42,
          color: "#10b981",
          place: "кокшетау",
          image:
            "https://github.com/mckhll-images/videos/blob/main/Frame%2022.png?raw=true",
          instagram: "raphael_tsoy",
        },
        {
          id: "valeriya-gritsaenko",
          name: "грицаенко валерия",
          role: "тренер",
          bio: "",
          gradient: "from-purple-600 to-fuchsia-900",
          likes: 420,
          projects: 51,
          color: "#a855f7",
          place: "кокшетау",
          image:
            "https://github.com/mckhll-images/videos/blob/main/Frame%2023.png?raw=true",
          instagram: "lerchik.fitness",
        },
        {
          id: "vladimir-ryzhkovsky",
          name: "рыжковский владимир",
          role: "тренер",
          bio: "",
          gradient: "from-red-600 to-orange-800",
          likes: 198,
          projects: 29,
          color: "#ef4444",
          place: "кокшетау",
          image:
            "https://github.com/mckhll-images/videos/blob/main/Frame%2024.png?raw=true",
          instagram: "razkraska",
        },
        {
          id: "damir-abrakhmanov",
          name: "абрахманов дамир",
          role: "тренер",
          bio: "",
          gradient: "from-amber-500 to-orange-700",
          likes: 275,
          projects: 35,
          color: "#f59e0b",
          place: "кокшетау",
          image:
            "https://github.com/mckhll-images/videos/blob/main/Frame%2025.png?raw=true",
          instagram: "adforge.coach",
        },
        {
          id: "dmitry-egorov",
          name: "егоров дмитрий",
          role: "тренер",
          bio: "",
          gradient: "from-violet-600 to-indigo-950",
          likes: 310,
          projects: 44,
          color: "#8b5cf6",
          place: "кокшетау",
          image:
            "https://github.com/mckhll-images/videos/blob/main/Frame%2026.png?raw=true",
          instagram: "egorov.dd",
        },
        {
          id: "liya-burduladze",
          name: "бурдуладзе лия",
          role: "тренер",
          bio: "",
          gradient: "from-rose-600 to-red-900",
          likes: 385,
          projects: 49,
          color: "#f43f5e",
          place: "кокшетау",
          image:
            "https://github.com/mckhll-images/videos/blob/main/Frame%2027.png?raw=true",
          instagram: "burduladze_liya",
        },
        {
          id: "zhanat-nurtazin",
          name: "нуртазин жанат",
          role: "тренер",
          bio: "",
          gradient: "from-teal-600 to-cyan-900",
          likes: 290,
          projects: 39,
          color: "#06b6d4",
          place: "кокшетау",
          image:
            "https://github.com/mckhll-images/videos/blob/main/Frame%2028.png?raw=true",
          instagram: "nurtazin.fit",
        },
        {
          id: "tatyana-abrakhmanova",
          name: "абрахманова татьяна",
          role: "тренер",
          bio: "",
          gradient: "from-pink-600 to-rose-900",
          likes: 334,
          projects: 41,
          color: "#ec4899",
          place: "кокшетау",
          image:
            "https://github.com/mckhll-images/videos/blob/main/Frame%2029.png?raw=true",
          instagram: "tanya_fit03",
        },
        {
          id: "nikita-markov",
          name: "марков никита",
          role: "тренер",
          bio: "",
          gradient: "from-sky-600 to-blue-900",
          likes: 215,
          projects: 30,
          color: "#0ea5e9",
          place: "кокшетау",
          image:
            "https://github.com/mckhll-images/videos/blob/main/Frame%2030.png?raw=true",
          instagram: "nnikita_fb",
        },
        {
          id: "aset-zharkenov",
          name: "жаркенов асет",
          role: "тренер",
          bio: "",
          gradient: "from-emerald-500 to-green-800",
          likes: 289,
          projects: 36,
          color: "#10b981",
          place: "кокшетау",
          image:
            "https://github.com/mckhll-images/videos/blob/main/Frame%2031.png?raw=true",
          instagram: "trainerasset",
        },
        {
          id: "sergey-vaygant",
          name: "вайгант сергей",
          role: "тренер",
          bio: "",
          gradient: "from-neutral-700 to-zinc-950",
          likes: 301,
          projects: 44,
          color: "#6b7280",
          place: "кокшетау",
          image:
            "https://github.com/mckhll-images/videos/blob/main/Frame%2032.png?raw=true",
          instagram: "vaigant89",
        },
        {
          id: "evgeny-likhachev",
          name: "лихачев евгений",
          role: "тренер",
          bio: "",
          gradient: "from-blue-500 via-indigo-600 to-neutral-900",
          likes: 345,
          projects: 48,
          color: "#3b82f6",
          place: "кокшетау",
          image:
            "https://github.com/mckhll-images/videos/blob/main/Frame%2033.png?raw=true",
          instagram: "professional_training",
        },
        {
          id: "alexander-balabanov",
          name: "балабанов александр",
          role: "тренер по кикбоксингу",
          bio: "",
          gradient: "from-red-700 via-stone-800 to-black",
          likes: 412,
          projects: 55,
          color: "#dc2626",
          place: "кокшетау",
          image:
            "https://github.com/mckhll-images/videos/blob/main/Frame%2034.png?raw=true",
          instagram: "kickboxing_steel_kokshetau",
        },
      ];
    case "SHYMKENT":
      return [
        {
          id: "kairat",
          name: "кайрат сапаров",
          role: "ведущий силовой тренер",
          bio: "профессиональный фитнес-тренер, программы на силу, абсолютную выносливость и рельеф.",
          gradient: "from-blue-400 via-cyan-500 to-teal-400",
          likes: 389,
          projects: 52,
          color: "#06b6d4",
          place: "филиал шымкент",
        },
        {
          id: "guldana",
          name: "гульдана мырзахметова",
          role: "фитнес-нутрициолог",
          bio: "разбор дефицитов в организме, здоровая коррекция веса и нормализация пищевых привычек.",
          gradient: "from-amber-600 via-red-600 to-neutral-900",
          likes: 264,
          projects: 39,
          color: "#ea580c",
          place: "филиал шымкент",
        },
        {
          id: "bakhytzhan",
          name: "бахытжан тасболатов",
          role: "тренер по пауэрлифтингу",
          bio: "развитие силовых качеств, подготовка к соревнованиям и безопасная становая тяга.",
          gradient: "from-gray-500 via-neutral-600 to-stone-800",
          likes: 311,
          projects: 47,
          color: "#737373",
          place: "филиал шымкент",
        },
        {
          id: "assem",
          name: "асем ерболкызы",
          role: "инструктор по стретчингу",
          bio: "развитие гибкости, улучшение осанки, тренировки на продольный и поперечный шпагат.",
          gradient: "from-purple-500 via-pink-500 to-rose-600",
          likes: 220,
          projects: 34,
          color: "#a855f7",
          place: "филиал шымкент",
        },
        {
          id: "nursultan",
          name: "нурсултан абишев",
          role: "тренер по кардио-нагрузкам",
          bio: "жиросжигание с помощью интервального бега, сайкла и функционального кругового тренинга.",
          gradient: "from-emerald-400 via-green-500 to-cyan-500",
          likes: 274,
          projects: 38,
          color: "#34d399",
          place: "филиал шымкент",
        },
      ];
    case "KENTAU":
      return [
        {
          id: "yerzhan",
          name: "ержан мухтаров",
          role: "тренер тренажерного зала",
          bio: "проведение круговых тренировок и индивидуальный подход к новичкам.",
          gradient: "from-yellow-500 via-orange-600 to-amber-700",
          likes: 159,
          projects: 27,
          color: "#eab308",
          place: "филиал кентау",
        },
        {
          id: "azhar",
          name: "ажар толегова",
          role: "инструктор по фитнесу",
          bio: "укрепление мышечного корсета, интенсивные домашние и зальные тренировки на жиросжигание.",
          gradient: "from-cyan-400 via-teal-500 to-emerald-600",
          likes: 210,
          projects: 31,
          color: "#22d3ee",
          place: "филиал кентау",
        },
        {
          id: "vadim",
          name: "вадим цай",
          role: "персональный наставник",
          bio: "подготовка к силовым нагрузкам, улучшение ОФП для взрослых и развитие баланса.",
          gradient: "from-slate-500 via-neutral-700 to-neutral-950",
          likes: 184,
          projects: 25,
          color: "#64748b",
          place: "филиал кентау",
        },
        {
          id: "kristina",
          name: "кристина волкова",
          role: "тренер по пилатесу",
          bio: "оздоровительная физкультура, улучшение самочувствия при сидячем образе жизни.",
          gradient: "from-blue-400 via-blue-600 to-indigo-800",
          likes: 128,
          projects: 15,
          color: "#60a5fa",
          place: "филиал кентау",
        },
        {
          id: "dias",
          name: "диас жунусов",
          role: "инструктор кроссфита",
          bio: "развитие координации, силы, ловкости и общей выносливости организма.",
          gradient: "from-fuchsia-500 via-purple-600 to-indigo-700",
          likes: 190,
          projects: 28,
          color: "#ecc94b",
          place: "филиал кентау",
        },
      ];
    case "TARAZ":
      return [
        {
          id: "dauren",
          name: "даурен ахметов",
          role: "мастер-тренер",
          bio: "силовые тренировки со свободным весом, рекомендации по питанию и БАДам.",
          gradient: "from-teal-400 via-green-500 to-emerald-700",
          likes: 231,
          projects: 36,
          color: "#2dd4bf",
          place: "филиал тараз",
        },
        {
          id: "sabina",
          name: "сабина сулейманова",
          role: "инструктор по пилатесу",
          bio: "мягкий оздоровительный фитнес для улучшения осанки и тонуса мышц.",
          gradient: "from-emerald-400 via-teal-500 to-blue-500",
          likes: 294,
          projects: 42,
          color: "#34d399",
          place: "филиал тараз",
        },
        {
          id: "askhat",
          name: "коуч по боксу",
          role: "тренер по единоборствам",
          bio: "постановка защитных стоек, правильных ударов и кардио на выносливость.",
          gradient: "from-neutral-600 via-stone-700 to-zinc-900",
          likes: 187,
          projects: 24,
          color: "#78716c",
          place: "филиал тараз",
        },
        {
          id: "zarina",
          name: "зарина амандурдыева",
          role: "тренер по растяжке",
          bio: "шпагаты, улучшение осанки, развитие гибкости позвоночника и пластики тела.",
          gradient: "from-rose-400 via-orange-500 to-amber-500",
          likes: 245,
          projects: 38,
          color: "#f43f5e",
          place: "филиал тараз",
        },
        {
          id: "marat",
          name: "марат досов",
          role: "силовой тренер",
          bio: "высокоинтенсивный тренинг со свободными весами и штангой, работа на массу.",
          gradient: "from-blue-500 via-indigo-600 to-neutral-950",
          likes: 169,
          projects: 21,
          color: "#3b82f6",
          place: "филиал тараз",
        },
      ];
    case "KOSTANAY":
      return [
        {
          id: "alexey",
          name: "алексей белов",
          role: "функциональный тренер",
          bio: "сочетание силовой подготовки с кардио для быстрого прихода в форму.",
          gradient: "from-lime-400 via-green-500 to-emerald-700",
          likes: 215,
          projects: 35,
          color: "#84cc16",
          place: "филиал костанай",
        },
        {
          id: "irina",
          name: "ирина волкова",
          role: "тренер тренажерного зала",
          bio: "эффективное снижение веса и создание красивого мышечного рельефа.",
          gradient: "from-orange-500 via-red-600 to-stone-900",
          likes: 298,
          projects: 45,
          color: "#ea580c",
          place: "филиал костанай",
        },
        {
          id: "pavel",
          name: "павел семенов",
          role: "тренер по бодибилдингу",
          bio: "подготовка к силовым рекордам и соревнованиям. профессиональный силовой наставник.",
          gradient: "from-zinc-500 via-slate-600 to-neutral-800",
          likes: 184,
          projects: 27,
          color: "#71717a",
          place: "филиал костанай",
        },
        {
          id: "aidana",
          name: "айдана болатова",
          role: "нутрициолог велнес-коуч",
          bio: "формирование здоровых привычек питания без изнурительных диет и стресса.",
          gradient: "from-cyan-500 via-blue-600 to-indigo-700",
          likes: 239,
          projects: 39,
          color: "#06b6d4",
          place: "филиал костанай",
        },
        {
          id: "roman",
          name: "роман ким",
          role: "тренер кроссфит-зоны",
          bio: "интенсивные взрывные тренировки на развитие абсолютной силы.",
          gradient: "from-amber-400 via-yellow-500 to-amber-600",
          likes: 201,
          projects: 30,
          color: "#f59e0b",
          place: "филиал костанай",
        },
      ];
    case "KARAGANDA":
      return [
        {
          id: "amina",
          name: "амина касымова",
          role: "инструктор групповых программ",
          bio: "сертифицированный тренер по хатха-йоге, пилатесу и аэробике.",
          gradient: "from-violet-500 via-indigo-600 to-purple-800",
          likes: 275,
          projects: 37,
          color: "#6366f1",
          place: "филиал караганда",
        },
        {
          id: "sergey",
          name: "сергей власов",
          role: "старший мастер-тренер",
          bio: "многолетний опыт ведения силового тренинга и составления реабилитационных программ.",
          gradient: "from-orange-600 via-amber-600 to-neutral-900",
          likes: 342,
          projects: 51,
          color: "#ea580c",
          place: "филиал караганда",
        },
        {
          id: "aidar",
          name: "айдар сериков",
          role: "тренер по пауэрлифтингу",
          bio: "программы экстремального увеличения силовых показателей на основе биомеханики.",
          gradient: "from-teal-400 via-emerald-500 to-blue-600",
          likes: 290,
          projects: 40,
          color: "#2dd4bf",
          place: "филиал караганда",
        },
        {
          id: "olga",
          name: "ольга пак",
          role: "инструктор по фитнесу",
          bio: "быстрое похудение, подтяжка контуров тела и программы выносливости для женщин.",
          gradient: "from-emerald-500 via-teal-600 to-cyan-700",
          likes: 312,
          projects: 46,
          color: "#10b981",
          place: "филиал караганда",
        },
        {
          id: "maxim",
          name: "максим новиков",
          role: "контроль силовой подготовки",
          bio: "помощь в наборе веса, подбор рабочих весов тренажеров с минимизацией рисков.",
          gradient: "from-rose-500 via-pink-600 to-red-700",
          likes: 267,
          projects: 33,
          color: "#f43f5e",
          place: "филиал караганда",
        },
      ];
    case "AKTAU":
      return [
        {
          id: "elena",
          name: "елена петрова",
          role: "фитнес-координатор",
          bio: "подготовка персональных тренировочных планов любой сложности для мужчин и женщин.",
          gradient: "from-rose-500 via-pink-600 to-red-700",
          likes: 456,
          projects: 71,
          color: "#f43f5e",
          place: "филиал актау",
        },
        {
          id: "nurlan",
          name: "нурлан есжанов",
          role: "тренер тренажерного зала",
          bio: "набор сухой мышечной массы, работа на рельеф, улучшение ОФП.",
          gradient: "from-blue-500 via-cyan-500 to-emerald-600",
          likes: 321,
          projects: 48,
          color: "#3b82f6",
          place: "филиал актау",
        },
        {
          id: "sofia",
          name: "софия марина",
          role: "инструктор по пилатесу и йоге",
          bio: "коррекция осанки, раскрытие грудного отдела позвоночника, здоровая спина.",
          gradient: "from-teal-400 via-cyan-500 to-blue-600",
          likes: 389,
          projects: 57,
          color: "#14b8a6",
          place: "филиал актау",
        },
        {
          id: "bulat",
          name: "булат темиров",
          role: "тренер кроссфит-зоны",
          bio: "высокоинтенсивный функциональный тренинг, развитие выносливости и гибкости.",
          gradient: "from-amber-400 via-orange-500 to-red-600",
          likes: 210,
          projects: 31,
          color: "#f59e0b",
          place: "филиал актау",
        },
        {
          id: "victoria",
          name: "виктория шевченко",
          role: "нутрициолог фитнес-тренер",
          bio: "сочетание индивидуальных тренировок и сбалансированного питания для долгосрочного результата.",
          gradient: "from-purple-500 via-indigo-600 to-blue-700",
          likes: 244,
          projects: 35,
          color: "#a855f7",
          place: "филиал актау",
        },
      ];
    case "AKTOBE":
      return [
        {
          id: "armat",
          name: "армат жумагулов",
          role: "тренер тренажерного зала",
          bio: "эксперт по набору массы и силовой выносливости. стаж более 6 лет.",
          gradient: "from-emerald-400 via-teal-500 to-blue-600",
          likes: 198,
          projects: 31,
          color: "#14b8a6",
          place: "филиал актобе",
        },
        {
          id: "aliya",
          name: "алия сабитова",
          role: "инструктор по стретчингу",
          bio: "мягкий фитнес, гибкость, здоровая осанка и восстановление суставов.",
          gradient: "from-rose-500 via-pink-600 to-red-700",
          likes: 215,
          projects: 40,
          color: "#f43f5e",
          place: "филиал актобе",
        },
      ];
    case "SARAN":
      return [
        {
          id: "sergey",
          name: "сергей козин",
          role: "мастер-тренер",
          bio: "функциональная подготовка, похудение и кардио-системы. профессиональное ведение до результата.",
          gradient: "from-blue-500 via-cyan-500 to-emerald-600",
          likes: 147,
          projects: 22,
          color: "#3b82f6",
          place: "филиал сарань",
        },
      ];
    default:
      // Global Roster representing team leaders from major regions:
      return [
        {
          id: "sophie",
          name: "софи беннетт",
          role: "старший мастер-тренер",
          bio: "эксперт по стретчингу, пилатесу и программам здоровой спины. стаж более 8 лет.",
          gradient: "from-amber-400 via-orange-500 to-red-600",
          likes: 312,
          projects: 48,
          color: "#f97316",
          place: "филиал алматы",
        },
        {
          id: "damir",
          name: "дамир алиев",
          role: "мастер-тренер тренажерного зала",
          bio: "эксперт по биомеханике упражнений, силовой и функциональной подготовке атлетов.",
          gradient: "from-emerald-400 via-teal-500 to-blue-600",
          likes: 418,
          projects: 64,
          color: "#14b8a6",
          place: "филиал астана",
        },
        {
          id: "amina",
          name: "амина касымова",
          role: "инструктор групповых программ",
          bio: "сертифицированный тренер по хатха-йоге, пилатесу и аэробике.",
          gradient: "from-violet-500 via-indigo-600 to-purple-800",
          likes: 275,
          projects: 37,
          color: "#6366f1",
          place: "филиал караганда",
        },
        {
          id: "kairat",
          name: "кайрат сапаров",
          role: "ведущий силовой тренер",
          bio: "профессиональный фитнес-тренер, программы на силу, абсолютную выносливость и релье.",
          gradient: "from-blue-400 via-cyan-500 to-teal-400",
          likes: 389,
          projects: 52,
          color: "#06b6d4",
          place: "филиал шымкент",
        },
        {
          id: "elena",
          name: "елена петрова",
          role: "фитнес-координатор",
          bio: "подготовка персональных тренировочных планов любой сложности для мужчин и женщин.",
          gradient: "from-rose-500 via-pink-600 to-red-700",
          likes: 456,
          projects: 71,
          color: "#f43f5e",
          place: "филиал актау",
        },
      ];
  }
}

export function capitalizeEachWord(str: string): string {
  if (!str) return str;
  return str
    .split(" ")
    .map((word) => {
      if (!word) return "";
      if (word.includes("-")) {
        return word
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join("-");
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export function capitalizeFirstLetter(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function capitalizeSentences(str: string): string {
  if (!str) return str;
  return str
    .split(". ")
    .map((sentence) => {
      if (!sentence) return sentence;
      return sentence.charAt(0).toUpperCase() + sentence.slice(1);
    })
    .join(". ");
}

export function formatEmployee(emp: Employee): Employee {
  return {
    ...emp,
    name: capitalizeEachWord(emp.name),
    role: capitalizeEachWord(emp.role),
    bio: capitalizeSentences(emp.bio),
    place: capitalizeEachWord(emp.place),
  };
}

export function getEmployeesForCity(cityId: string | null): Employee[] {
  return getRawEmployeesForCity(cityId).map(formatEmployee);
}

export const map2gisLinks: Record<string, string> = {
  ALMATY: "https://2gis.kz/almaty/search/fitnessblitz",
  ASTANA: "https://2gis.kz/astana/search/fitnessblitz",
  KOKSHETAU: "https://2gis.kz/kokshetau/search/fitnessblitz",
  SHYMKENT: "https://2gis.kz/shymkent/search/fitnessblitz",
  KENTAU: "https://2gis.kz/kentau/search/fitnessblitz",
  TARAZ: "https://2gis.kz/taraz/search/fitnessblitz",
  KOSTANAY: "https://2gis.kz/kostanay/search/fitnessblitz",
  KARAGANDA: "https://2gis.kz/karagandy/search/fitnessblitz",
  AKTAU: "https://2gis.kz/aktau/search/fitnessblitz",
  AKTOBE: "https://2gis.kz/aktobe/search/fitnessblitz",
  SARAN: "https://2gis.kz/saran/search/fitnessblitz",
};

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQSection {
  title: string;
  items: FAQItem[];
}

export const faqData: FAQSection[] = [
  {
    title: "Раздел 1. Оформление, покупка и виды клубных карт",
    items: [
      {
        question: "Как стать членом клуба FitnessBlitz в первый раз?",
        answer:
          "Для регистрации необходимо лично подойти на рецепцию клуба с оригиналом документа, удостоверяющего личность (паспорт или УДЛ). Процесс включает: подписание договора-оферты, внесение персональных данных в базу и обязательное фотографирование. Фотография используется для системы идентификации на входе.",
      },
      {
        question: "Какие тарифные сетки и виды абонементов существуют?",
        answer:
          "В сети действует строгая временная сегментация:\n\n• Утренняя карта: Доступ в будни с 10:00 до 13:00. В выходные и праздники — с 10:00 до 22:00.\n• Дневная карта: Доступ в будни с 07:00 до 18:00. В выходные и праздники — с 10:00 до 22:00.\n• Безлимитная карта (Full): Будни с 07:00 до 24:00, выходные и праздники с 10:00 до 22:00.",
      },
      {
        question:
          "Что произойдет, если я задержусь в зале дольше времени моего тарифа?",
        answer:
          "Вы должны покинуть тренировочную зону и раздевалку до наступления «красного» времени вашего тарифа. Задержка более чем на 10-15 минут может привести к блокировке карты на входе в следующий раз или требованию доплаты за разовое посещение по действующему прайсу.",
      },
      {
        question:
          "Можно ли передать или переоформить карту на другого человека?",
        answer:
          "Клубная карта является строго именной. Передача карты другому лицу для прохода в клуб считается грубым нарушением и влечет за собой аннулирование абонемента без возврата денег. Переоформление на другого человека возможно только как официальная услуга через рецепцию (часто за отдельную плату, установленную прейскурантом).",
      },
    ],
  },
  {
    title: "Раздел 2. Правила первого посещения и базовый этикет",
    items: [
      {
        question: "Каковы требования к внешнему виду?",
        answer:
          "• Обувь: Строго сменная, чистая, закрытая спортивная обувь (кроссовки/кеды). Запрещено заниматься в носках, шлепанцах или босиком.\n• Одежда: Спортивные брюки, шорты, футболки или майки. Запрещено находиться в зале с голым торсом, в джинсах или уличной одежде.",
      },
      {
        question: "Зачем нужно личное полотенце в тренажерном зале?",
        answer:
          "Это вопрос гигиены. Вы обязаны стелить полотенце на скамьи и подушки тренажеров при выполнении упражнений, чтобы ваш пот не оставался на оборудовании. После тренировки рекомендуется протереть тренажер антисептиком, если он предусмотрен в зале.",
      },
      {
        question: "Что делать с инвентарем после завершения упражнения?",
        answer:
          "Клиент обязан самостоятельно разобрать штангу, снять блины и вернуть их на соответствующие накопители. Гантели должны быть возвращены на стойку строго в соответствии с их весовым номиналом. Оставлять инвентарь на полу запрещено.",
      },
    ],
  },
  {
    title: "Раздел 3. Безопасность, медицина и ограничения",
    items: [
      {
        question: "Необходимо ли предоставлять медицинскую справку?",
        answer:
          "Клуб не требует справку в обязательном порядке, однако, подписывая договор, вы берете на себя полную ответственность за состояние своего здоровья. Клуб не несет ответственности за вред, связанный с любым ухудшением здоровья в результате тренировок.",
      },
      {
        question: "С какого возраста разрешено самостоятельное посещение?",
        answer:
          "• С 16 лет: Полное самостоятельное посещение при наличии письменного разрешения от родителей.\n• С 14 до 16 лет: Допускаются к занятиям только в сопровождении персонального тренера или законного представителя.\n• До 14 лет: Нахождение в тренажерном зале (зоне отягощений) запрещено.",
      },
      {
        question: "Что делать при травме или плохом самочувствии?",
        answer:
          "Немедленно прекратите упражнение и обратитесь к любому дежурному инструктору или администратору. В клубе есть аптечка первой помощи. При необходимости администрация обязана вызвать бригаду скорой помощи.",
      },
    ],
  },
  {
    title: "Раздел 4. Посещение групповых программ",
    items: [
      {
        question: "Нужно ли записываться на занятия?",
        answer:
          "Да, на популярные направления запись обязательна из-за лимита оборудования и площади зала. Запись обычно открывается за 24-48 часов через мобильное приложение или по телефону.",
      },
      {
        question: "Что делать, если я опаздываю?",
        answer:
          "Если опоздание составляет более 10 минут, инструктор имеет право не пустить вас в зал. Это связано с тем, что вы пропустили разминку, и интенсивная нагрузка может привести к травме сердца или мышц.",
      },
    ],
  },
  {
    title: "Раздел 5. Раздевалки и личное имущество",
    items: [
      {
        question: "Как обеспечивается сохранность вещей?",
        answer:
          "Клиент закрывает шкафчик на ключ (или электронный замок). Для хранения денег, украшений и гаджетов рекомендуется использовать специальные сейфовые ячейки на рецепции. Клуб не несет материальной ответственности за вещи, оставленные в обычном шкафчике в раздевалке.",
      },
      {
        question: "Что запрещено в зоне душевых?",
        answer:
          "Категорически запрещены любые косметологические процедуры: бритье, использование скрабов (которые забивают стоки), окрашивание волос, использование резких пахучих масел. Также запрещено стирать и сушить вещи.",
      },
    ],
  },
  {
    title: "Раздел 6. Финансовая политика и возвраты",
    items: [
      {
        question: "Как происходит процедура возврата денег?",
        answer:
          "Вы должны подать письменное заявление на имя директора клуба. Из общей стоимости абонемента вычитается стоимость уже прошедших дней с момента активации до даты подачи заявления (даже если вы не ходили). Также могут быть удержаны операционные расходы клуба (согласно условиям договора). Срок выплаты возврата обычно составляет до 10-14 рабочих дней.",
      },
    ],
  },
  {
    title: "Раздел 7. Коммерческая деятельность и жесткие табу",
    items: [
      {
        question: "Можно ли тренироваться со своим личным тренером?",
        answer:
          "Нет. На территории FitnessBlitz имеют право тренировать только штатные сотрудники клуба. Проведение персональных тренировок клиентом для другого клиента («дружеская помощь», похожая на тренировку) расценивается как несанкционированная коммерческая деятельность и ведет к блокировке карты.",
      },
      {
        question: "Можно ли приносить свою еду?",
        answer:
          "Принимать пищу в тренировочной зоне и раздевалках запрещено. Разрешены только вода и спортивные напитки в закрытых пластиковых шейкерах/бутылках. Использование стеклянной тары запрещено из соображений безопасности.",
      },
      {
        question: "Что грозит за порчу имущества?",
        answer:
          "В случае поломки оборудования по вине клиента (нецелевое использование, бросание гантелей на пол, удары по тренажерам) клиент обязан возместить полную рыночную стоимость ремонта или замены оборудования.",
      },
    ],
  },
];

export const homepageFeaturedFAQ: FAQItem[] = [
  {
    question: "Как стать членом клуба FitnessBlitz в первый раз?",
    answer:
      "Для регистрации необходимо лично подойти на рецепцию клуба с оригиналом документа, удостоверяющего личность (паспорт или УДЛ). Процесс включает: подписание договора-оферты, внесение персональных данных в базу и обязательное фотографирование. Фотография используется для системы идентификации на входе.",
  },
  {
    question: "Какие тарифные сетки и виды абонементов существуют?",
    answer:
      "В сети действует строгая временная сегментация:\n• Утренняя карта: Доступ в будни с 10:00 до 13:00. В выходные и праздники — с 10:00 до 22:00.\n• Дневная карта: Доступ в будни с 07:00 до 18:00. В выходные и праздники — с 10:00 до 22:00.\n• Безлимитная карта (Full): Будни с 07:00 до 24:00, выходные и праздники с 10:00 до 22:00.",
  },
  {
    question: "Можно ли тренироваться со своим личным тренером?",
    answer:
      "Нет. На территории FitnessBlitz имеют право тренировать только штатные сотрудники клуба. Проведение персональных тренировок клиентом для другого клиента («дружеская помощь», похожая на тренировку) расценивается как несанкционированная коммерческая деятельность и ведет к блокировке карты.",
  },
];

export interface GymBranch {
  id: string;
  cityId: string;
  name: string;
  address: string;
  microdistrict: string;
  image: string;
  images: string[];
  mapLink: string;
}

export const gymBranches: GymBranch[] = [
  // ALMATY (3 branches)
  {
    id: "almaty-abaya",
    cityId: "ALMATY",
    name: "FitnessBlitz Абая",
    address: "пр. Абая, 150/23 (БЦ «Парус»)",
    microdistrict: "Бостандыкский район, мкр. Коктем-2",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
    ],
    mapLink: "https://2gis.kz/almaty/search/fitnessblitz",
  },
  {
    id: "almaty-seifullina",
    cityId: "ALMATY",
    name: "FitnessBlitz Сейфуллина",
    address: "пр. Сейфуллина, 481",
    microdistrict: "Алмалинский район, угол ул. Айтеке би",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=600&q=80",
    ],
    mapLink: "https://2gis.kz/almaty/search/fitnessblitz",
  },
  {
    id: "almaty-alatau",
    cityId: "ALMATY",
    name: "FitnessBlitz Алатау",
    address: "ул. Момышулы, 14",
    microdistrict: "Алатауский район, мкр. Акбулак",
    image:
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80",
    ],
    mapLink: "https://2gis.kz/almaty/search/fitnessblitz",
  },

  // ASTANA (1 branch)
  {
    id: "astana-esil",
    cityId: "ASTANA",
    name: "FitnessBlitz Есиль",
    address: "ул. Достык, 18 (БЦ «Ансар»)",
    microdistrict: "Есильский район, Левый берег",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80",
    ],
    mapLink: "https://2gis.kz/astana/search/fitnessblitz",
  },

  // KOKSHETAU (1 branch)
  {
    id: "kokshetau-akmola",
    cityId: "KOKSHETAU",
    name: "FitnessBlitz Акмола",
    address: "ул. Акана Серэ, 46/1 (БЦ «Кокшетау»)",
    microdistrict: "Центральный район",
    image: "https://github.com/mckhll-images/videos/blob/main/1.png?raw=true",
    images: Array.from(
      { length: 10 },
      (_, i) =>
        `https://github.com/mckhll-images/videos/blob/main/${i + 1}.png?raw=true`,
    ),
    mapLink: "https://2gis.kz/kokshetau/search/fitnessblitz",
  },

  // SHYMKENT (1 branch)
  {
    id: "shymkent-ordabasy",
    cityId: "SHYMKENT",
    name: "FitnessBlitz Ордабасы",
    address: "пр. Тауке Хана, 43 (ТД «Ордабасы»)",
    microdistrict: "Аль-Фарабийский район",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=600&q=80",
    ],
    mapLink: "https://2gis.kz/shymkent/search/fitnessblitz",
  },

  // KENTAU (1 branch)
  {
    id: "kentau-karatau",
    cityId: "KENTAU",
    name: "FitnessBlitz Каратау",
    address: "ул. Толе би, 28",
    microdistrict: "Центральный район",
    image:
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80",
    ],
    mapLink: "https://2gis.kz/kentau/search/fitnessblitz",
  },

  // TARAZ (2 branches)
  {
    id: "taraz-talap",
    cityId: "TARAZ",
    name: "FitnessBlitz Талап",
    address: "ул. Толе би, 65 (ТЦ «Шахристан»)",
    microdistrict: "ТЦ Шахристан",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80",
    ],
    mapLink: "https://2gis.kz/taraz/search/fitnessblitz",
  },
  {
    id: "taraz-zhambyl",
    cityId: "TARAZ",
    name: "FitnessBlitz Жамбыл",
    address: "ул. Жамбыла, 140",
    microdistrict: "Район автовокзала",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=600&q=80",
    ],
    mapLink: "https://2gis.kz/taraz/search/fitnessblitz",
  },

  // KOSTANAY (1 branch)
  {
    id: "kostanay-tobol",
    cityId: "KOSTANAY",
    name: "FitnessBlitz Тобол",
    address: "ул. Аль-Фараби, 85",
    microdistrict: "Центральный район",
    image:
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80",
    ],
    mapLink: "https://2gis.kz/kostanay/search/fitnessblitz",
  },

  // KARAGANDA (3 branches)
  {
    id: "karaganda-saryarka",
    cityId: "KARAGANDA",
    name: "FitnessBlitz Сарыарка",
    address: "пр. Шахтеров, 40",
    microdistrict: "Юго-Восток",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80",
    ],
    mapLink: "https://2gis.kz/karagandy/search/fitnessblitz",
  },
  {
    id: "karaganda-temirtau",
    cityId: "KARAGANDA",
    name: "FitnessBlitz Темиртау",
    address: "пр. Металлургов, 21",
    microdistrict: "г. Темиртау, центр",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=600&q=80",
    ],
    mapLink: "https://2gis.kz/karagandy/search/fitnessblitz",
  },
  {
    id: "karaganda-central",
    cityId: "KARAGANDA",
    name: "FitnessBlitz Центральный",
    address: "пр. Бухар-Жырау, 57/1",
    microdistrict: "Новый город",
    image:
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80",
    ],
    mapLink: "https://2gis.kz/karagandy/search/fitnessblitz",
  },

  // SARAN (1 branch)
  {
    id: "saran-saran",
    cityId: "SARAN",
    name: "FitnessBlitz Сарань",
    address: "ул. Жамбыла, 67",
    microdistrict: "Центр Сарани",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
    ],
    mapLink: "https://2gis.kz/saran/search/fitnessblitz",
  },

  // AKTAU (1 branch)
  {
    id: "aktau-caspian",
    cityId: "AKTAU",
    name: "FitnessBlitz Каспий",
    address: "12-й микрорайон, 21Б (БЦ «Каспий»)",
    microdistrict: "12-й микрорайон",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
    ],
    mapLink: "https://2gis.kz/aktau/search/fitnessblitz",
  },

  // AKTOBE (1 branch)
  {
    id: "aktobe-aktubinsk",
    cityId: "AKTOBE",
    name: "FitnessBlitz Актюбинск",
    address: "пр. Абилкайыр Хана, 44",
    microdistrict: "Центральный район",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
    ],
    mapLink: "https://2gis.kz/aktobe/search/fitnessblitz",
  },
];

export const getCityLabel = (id: string | null): string => {
  if (!id) return "Все города";
  const cityNamesRu: Record<string, string> = {
    ALMATY: "Алматы",
    ASTANA: "Астана",
    KOKSHETAU: "Кокшетау",
    SHYMKENT: "Шымкент",
    KENTAU: "Кентау",
    TARAZ: "Тараз",
    KOSTANAY: "Костанай",
    KARAGANDA: "Караганда",
    AKTAU: "Актау",
    AKTOBE: "Актюбе",
    SARAN: "Сарань",
  };
  return cityNamesRu[id.toUpperCase()] || id;
};

export const getBranchContact = (
  branch: GymBranch,
): { phone: string; email: string } => {
  if (branch.cityId === "KOKSHETAU" || branch.id?.includes("kokshetau")) {
    return {
      phone: "+7 (701) 751 99 00",
      email: "fitnessblitzkokshetau@gmail.com",
    };
  }
  return {
    phone: "+7 (707) 333-12-34",
    email: "info@fitnessblitz.kz",
  };
};

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 1,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 1,
  }),
};

const gymAddresses: Record<string, string> = {
  ALMATY: "пр. Абая, 150/23 (БЦ «Парус»)",
  ASTANA: "ул. Достык, 18 (БЦ «Ансар»)",
  KOKSHETAU: "ул. Акана Серэ, 46/1 (БЦ «Кокшетау»)",
  SHYMKENT: "пр. Тауке Хана, 43 (ТД «Ордабасы»)",
  KENTAU: "ул. Толе би, 28",
  TARAZ: "ул. Толе би, 65 (ТЦ «Шахристан»)",
  KOSTANAY: "ул. Аль-Фараби, 85",
  KARAGANDA: "пр. Бухар-Жырау, 57/1",
  SARAN: "ул. Жамбыла, 67",
  AKTAU: "12-й микрорайон, 21Б (БЦ «Каспий»)",
  AKTOBE: "пр. Абилкайыр Хана, 44",
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

export default function App() {
  const [activePage, setActivePage] = useState<"main" | "faq" | "map">("main");
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);
  const [clickCount, setClickCount] = useState<number>(0);

  // Section index state (0: Hero, 1: Map, 2: Employees Section)
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [scrollY, setScrollY] = useState<number>(0);
  const lastScrollYRef = useRef<number>(0);
  const hasAutoSelectedRef = useRef<boolean>(false);
  const [hasScrolledToMap, setHasScrolledToMap] = useState<boolean>(false);

  // Active navigation tab indicators
  const isGlavnayaActive = activePage === "main";
  const isNashiClubyActive = false;
  const isNovostiActive = false;
  const isRulesActive = activePage === "faq";

  useEffect(() => {
    if (currentSection === 1) {
      setHasScrolledToMap(true);
    }
  }, [currentSection]);

  // User's persistently chosen personalized city (profile and crew assignment)
  const [chosenCityId, setChosenCityId] = useState<string | null>(() =>
    getCookie("selected_city"),
  );
  const [chosenGymId, setChosenGymId] = useState<string | null>(() =>
    getCookie("selected_gym"),
  );

  // Interactive Map Inspection State
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [selectedGymId, setSelectedGymId] = useState<string | null>(null);

  // Custom states for enriched gym inspectors (galleries, reviews, pricing)
  const [activeImgIndex, setActiveImgIndex] = useState<number>(0);
  const [slideDirection, setSlideDirection] = useState<number>(1);
  const [activeReviewIndex, setActiveReviewIndex] = useState<number>(0);
  const [activePriceTab, setActivePriceTab] = useState<string>("1m");
  const [priceType, setPriceType] = useState<"subscriptions" | "one-time">(
    "subscriptions",
  );
  const [sliderProgress, setSliderProgress] = useState<number>(0);
  const [isImgZoomed, setIsImgZoomed] = useState<boolean>(false);

  // States for Section 4: Lead request & WhatsApp generator
  const [requestTab, setRequestTab] = useState<"phone" | "whatsapp">("phone");
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadCityId, setLeadCityId] = useState("");
  const [leadConsent, setLeadConsent] = useState(false);
  const [leadFormSubmitted, setLeadFormSubmitted] = useState(false);
  const [waCityId, setWaCityId] = useState("");
  const [waPreferredTime, setWaPreferredTime] = useState(
    "Без ограничений / Безлимит",
  );

  // States for BUY SUBSCRIPTION modal
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [buyModalTab, setBuyModalTab] = useState<"phone" | "whatsapp">("phone");
  const [buyModalName, setBuyModalName] = useState("");
  const [buyModalPhone, setBuyModalPhone] = useState("");
  const [buyModalEmail, setBuyModalEmail] = useState("");
  const [buyModalCityId, setBuyModalCityId] = useState("");
  const [buyModalConsent, setBuyModalConsent] = useState(false);
  const [buyModalSubmitted, setBuyModalSubmitted] = useState(false);
  const [buyModalWaPreferredTime, setBuyModalWaPreferredTime] = useState(
    "Без ограничений / Безлимит",
  );

  // States for Video Tutorial Player
  const [isTutorialPlaying, setIsTutorialPlaying] = useState(false);
  const tutorialVideoRef = useRef<HTMLVideoElement | null>(null);

  // FAQ Accordion expansion control states
  const [activeFeaturedFaqIdx, setActiveFeaturedFaqIdx] = useState<
    number | null
  >(null);
  const [activeFullFaqKey, setActiveFullFaqKey] = useState<string | null>(null);

  useEffect(() => {
    if (chosenCityId) {
      setLeadCityId(chosenCityId);
      setWaCityId(chosenCityId);
      setBuyModalCityId(chosenCityId);
    } else {
      setLeadCityId("ALMATY");
      setWaCityId("ALMATY");
      setBuyModalCityId("ALMATY");
    }
  }, [chosenCityId]);

  const handleSubmitLeadForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadConsent) return;
    setLeadFormSubmitted(true);
  };

  const selectedWaCityName =
    citiesList.find((c) => c.id === waCityId)?.name || "Алматы";
  const cityWhatsAppMap: Record<string, string> = {
    ALMATY: "77073331234",
    ASTANA: "77073335678",
    SHYMKENT: "77073339012",
    KOKSHETAU: "77071234569",
    KENTAU: "77073337890",
    TARAZ: "77073334321",
    KOSTANAY: "77073338765",
    KARAGANDA: "77073339876",
    AKTAU: "77073331122",
    AKTOBE: "77073333344",
    SARAN: "77073335566",
  };
  const waPhoneNumber = cityWhatsAppMap[waCityId] || "77073331234";
  const waPreFilledText = `Здравствуйте! Хочу записаться на тренировки в FitnessBlitz в г. ${selectedWaCityName}. Мне удобнее заниматься в следующее время: ${waPreferredTime}.`;
  const waHref = `https://api.whatsapp.com/send?phone=${waPhoneNumber}&text=${encodeURIComponent(waPreFilledText)}`;

  const handleSubmitBuyModalForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyModalConsent) return;
    setBuyModalSubmitted(true);
  };
  const selectedBuyModalWaCityName =
    citiesList.find((c) => c.id === buyModalCityId)?.name || "Алматы";
  const buyModalWaPhoneNumber =
    cityWhatsAppMap[buyModalCityId] || "77073331234";
  const buyModalWaPreFilledText = `Здравствуйте! Хочу приобрести абонемент в FitnessBlitz в г. ${selectedBuyModalWaCityName}. Мне удобнее заниматься в следующее время: ${buyModalWaPreferredTime}.`;
  const buyModalWaHref = `https://api.whatsapp.com/send?phone=${buyModalWaPhoneNumber}&text=${encodeURIComponent(buyModalWaPreFilledText)}`;

  const [isFirstLoginModalOpen, setIsFirstLoginModalOpen] = useState(false);
  const [playHeroAnimation, setPlayHeroAnimation] = useState(false);
  const [isVideoSectionHovered, setIsVideoSectionHovered] = useState(false);
  const [isScrollPaused, setIsScrollPaused] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isHeaderCitySelectOpen, setIsHeaderCitySelectOpen] = useState(false);
  const [hoveredRegion, setHoveredRegion] = useState<RegionData | null>(null);
  const [hoveredCityId, setHoveredCityId] = useState<string | null>(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  // Trigger first visit modal with a cinematic reveal delay if cookie is missing
  useEffect(() => {
    const saved = getCookie("selected_city");
    if (!saved) {
      const timer = setTimeout(() => {
        setIsFirstLoginModalOpen(true);
      }, 350);
      return () => clearTimeout(timer);
    } else {
      setPlayHeroAnimation(true);
    }
  }, []);

  // Automated review rotator (6s interval)
  useEffect(() => {
    if (!selectedCityId || isImgZoomed) return;
    const reviewInterval = setInterval(() => {
      setActiveReviewIndex((prev) => prev + 1);
    }, 6000);
    return () => {
      clearInterval(reviewInterval);
    };
  }, [selectedCityId, isImgZoomed]);

  // Dedicated slideshow auto-sliding ticker (3 seconds) with custom smooth progress tracker
  useEffect(() => {
    if (!selectedCityId || isImgZoomed) {
      setSliderProgress(0);
      return;
    }

    const currentImagesCount = selectedCityId === "KOKSHETAU" ? 10 : 3;
    const duration = 3000; // 3 seconds
    const intervalMs = 20; // 50 fps for buttery-smooth progress animation
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += intervalMs;
      // Calculate state percentage
      const pct = Math.min((elapsed / duration) * 100, 100);
      setSliderProgress(pct);

      if (elapsed >= duration) {
        setSlideDirection(1);
        setActiveImgIndex((prev) => (prev + 1) % currentImagesCount);
        elapsed = 0;
        setSliderProgress(0);
      }
    }, intervalMs);

    return () => {
      clearInterval(timer);
    };
  }, [selectedCityId, activeImgIndex, isImgZoomed]);

  const isVideoSectionHoveredRef = useRef(isVideoSectionHovered);
  useEffect(() => {
    isVideoSectionHoveredRef.current = isVideoSectionHovered;
  }, [isVideoSectionHovered]);

  const headerDropdownScrollRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const preventScrollLeak = (e: WheelEvent) => {
      e.stopPropagation();
    };
    const preventTouchLeak = (e: TouchEvent) => {
      e.stopPropagation();
    };
    node.addEventListener("wheel", preventScrollLeak, { passive: true });
    node.addEventListener("touchmove", preventTouchLeak, { passive: true });
  }, []);

  // Wheel behavior transitions are disabled to keep the Hero section strictly in its main state.
  useEffect(() => {
    // Reset hover on load to be absolutely sure
    setIsVideoSectionHovered(false);
  }, []);

  // Dynamically load coaches based on chosenCityId (null/empty loads general network roster)
  const employeesList: Employee[] = getEmployeesForCity(chosenCityId);

  const [activeCardIdx, setActiveCardIdx] = useState<number>(0);
  const [coachSliderProgress, setCoachSliderProgress] = useState<number>(0);
  const [followedCrew, setFollowedCrew] = useState<Record<string, boolean>>({});

  // Helper properties to display dynamic text about selected city and location
  const selectedCityForCoaches = chosenCityId
    ? citiesList.find((c) => c.id === chosenCityId) || null
    : null;
  const cityBranches = selectedCityForCoaches
    ? gymBranches.filter((b) => b.cityId === selectedCityForCoaches.id)
    : [];
  const chosenBranch = chosenGymId
    ? gymBranches.find((b) => b.id === chosenGymId)
    : null;

  // Build the subtitle message according to exact user requirements (casing is normal, non-caps)
  let coachesSubtitleText =
    "Наша команда объединяет более 100+ профессиональных сертифицированных инструкторов из 16 залов по всему Казахстану.";
  if (selectedCityForCoaches) {
    if (chosenBranch) {
      coachesSubtitleText = `Профессиональные инструкторы, сертифицированные из города ${selectedCityForCoaches.name} по адресу ${chosenBranch.address}.`;
    } else if (cityBranches.length === 1) {
      coachesSubtitleText = `Профессиональные инструкторы, сертифицированные из города ${selectedCityForCoaches.name} по адресу ${cityBranches[0].address}.`;
    } else {
      coachesSubtitleText = `Профессиональные инструкторы, сертифицированные из города ${selectedCityForCoaches.name}.`;
    }
  }

  // Dedicated coach slideshow auto-sliding ticker (3 seconds) with custom smooth progress tracker
  useEffect(() => {
    const duration = 3000; // 3 seconds
    const intervalMs = 20; // 50 fps for buttery-smooth progress animation
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += intervalMs;
      // Calculate state percentage
      const pct = Math.min((elapsed / duration) * 100, 100);
      setCoachSliderProgress(pct);

      if (elapsed >= duration) {
        setActiveCardIdx((prev) => (prev + 1) % employeesList.length);
        elapsed = 0;
        setCoachSliderProgress(0);
      }
    }, intervalMs);

    return () => {
      clearInterval(timer);
    };
  }, [activeCardIdx, employeesList.length]);

  // Handle Keyboard Escape / Space key to exit zoom / clear selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedRegionId || selectedCityId) {
        if (e.key === " " || e.key === "Spacebar" || e.key === "Escape") {
          e.preventDefault();
          handleRegionClick(null);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedRegionId, selectedCityId]);

  const containerRef = useRef<HTMLDivElement>(null);
  const lastWheelTimeRef = useRef<number>(0);

  // References to the raw DOM nodes of news lists for clicking scroll controls
  const newsRow1DomRef = useRef<HTMLDivElement | null>(null);
  const newsRow2DomRef = useRef<HTMLDivElement | null>(null);
  const newsRowStandAlone1DomRef = useRef<HTMLDivElement | null>(null);
  const newsRowStandAlone2DomRef = useRef<HTMLDivElement | null>(null);

  // Robust callback refs to bind non-passive scroll translation listeners instantly
  const activeDragListeners = useRef<
    WeakMap<
      HTMLDivElement,
      {
        mousedown: (e: MouseEvent) => void;
        mouseleave: () => void;
        mouseup: () => void;
        mousemove: (e: MouseEvent) => void;
      }
    >
  >(new WeakMap());

  // Programmatic smooth scroll navigation helper (supporting both hero and standalone layouts)
  const scrollRow = (
    rowNumber: 1 | 2,
    direction: "left" | "right",
    isStandAlone?: boolean,
  ) => {
    const node = isStandAlone
      ? rowNumber === 1
        ? newsRowStandAlone1DomRef.current
        : newsRowStandAlone2DomRef.current
      : rowNumber === 1
        ? newsRow1DomRef.current
        : newsRow2DomRef.current;
    if (node) {
      const scrollAmount = isStandAlone ? 350 : 260; // Card width + gap
      node.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Factory function to bind high-quality horizontal wheel and drag-scrolling listeners to a DOM node
  const createNewsRowRef = (
    domRef: React.MutableRefObject<HTMLDivElement | null>,
  ) => {
    return (node: HTMLDivElement | null) => {
      domRef.current = node;
      if (!node) return;

      if (!activeDragListeners.current.has(node)) {
        let isDown = false;
        let startX = 0;
        let scrollLeft = 0;
        let velocity = 0;
        let lastX = 0;
        let lastTime = 0;
        let momentumFrame = 0;

        const mousedown = (e: MouseEvent) => {
          isDown = true;
          cancelAnimationFrame(momentumFrame);
          node.style.cursor = "grabbing";
          startX = e.pageX - node.offsetLeft;
          scrollLeft = node.scrollLeft;
          lastX = e.pageX;
          lastTime = performance.now();
          velocity = 0;
        };

        const startMomentum = () => {
          if (Math.abs(velocity) < 0.15) return;
          let speed = velocity * 13; // momentum speed factor
          const decay = 0.94; // friction decay constant
          const step = () => {
            if (isDown) return;
            if (Math.abs(speed) < 0.1) return;
            node.scrollLeft -= speed;
            speed *= decay;
            momentumFrame = requestAnimationFrame(step);
          };
          momentumFrame = requestAnimationFrame(step);
        };

        const mouseleave = () => {
          if (!isDown) return;
          isDown = false;
          node.style.cursor = "grab";
          startMomentum();
        };

        const mouseup = () => {
          if (!isDown) return;
          isDown = false;
          node.style.cursor = "grab";
          startMomentum();
        };

        const mousemove = (e: MouseEvent) => {
          if (!isDown) return;
          e.preventDefault();
          const x = e.pageX - node.offsetLeft;
          const walk = (x - startX) * 1.6;
          node.scrollLeft = scrollLeft - walk;

          const now = performance.now();
          const dt = now - lastTime;
          if (dt > 1) {
            const dx = e.pageX - lastX;
            velocity = dx / dt;
            lastX = e.pageX;
            lastTime = now;
          }
        };

        const dragstart = (e: DragEvent) => {
          e.preventDefault();
        };

        node.addEventListener("mousedown", mousedown);
        node.addEventListener("mouseleave", mouseleave);
        node.addEventListener("mouseup", mouseup);
        node.addEventListener("mousemove", mousemove);
        node.addEventListener("dragstart", dragstart as any);
        node.style.cursor = "grab";

        // Keep type compatibility with WeakMap
        activeDragListeners.current.set(node, {
          mousedown,
          mouseleave,
          mouseup,
          mousemove,
        });
      }
    };
  };

  const newsRow1Ref = useCallback(createNewsRowRef(newsRow1DomRef), []);
  const newsRow2Ref = useCallback(createNewsRowRef(newsRow2DomRef), []);
  const newsRowStandAlone1Ref = useCallback(
    createNewsRowRef(newsRowStandAlone1DomRef),
    [],
  );
  const newsRowStandAlone2Ref = useCallback(
    createNewsRowRef(newsRowStandAlone2DomRef),
    [],
  );

  const navLinks = ["platform", "solutions", "company", "support"];

  const handleRegionClick = (regionId: string | null) => {
    if (!regionId) {
      setSelectedRegionId(null);
      setSelectedCityId(null);
      setSelectedGymId(null);
      setHoveredRegion(null);
      setHoveredCityId(null);
      return;
    }

    if (!activeRegionIds.includes(regionId)) {
      return;
    }

    setSelectedRegionId(regionId);

    const citiesInThisRegion = citiesList.filter(
      (c) => c.regionId === regionId,
    );
    if (citiesInThisRegion.length === 1) {
      const city = citiesInThisRegion[0];
      setSelectedCityId(city.id);
      setHoveredCityId(city.id);
      const region = regionsList.find((r) => r.id === regionId);
      if (region) {
        setHoveredRegion(region);
      }

      const cityBranches = gymBranches.filter((b) => b.cityId === city.id);
      if (cityBranches.length === 1) {
        setSelectedGymId(cityBranches[0].id);
      } else {
        setSelectedGymId(null);
      }
    } else {
      setSelectedCityId(null);
      setHoveredCityId(null);
      setSelectedGymId(null);
    }
  };

  // Automatically select the chosen city or entire map on initial application mount
  useEffect(() => {
    const savedCityId = getCookie("selected_city");
    if (savedCityId) {
      handleSelectCity(savedCityId);
    } else {
      handleSelectCity(null);
    }
  }, []);

  const handleSelectChosenCity = (cityId: string | null) => {
    setActiveCardIdx(0); // Reset Carousel position to keep layout active
    setPlayHeroAnimation(true); // Trigger hero intro animations
    if (!cityId) {
      setChosenCityId(null);
      setCookie("selected_city", ""); // remove/zero-out cookie
      setChosenGymId(null);
      setCookie("selected_gym", "");
      handleSelectCity(null); // Automatically reset map selection to show entire map
      return;
    }
    const city = citiesList.find((c) => c.id === cityId);
    if (city) {
      setChosenCityId(city.id);
      setCookie("selected_city", city.id); // set cookie persistently!
      setChosenGymId(null);
      setCookie("selected_gym", "");
      handleSelectCity(city.id); // Automatically select/focus it on the map!
    }
  };

  const handleSelectCity = (cityId: string | null) => {
    setActiveCardIdx(0); // Reset Carousel position to keep layout active
    setActiveImgIndex(0); // Reset gallery index
    setActiveReviewIndex(0); // Reset review index
    setActivePriceTab("1m"); // Reset tariff tab
    if (!cityId) {
      setSelectedCityId(null);
      setSelectedRegionId(null);
      setHoveredRegion(null);
      setHoveredCityId(null);
      setSelectedGymId(null);
      return;
    }
    const city = citiesList.find((c) => c.id === cityId);
    if (city) {
      setSelectedCityId(city.id);
      setSelectedRegionId(city.regionId);
      setHoveredCityId(city.id);
      const region = regionsList.find((r) => r.id === city.regionId);
      if (region) {
        setHoveredRegion(region);
      }

      const cityBranches = gymBranches.filter((b) => b.cityId === city.id);
      if (cityBranches.length === 1) {
        setSelectedGymId(cityBranches[0].id);
      } else {
        setSelectedGymId(null);
      }
    }
  };

  // Automatically select the user's chosen city on the map when they scroll into the map section
  useEffect(() => {
    if (currentSection === 1) {
      if (!hasAutoSelectedRef.current && chosenCityId) {
        handleSelectCity(chosenCityId);
        hasAutoSelectedRef.current = true;
      }
    } else {
      hasAutoSelectedRef.current = false;
    }
  }, [currentSection, chosenCityId]);

  // Aggregate stats dynamically linked across cities rather than geographic region boxes
  // Keep the big counter strictly at 16 (once visited), counting up from 1 to 16 dynamically on first visit.
  const activeCompaniesCount = hasScrolledToMap ? 16 : 1;

  // Media blocks for Hero column slideshow loops
  const column1Blocks: MediaBlockPlaceholder[] = [
    {
      id: "col1-1",
      label: "баланс",
      aspect: "aspect-[3/4]",
      videoUrl:
        "https://raw.githubusercontent.com/mckhll-images/videos/main/1.mp4",
      instagramUrl: "https://www.instagram.com/p/DY7IHJxs3nV/",
    },
    {
      id: "col1-2",
      label: "ритм",
      aspect: "aspect-[1/1]",
      videoUrl:
        "https://raw.githubusercontent.com/mckhll-images/videos/main/2.mp4",
      instagramUrl: "https://www.instagram.com/p/DY3pLv-su_V/",
    },
    {
      id: "col1-3",
      label: "динамика",
      aspect: "aspect-[4/3]",
      videoUrl:
        "https://raw.githubusercontent.com/mckhll-images/videos/main/3.mp4",
      instagramUrl: "https://www.instagram.com/p/DYtc2jox9wZ/",
    },
    {
      id: "col1-4",
      label: "энергия",
      aspect: "aspect-[16/10]",
      videoUrl:
        "https://raw.githubusercontent.com/mckhll-images/videos/main/4.mp4",
      instagramUrl: "https://www.instagram.com/p/DYW8u_LMy1P/",
    },
    {
      id: "col1-5",
      label: "фокус",
      aspect: "aspect-[3/4]",
      videoUrl:
        "https://raw.githubusercontent.com/mckhll-images/videos/main/5.mp4",
      instagramUrl: "https://www.instagram.com/p/DYHpBsCsZ7b/",
    },
    {
      id: "col1-6",
      label: "процесс",
      aspect: "aspect-[1/1]",
      videoUrl:
        "https://raw.githubusercontent.com/mckhll-images/videos/main/6.mp4",
      instagramUrl: "https://www.instagram.com/p/DX8wAjYslto/",
    },
    {
      id: "col1-7",
      label: "координация",
      aspect: "aspect-[4/3]",
      videoUrl:
        "https://raw.githubusercontent.com/mckhll-images/videos/main/7.mp4",
      instagramUrl: "https://www.instagram.com/p/DX5uNTVMq6k/",
    },
    {
      id: "col1-8",
      label: "развитие",
      aspect: "aspect-[16/10]",
      videoUrl:
        "https://raw.githubusercontent.com/mckhll-images/videos/main/8.mp4",
      instagramUrl: "https://www.instagram.com/p/DXowoR0MrE3/",
    },
    {
      id: "col1-9",
      label: "контроль",
      aspect: "aspect-[3/4]",
      videoUrl:
        "https://raw.githubusercontent.com/mckhll-images/videos/main/9.mp4",
      instagramUrl: "https://www.instagram.com/p/DXgNU5iM1Ir/",
    },
    {
      id: "col1-10",
      label: "детали",
      aspect: "aspect-[1/1]",
      videoUrl:
        "https://raw.githubusercontent.com/mckhll-images/videos/main/10.mp4",
      instagramUrl: "https://www.instagram.com/p/DXbpZ9YItu4/",
    },
  ];

  const column2Blocks: MediaBlockPlaceholder[] = [
    {
      id: "col2-1",
      label: "тонус",
      aspect: "aspect-[1/1]",
      videoUrl:
        "https://raw.githubusercontent.com/mckhll-images/videos/main/11.mp4",
      instagramUrl: "https://www.instagram.com/p/DXExE5Ys3r_/",
    },
    {
      id: "col2-2",
      label: "атмосфера",
      aspect: "aspect-[3/4]",
      videoUrl:
        "https://raw.githubusercontent.com/mckhll-images/videos/main/12.mp4",
      instagramUrl: "https://www.instagram.com/p/DW6cVNJM4g7/",
    },
    {
      id: "col2-3",
      label: "амплитуда",
      aspect: "aspect-[16/10]",
      videoUrl:
        "https://raw.githubusercontent.com/mckhll-images/videos/main/13.mp4",
      instagramUrl: "https://www.instagram.com/p/DWy0huYsg8O/",
    },
    {
      id: "col2-4",
      label: "движение",
      aspect: "aspect-[4/3]",
      videoUrl:
        "https://raw.githubusercontent.com/mckhll-images/videos/main/14.mp4",
      instagramUrl: "https://www.instagram.com/p/DWq_UrTMQIL/",
    },
    {
      id: "col2-5",
      label: "опора",
      aspect: "aspect-[3/4]",
      videoUrl:
        "https://raw.githubusercontent.com/mckhll-images/videos/main/15.mp4",
      instagramUrl: "https://www.instagram.com/p/DWgtbh2sZ0o/",
    },
    {
      id: "col2-6",
      label: "пульс",
      aspect: "aspect-[1/1]",
      videoUrl:
        "https://raw.githubusercontent.com/mckhll-images/videos/main/16.mp4",
      instagramUrl: "https://www.instagram.com/p/DWl0wKGMlTb/",
    },
    {
      id: "col2-7",
      label: "поток",
      aspect: "aspect-[16/10]",
      videoUrl:
        "https://raw.githubusercontent.com/mckhll-images/videos/main/17.mp4",
      instagramUrl: "https://www.instagram.com/p/DWVWilYIHn5/",
    },
    {
      id: "col2-8",
      label: "прогресс",
      aspect: "aspect-[4/3]",
      videoUrl:
        "https://raw.githubusercontent.com/mckhll-images/videos/main/18.mp4",
      instagramUrl: "https://www.instagram.com/p/DWG-AU9CExj/",
    },
    {
      id: "col2-9",
      label: "мотивация",
      aspect: "aspect-[3/4]",
      videoUrl:
        "https://raw.githubusercontent.com/mckhll-images/videos/main/1.mp4",
      instagramUrl: "https://www.instagram.com/p/DWByFxbs82t/",
    },
    {
      id: "col2-10",
      label: "комьюнити",
      aspect: "aspect-[1/1]",
      videoUrl:
        "https://raw.githubusercontent.com/mckhll-images/videos/main/2.mp4",
      instagramUrl: "https://www.instagram.com/p/DV-VW4IMxYF/",
    },
    {
      id: "col2-11",
      label: "стиль",
      aspect: "aspect-[16/10]",
      videoUrl:
        "https://raw.githubusercontent.com/mckhll-images/videos/main/3.mp4",
      instagramUrl: "https://www.instagram.com/p/DV2uQyqDAH3/",
    },
  ];

  interface NewsItem {
    id: string;
    tag: string;
    title: string;
    date: string;
    description: string;
    tagColor: string;
    borderColor: string;
    isGeneral?: boolean;
    cityId?: string;
    imageUrl?: string;
  }

  const newsFeedList: NewsItem[] = [
    {
      id: "gen-1",
      tag: "Обновление сети",
      title:
        "Новая линейка профессиональных тренажеров Hammer Strength во всех залах",
      date: "31 мая 2026",
      description:
        "Современные силовые и кардио линейки уже поставляются во все клубы сети FitnessBlitz.",
      tagColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      borderColor: "hover:border-blue-500/40",
      isGeneral: true,
      imageUrl:
        "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "gen-2",
      tag: "Реферальный бонус",
      title: "Приведи друга — неделя безлимитного фитнеса бесплатно в подарок!",
      date: "28 мая 2026",
      description:
        "Приглашайте друзей заниматься вместе! За каждого нового резидента мы дарим 7 дней безлимита на ваш абонемент.",
      tagColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      borderColor: "hover:border-purple-500/40",
      isGeneral: true,
      imageUrl:
        "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "gen-3",
      tag: "Фитнес-вебинары",
      title: "Эксклюзивные мастер-классы от ведущих сертифицированных тренеров",
      date: "24 мая 2026",
      description:
        "Открытые лекции и разбор правильной техники базовых движений для безопасного прогресса.",
      tagColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      borderColor: "hover:border-amber-500/40",
      isGeneral: true,
      imageUrl:
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "gen-4",
      tag: "Качество сервиса",
      title: "Аттестация тренерского состава всей сети",
      date: "18 мая 2026",
      description:
        "Все тренеры FitnessBlitz успешно подтвердили свою профессиональную квалификацию.",
      tagColor: "text-teal-400 bg-teal-500/10 border-teal-500/20",
      borderColor: "hover:border-teal-500/40",
      isGeneral: true,
      imageUrl:
        "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "loc-alm-1",
      tag: "Алматы",
      title: "Запуск новой кроссфит-зоны в Алматы Алатау",
      date: "30 мая 2026",
      description:
        "Установлена просторная функциональная рама, пегборды и навесное оборудование для кросс-тренинга.",
      tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      borderColor: "hover:border-emerald-500/40",
      cityId: "ALMATY",
      imageUrl:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "loc-ast-1",
      tag: "Астана",
      title: "Увеличение времени работы филиала Есиль в столице",
      date: "29 мая 2026",
      description:
        "По многочисленным просьбам резидентов продлеваем время работы по праздничным и выходным дням.",
      tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      borderColor: "hover:border-emerald-500/40",
      cityId: "ASTANA",
      imageUrl:
        "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "loc-shm-1",
      tag: "Шымкент",
      title: "Обновление кардиотренажеров в клубе Шымкента",
      date: "27 мая 2026",
      description:
        "Беговые дорожки и эллипсоиды полностью заменены на новые модели с интерактивными дисплеями.",
      tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      borderColor: "hover:border-emerald-500/40",
      cityId: "SHYMKENT",
      imageUrl:
        "https://images.unsplash.com/photo-1571731956622-f1b8a0243ba4?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "loc-kar-1",
      tag: "Караганда",
      title: "Набор в группы по функциональному тренингу в Караганде",
      date: "25 мая 2026",
      description:
        "Старт тренировок в мини-группах с понедельника. Успейте записаться на рецепции клуба.",
      tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      borderColor: "hover:border-emerald-500/40",
      cityId: "KARAGANDA",
      imageUrl:
        "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "loc-kok-1",
      tag: "Кокшетау",
      title: "Первенство клуба по жиму штанги лежа в Кокшетау",
      date: "22 мая 2026",
      description:
        "Покажите свой максимум на силовом турнире среди резидентов! Отличный призовой фонд.",
      tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      borderColor: "hover:border-emerald-500/40",
      cityId: "KOKSHETAU",
      imageUrl:
        "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "loc-kok-2",
      tag: "Кокшетау",
      title: "Новое профессиональное оборудование в зоне кардио",
      date: "24 мая 2026",
      description:
        "Завезли продвинутые беговые дорожки ультра-класса с сенсорными экранами и встроенными вентиляторами.",
      tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      borderColor: "hover:border-emerald-500/40",
      cityId: "KOKSHETAU",
      imageUrl:
        "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "loc-kok-3",
      tag: "Кокшетау",
      title: "Старт утренних групповых тренировок по Flex & Stretch",
      date: "26 мая 2026",
      description:
        "Мягкая растяжка суставов и выравнивание осанки каждое утро в 08:30. Заряд бодрости на весь день!",
      tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      borderColor: "hover:border-emerald-500/40",
      cityId: "KOKSHETAU",
      imageUrl:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "loc-kok-4",
      tag: "Кокшетау",
      title: "Семинар по фитнес-нутрициологии: Здоровое похудение",
      date: "28 мая 2026",
      description:
        "Теория правильного подбора нутриентов, расчет дневной нормы КБЖУ и лайфхаки для борьбы с голодом.",
      tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      borderColor: "hover:border-emerald-500/40",
      cityId: "KOKSHETAU",
      imageUrl:
        "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "loc-kok-5",
      tag: "Кокшетау",
      title: "Турнир по кроссфиту Kokshetau Summer Challenge",
      date: "31 мая 2026",
      description:
        "Проверьте свою выносливость в комплексном многоборье! Регистрация открыта для всех желающих.",
      tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      borderColor: "hover:border-emerald-500/40",
      cityId: "KOKSHETAU",
      imageUrl:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "loc-akt-1",
      tag: "Актобе",
      title: "Замена амортизационного напольного покрытия",
      date: "20 мая 2026",
      description:
        "Покрытие повышенной плотности уложено в зоне свободных весов в филиале в Актобе.",
      tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      borderColor: "hover:border-emerald-500/40",
      cityId: "AKTOBE",
      imageUrl:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "loc-tar-1",
      tag: "Тараз",
      title: "Эффективная система приточно-вытяжной вентиляции в Таразе",
      date: "17 мая 2026",
      description:
        "Новые климатические системы обеспечат максимальную свежесть и оптимальную прохладу на тренировке.",
      tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      borderColor: "hover:border-emerald-500/40",
      cityId: "TARAZ",
      imageUrl:
        "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "gen-5",
      tag: "Здоровье",
      title: "Влияние регулярного сна на восстановление мышц",
      date: "14 мая 2026",
      description:
        "Подробный научный разбор биоритмов и секретов качественного сна для пиковых спортивных результатов.",
      tagColor: "text-teal-400 bg-teal-500/10 border-teal-500/20",
      borderColor: "hover:border-teal-500/40",
      isGeneral: true,
      imageUrl:
        "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "gen-6",
      tag: "Абонементы",
      title: "Специальный летний безлимит по суперцене",
      date: "10 мая 2026",
      description:
        "Запустили эксклюзивный тариф на 3 месяца ультра-выгодных занятий в любом зале без ограничений времени.",
      tagColor: "text-pink-400 bg-pink-500/10 border-pink-500/20",
      borderColor: "hover:border-pink-500/40",
      isGeneral: true,
      imageUrl:
        "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "loc-alm-2",
      tag: "Алматы",
      title: "Новый зал групповых программ в FitnessBlitz Самал",
      date: "08 мая 2026",
      description:
        "Просторная светлая студия с панорамными окнами и новыми пилатес-реформаторами готова к приему гостей.",
      tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      borderColor: "hover:border-emerald-500/40",
      cityId: "ALMATY",
      imageUrl:
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "loc-alm-3",
      tag: "Алматы",
      title: "Ночной фитнес-интенсив 'Almaty Neon Night'",
      date: "12 мая 2026",
      description:
        "Уникальная групповая суперсессия в неоновом свете со световыми диодными браслетами под живой диджей-сет.",
      tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      borderColor: "hover:border-emerald-500/40",
      cityId: "ALMATY",
      imageUrl:
        "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "loc-alm-4",
      tag: "Алматы",
      title: "Набор детской спортивной секции ОФП на Абая",
      date: "15 мая 2026",
      description:
        "Развивающие игровые тренировки для детей 7-12 лет. Формируем здоровую осанку и гибкость с пеленок.",
      tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      borderColor: "hover:border-emerald-500/40",
      cityId: "ALMATY",
      imageUrl:
        "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "loc-alm-5",
      tag: "Алматы",
      title: "Мастер-класс от чемпиона мира по бодибилдингу в Almaty Arena",
      date: "20 мая 2026",
      description:
        "Разбор тонкостей периодизации тренировочного объема, секреты проработки слабых мышечных групп и фотосессия.",
      tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      borderColor: "hover:border-emerald-500/40",
      cityId: "ALMATY",
      imageUrl:
        "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "loc-alm-6",
      tag: "Алматы",
      title: "Almaty Blitz Run: Клубный забег на Медеу",
      date: "25 мая 2026",
      description:
        "Ежегодный фирменный подъем вверх со специальными силовыми станциями на финише. Проявите характер!",
      tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      borderColor: "hover:border-emerald-500/40",
      cityId: "ALMATY",
      imageUrl:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "loc-ast-2",
      tag: "Астана",
      title: "Утренняя йога на террасе филиала в Астане",
      date: "05 мая 2026",
      description:
        "Запускаем расслабляющие сессии хатха-йоги на открытом воздухе каждое утро вторника и четверга.",
      tagColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      borderColor: "hover:border-emerald-500/40",
      cityId: "ASTANA",
      imageUrl:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop",
    },
  ];

  const loopingColumn1 = [...column1Blocks, ...column1Blocks];
  const loopingColumn2 = [...column2Blocks, ...column2Blocks];

  // Smooth scroll handler targeting elements naturally and setting correct state indicators
  const scrollToSectionStr = (id: string, index: number) => {
    if (activePage !== "main") {
      setActivePage("main");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          setCurrentSection(index);
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        setCurrentSection(index);
      }
    }
  };

  // ScrollSpy listener that tracks window scroll height, updates active section index, and resets zoom on map scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      setScrollY(scrollPos);

      // Smart header visibility based on scroll direction with optimal functional updates
      if (scrollPos <= 50) {
        setIsHeaderVisible(true);
      } else if (scrollPos > lastScrollYRef.current + 8) {
        setIsHeaderVisible((prev) => (prev ? false : prev));
      } else if (scrollPos < lastScrollYRef.current - 8) {
        setIsHeaderVisible((prev) => (!prev ? true : prev));
      }
      lastScrollYRef.current = scrollPos;

      const hero = document.getElementById("hero-section");
      const stats = document.getElementById("stats-section");
      const news = document.getElementById("news-section");
      const mapping = document.getElementById("map-section");
      const coaches = document.getElementById("coaches-section");
      const requestSec = document.getElementById("request-section");

      if (!hero || !stats || !mapping || !coaches) return;

      const offset = window.innerHeight * 0.45;

      const newsTop = news ? news.offsetTop : Infinity;
      const mapTop = mapping.offsetTop;
      const coachesTop = coaches.offsetTop;
      const requestSecTop = requestSec ? requestSec.offsetTop : Infinity;

      if (scrollPos >= requestSecTop - offset) {
        setCurrentSection(4);
        setIsVideoSectionHovered(false);
      } else if (scrollPos >= newsTop - offset) {
        setCurrentSection(3);
        setIsVideoSectionHovered(false);
      } else if (scrollPos >= coachesTop - offset) {
        setCurrentSection(2);
        setIsVideoSectionHovered(false);
      } else if (scrollPos >= mapTop - offset) {
        setCurrentSection(1);
        setIsVideoSectionHovered(false);
      } else {
        setCurrentSection(0);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run initial execution after paint
    setTimeout(handleScroll, 50);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [selectedRegionId]);

  const selectedCityBranches = selectedCityId
    ? gymBranches.filter((b) => b.cityId === selectedCityId)
    : [];
  const isBranchChoiceActive = !!(
    selectedCityId &&
    selectedCityBranches.length > 1 &&
    !selectedGymId
  );

  return (
    <div
      ref={containerRef}
      className={`relative min-h-screen w-full ${activePage === "faq" ? "overflow-visible" : "overflow-x-hidden"} bg-black select-none font-sans text-white normal-case`}
    >
      {/* Simple, clean solid dark overlay for flat minimalism */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Fine refractive grain overlay */}
        <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuNSIvPgo8L3N2Zz4=')] bg-repeat" />
      </div>

      {/* Fixed top navbar (always floating smoothly with backdrop glassmorphism) */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out translate-y-0 opacity-100 ${
          scrollY > 30
            ? "bg-black/85 backdrop-blur-md py-4 shadow-[0_4px_30px_rgba(0,0,0,0.8)]"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-6 sm:px-10">
          {/* Left Brand Area */}
          <div className="flex items-center select-none" id="brand-logo">
            <img
              src="/logo.png"
              alt="FitnessBlitz Logo"
              className="h-10 sm:h-11 w-auto object-contain"
            />
          </div>

          {/* Dynamic Section Indicator Bar (Middle Nav links) */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="hidden lg:flex items-center gap-1 bg-[#0e0e11] border border-white/5 py-1 px-1.5 rounded-full"
            id="center-links"
          >
            <button
              onClick={() => scrollToSectionStr("hero-section", 0)}
              className={`px-4 py-2 text-[9.5px] font-black uppercase tracking-widest rounded-full transition-all duration-200 cursor-pointer ${
                isGlavnayaActive
                  ? "bg-[#e40011] text-white"
                  : "text-white/50 hover:text-white"
              }`}
            >
              Главная
            </button>
            <button
              onClick={() => scrollToSectionStr("map-section", 1)}
              className={`px-4 py-2 text-[9.5px] font-black uppercase tracking-widest rounded-full transition-all duration-200 cursor-pointer ${
                isNashiClubyActive
                  ? "bg-[#e40011] text-white"
                  : "text-white/50 hover:text-white"
              }`}
            >
              Наши клубы
            </button>
            <button
              onClick={() => scrollToSectionStr("news-section", 3)}
              className={`px-4 py-2 text-[9.5px] font-black uppercase tracking-widest rounded-full transition-all duration-200 cursor-pointer ${
                isNovostiActive
                  ? "bg-[#e40011] text-white"
                  : "text-white/50 hover:text-white"
              }`}
            >
              Новости
            </button>
            <button
              onClick={() => {
                setActivePage("faq");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`px-4 py-2 text-[9.5px] font-black uppercase tracking-widest rounded-full transition-all duration-200 cursor-pointer ${
                isRulesActive
                  ? "bg-[#e40011] text-white"
                  : "text-white/50 hover:text-white"
              }`}
            >
              Правила
            </button>
            <button
              onClick={() => {
                alert("Раздел Франшиза находится в разработке.");
              }}
              className="px-4 py-2 text-[9.5px] font-black uppercase tracking-widest rounded-full transition-all duration-200 text-white/50 hover:text-white cursor-pointer"
            >
              Франшиза
            </button>
          </motion.nav>

          {/* Right Action Side */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-2 sm:gap-3"
          >
            {/* White Premium Button Dropdown to select city from the beginning */}
            <div className="relative" id="header-city-dropdown-wrapper">
              <button
                onClick={() =>
                  setIsHeaderCitySelectOpen(!isHeaderCitySelectOpen)
                }
                className="bg-neutral-950/70 hover:bg-black backdrop-blur-md border border-white/10 hover:border-[#ff0a21]/55 text-white text-[10.5px] font-black uppercase tracking-widest px-5.5 py-3 rounded-full transition-all duration-300 active:scale-95 cursor-pointer hover:shadow-[0_0_20px_rgba(228,0,17,0.25)] flex items-center gap-2"
                id="get-started-cta"
              >
                <span>
                  {chosenCityId ? getCityLabel(chosenCityId) : "Выбрать город"}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-white/50 transition-transform duration-300 ${isHeaderCitySelectOpen ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {isHeaderCitySelectOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2.5 w-60 bg-[#0d0d0e]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-[0_25px_60px_rgba(0,0,0,0.95)] z-50 text-left flex flex-col gap-1.5"
                  >
                    <button
                      onClick={() => {
                        handleSelectChosenCity(null);
                        setIsHeaderCitySelectOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-3 rounded-xl text-[10px] uppercase tracking-widest font-black transition-all duration-200 block leading-none cursor-pointer shrink-0 ${
                        !chosenCityId
                          ? "bg-[#e40011] text-white"
                          : "text-white/60 hover:bg-white/5 hover:text-white font-bold border border-white/5 bg-white/[0.02]"
                      }`}
                    >
                      Все филиалы
                    </button>

                    <div className="h-px bg-white/5 w-full shrink-0" />

                    <div
                      ref={headerDropdownScrollRef}
                      className="space-y-1 max-h-48 overflow-y-auto overscroll-contain pr-0.5"
                    >
                      {citiesList.map((city) => {
                        const isSel = chosenCityId === city.id;
                        return (
                          <button
                            key={city.id}
                            onClick={() => {
                              handleSelectChosenCity(city.id);
                              setIsHeaderCitySelectOpen(false);
                            }}
                            className={`w-full text-left px-3.5 py-3 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all duration-200 block leading-none cursor-pointer ${
                              isSel
                                ? "bg-[#e40011] text-white font-black"
                                : "text-white/60 hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            {getCityLabel(city.id)}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* "Купить абонемент" Header Button */}
            <button
              onClick={() => setIsBuyModalOpen(true)}
              className="bg-[#e40011] hover:bg-[#b5000d] text-white text-[9px] sm:text-[10.5px] font-black uppercase tracking-widest px-3.5 sm:px-5.5 py-3 rounded-full transition-colors duration-200 cursor-pointer flex items-center justify-center font-sans"
              id="header-buy-membership-cta"
            >
              <span className="hidden sm:inline">Купить абонемент</span>
              <span className="sm:hidden">Купить</span>
            </button>
          </motion.div>
        </div>
      </header>

      {/* Page Sections Container with beautiful natural scroll behavior */}
      {activePage === "faq" ? (
        /* ================= DETAILED FULL FAQ PAGE ================= */
        <div className="relative w-full min-h-screen bg-neutral-950 pt-32 pb-16 px-6 sm:px-10 overflow-visible">
          {/* Ambient Background Lights */}
          <div className="absolute top-[10%] left-[-15%] w-[500px] h-[500px] bg-[#e40011]/10 rounded-full blur-[140px] pointer-events-none mix-blend-screen" />
          <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-[#e40011]/6 rounded-full blur-[130px] pointer-events-none mix-blend-screen" />

          <div className="max-w-5xl mx-auto w-full relative z-10">
            {/* Title Header */}
            <div className="mb-14 text-center sm:text-left">
              <h1 className="text-4xl sm:text-5xl font-extrabold font-sans text-white tracking-tight leading-[1.1] uppercase">
                База знаний <span className="text-[#e40011]">FAQ</span>
              </h1>
            </div>

            {/* Grid content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Category List (Anchors) */}
              <div className="lg:col-span-4 space-y-2.5 lg:sticky lg:top-32">
                <div className="bg-white/[0.015] border border-white/5 rounded-2xl p-4.5 text-left">
                  <span className="text-[9px] font-sans text-white/40 font-bold uppercase tracking-widest block mb-4">
                    Разделы регламента:
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {faqData.map((section, idx) => (
                      <a
                        key={idx}
                        href={`#section-${idx}`}
                        className="flex items-center gap-2.5 text-left px-3.5 py-3 rounded-xl text-[10.5px] font-bold font-sans tracking-wide transition-all border border-transparent hover:border-white/5 text-neutral-400 hover:text-white hover:bg-white/[0.02]"
                      >
                        <span className="flex items-center justify-center w-5 h-5 rounded-md bg-neutral-900 border border-white/5 text-[9.5px] font-bold text-[#e40011]">
                          {idx + 1}
                        </span>
                        <span className="truncate">
                          {section.title.replace(/^Раздел \d+\.\s*/, "")}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Categories and Accordions */}
              <div className="lg:col-span-8 space-y-12">
                {faqData.map((section, sIdx) => (
                  <div
                    key={sIdx}
                    id={`section-${sIdx}`}
                    className="scroll-mt-28 space-y-4"
                  >
                    <div className="flex flex-col gap-1 border-b border-white/5 pb-2.5 mb-5 text-left">
                      <span className="text-[9px] uppercase tracking-[0.2em] font-black text-[#ff1a2b] font-sans">
                        Раздел {sIdx + 1}
                      </span>
                      <h2 className="text-lg sm:text-xl font-extrabold font-sans text-white tracking-wide uppercase">
                        {section.title.replace(/^Раздел \d+\.\s*/, "")}
                      </h2>
                    </div>

                    <div className="flex flex-col gap-3 text-left">
                      {section.items.map((item, iIdx) => {
                        const key = `faq-${sIdx}-${iIdx}`;
                        const isOpen = activeFullFaqKey === key;
                        return (
                          <div
                            key={iIdx}
                            className={`rounded-2xl p-4.5 sm:p-5 transition-all duration-300 cursor-pointer bg-neutral-950/40 backdrop-blur-xl border ${
                              isOpen
                                ? "border-[#ff0a21]/50 shadow-[0_12px_36px_rgba(228,0,17,0.06)] bg-[#101014]/60"
                                : "border-white/[0.06] hover:border-[#ff0a21]/20 hover:bg-[#141419]/30"
                            }`}
                            onClick={() =>
                              setActiveFullFaqKey(isOpen ? null : key)
                            }
                          >
                            <div className="flex items-center justify-between gap-4">
                              <h3 className="text-xs sm:text-sm font-bold text-white font-sans tracking-wide leading-snug">
                                {item.question}
                              </h3>
                              <button className="flex items-center justify-center w-6 h-6 rounded-full bg-white/5 text-white/50 transition-all duration-300 shrink-0 select-none">
                                <ChevronDown
                                  className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? "rotate-180 text-white" : ""}`}
                                />
                              </button>
                            </div>

                            <AnimatePresence initial={false}>
                              {isOpen && (
                                <motion.div
                                  initial={{
                                    height: 0,
                                    opacity: 0,
                                    marginTop: 0,
                                  }}
                                  animate={{
                                    height: "auto",
                                    opacity: 1,
                                    marginTop: 14,
                                  }}
                                  exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                  transition={{
                                    duration: 0.2,
                                    ease: "easeInOut",
                                  }}
                                  className="overflow-hidden"
                                >
                                  <div className="text-[11.5px] sm:text-xs text-neutral-400 leading-relaxed font-sans font-normal border-t border-white/5 pt-3.5 whitespace-pre-line">
                                    {item.answer}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ================= FAQ FOOTER SECTION ================= */}
          <footer className="relative w-full bg-neutral-950 border-t border-white/5 pt-16 pb-12 px-0 mt-20 z-10 select-none overflow-hidden shrink-0">
            {/* Ambient red glow for premium aesthetic */}
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#e40011]/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
            <div className="absolute top-0 left-[10%] w-[500px] h-[150px] bg-[#e40011]/3 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

            <div className="max-w-5xl mx-auto w-full">
              {/* Top row of footer grids */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-white/5">
                {/* Brand Column (Col Span 4) */}
                <div className="lg:col-span-4 flex flex-col gap-5 text-left">
                  <div className="flex items-center gap-3">
                    <img
                      src="/logo.png"
                      alt="FitnessBlitz Logo"
                      className="h-10 sm:h-11 w-auto object-contain"
                    />
                  </div>
                  <p className="text-white/50 text-xs sm:text-sm font-sans leading-relaxed">
                    Мы — первая и крупнейшая сеть современных фитнес-клубов
                    безлимитного формата в Казахстане. Наша миссия — сделать
                    фитнес доступным, качественным и приятным для всех жителей
                    страны.
                  </p>

                  {/* 2GIS Award Indicator */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/5 w-fit">
                    <img
                      src="https://disk.2gis.com/rubricator/thenomineesd5fc3fe077e03b4c544c55602eee949e.svg"
                      alt="2GIS Brand nominee"
                      className="w-4 h-4 object-contain brightness-110"
                      referrerPolicy="no-referrer"
                    />
                    <span className="font-sans text-[10px] text-[#cdd8e6] font-extrabold uppercase tracking-wider">
                      Победитель 2ГИС
                    </span>
                  </div>
                </div>

                {/* Navigation Links Column (Col Span 2) */}
                <div className="lg:col-span-2 flex flex-col gap-4 text-left">
                  <h4 className="text-xs font-sans text-white font-black uppercase tracking-widest border-l-2 border-[#e40011] pl-2.5">
                    Навигация
                  </h4>
                  <ul className="flex flex-col gap-2.5 text-xs font-bold uppercase tracking-wider text-white/50">
                    <li>
                      <button
                        onClick={() => scrollToSectionStr("hero-section", 0)}
                        className="hover:text-white transition-colors duration-200 cursor-pointer focus:outline-none text-left"
                      >
                        Главная
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => scrollToSectionStr("map-section", 1)}
                        className="hover:text-white transition-colors duration-200 cursor-pointer focus:outline-none text-left"
                      >
                        Наши клубы
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => scrollToSectionStr("news-section", 3)}
                        className="hover:text-white transition-colors duration-200 cursor-pointer focus:outline-none text-left"
                      >
                        Новости
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setActivePage("faq");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="hover:text-white transition-colors duration-200 cursor-pointer focus:outline-none text-left"
                      >
                        Правила
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          alert("Раздел Франшиза находится в разработке.");
                        }}
                        className="hover:text-white transition-colors duration-200 cursor-pointer focus:outline-none text-left"
                      >
                        Франшиза
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Cities / Branch selector Column (Col Span 3) */}
                <div className="lg:col-span-3 flex flex-col gap-4 text-left">
                  <h4 className="text-xs font-sans text-white font-black uppercase tracking-widest border-l-2 border-[#e40011] pl-2.5">
                    Наши филиалы
                  </h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                    {citiesList.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          handleSelectChosenCity(c.id);
                          scrollToSectionStr("map-section", 1);
                        }}
                        className={`text-left text-xs font-sans transition-all duration-200 cursor-pointer focus:outline-none hover:text-white capitalize flex items-center gap-1.5 ${
                          chosenCityId === c.id
                            ? "text-[#e40011] font-black"
                            : "text-white/50 font-normal"
                        }`}
                      >
                        <MapPin className="w-3 h-3 opacity-60 shrink-0" />
                        <span className="truncate">{c.name}</span>
                      </button>
                    ))}
                    {/* Select All */}
                    <button
                      onClick={() => {
                        handleSelectChosenCity(null);
                        scrollToSectionStr("map-section", 1);
                      }}
                      className={`text-left col-span-2 text-xs font-sans font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer focus:outline-none hover:text-[#e40011] mt-1 flex items-center gap-1.5 ${
                        !chosenCityId
                          ? "text-[#e40011] font-black"
                          : "text-white/40"
                      }`}
                    >
                      <span>Все филиалы</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Direct Support Contacts Column (Col Span 3) */}
                <div className="lg:col-span-3 flex flex-col gap-4 text-left">
                  <h4 className="text-xs font-sans text-white font-black uppercase tracking-widest border-l-2 border-[#e40011] pl-2.5">
                    Контакты
                  </h4>
                  <div className="flex flex-col gap-3 font-sans text-xs">
                    <div className="flex gap-3 items-start">
                      <Phone className="w-4 h-4 text-[#e40011] shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-white/40 font-bold uppercase text-[9px] tracking-wider mb-0.5">
                          Единый Колл-центр
                        </span>
                        <a
                          href="tel:+77073331234"
                          className="text-white hover:text-[#e40011] transition-colors font-bold"
                        >
                          +7 (707) 333-12-34
                        </a>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start">
                      <Clock className="w-4 h-4 text-[#e40011] shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-white/40 font-bold uppercase text-[9px] tracking-wider mb-0.5">
                          Режим работы залов
                        </span>
                        <p className="text-white">Будни: 07:00 – 23:00</p>
                        <p className="text-white">Выходные: 09:00 – 22:00</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start">
                      <Instagram className="w-4 h-4 text-[#e40011] shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-white/40 font-bold uppercase text-[9px] tracking-wider mb-0.5">
                          Социальные сети
                        </span>
                        <a
                          href="https://www.instagram.com/fitnessblitz_official/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:text-[#e40011] transition-colors font-bold flex items-center gap-1"
                        >
                          <span>@fitnessblitz_official</span>
                          <ExternalLink className="w-3 h-3 opacity-55" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-5 w-full">
                {/* Left Details */}
                <div className="text-left font-sans text-[11px] text-white/30 flex flex-col gap-1 leading-normal select-none">
                  <p className="font-semibold text-white/40">
                    © {new Date().getFullYear()} FitnessBlitz. Все права
                    защищены.
                  </p>
                  <p>
                    Использование материалов сайта без предварительного согласия
                    правообладателя запрещено законом Казахстана.
                  </p>
                </div>

                {/* Right Details - Social actions and scroll up */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="px-4.5 py-2.5 rounded-xl bg-white/[0.02] hover:bg-[#e40011] border border-white/5 hover:border-[#e40011] transition-all text-[10px] font-sans font-black uppercase tracking-widest text-white/70 hover:text-white cursor-pointer active:scale-95 text-center flex items-center gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
                    title="Наверх"
                  >
                    <span>Наверх</span>
                    <ChevronLeft className="w-4 h-4 rotate-90" />
                  </button>
                </div>
              </div>
            </div>
          </footer>
        </div>
      ) : activePage === "map" ? (
        <MapPage
          selectedCityId={selectedCityId}
          setSelectedCityId={setSelectedCityId}
          selectedRegionId={selectedRegionId}
          setSelectedRegionId={setSelectedRegionId}
          selectedGymId={selectedGymId}
          setSelectedGymId={setSelectedGymId}
          activeImgIndex={activeImgIndex}
          setActiveImgIndex={setActiveImgIndex}
          slideDirection={slideDirection}
          setSlideDirection={setSlideDirection}
          activeReviewIndex={activeReviewIndex}
          setActiveReviewIndex={setActiveReviewIndex}
          activePriceTab={activePriceTab}
          setActivePriceTab={setActivePriceTab}
          priceType={priceType}
          setPriceType={setPriceType}
          sliderProgress={sliderProgress}
          setSliderProgress={setSliderProgress}
          isImgZoomed={isImgZoomed}
          setIsImgZoomed={setIsImgZoomed}
          chosenCityId={chosenCityId}
          setChosenCityId={setChosenCityId}
          chosenGymId={chosenGymId}
          setChosenGymId={setChosenGymId}
          setIsBuyModalOpen={setIsBuyModalOpen}
          setBuyModalCityId={setBuyModalCityId}
          scrollToSectionStr={scrollToSectionStr}
          hasScrolledToMap={true}
          handleSelectCity={handleSelectCity}
          hoveredRegion={hoveredRegion}
          setHoveredRegion={setHoveredRegion}
          setCookie={setCookie}
        />
      ) : (
        <div className="w-full flex flex-col pt-0">
          {/* ================= SECTION 1: HERO SECTION ================= */}
          <div
            id="hero-section"
            className="relative w-full min-h-screen flex items-center bg-black overflow-hidden shrink-0"
          >
            {/* Subtle grid and ambient shadows specialized to Section 1 */}
            <div className="absolute inset-0 z-0 opacity-15">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4vw_4vw]" />
            </div>

            {/* Clean minimalist design: no glowing ambient filters */}

            {/* Seamless Soft fading/blurring masks stretching across the entire width of the window */}
            <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-black via-black/85 to-transparent z-25 pointer-events-none backdrop-blur-[0.5px]" />
            <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-black via-black/85 to-transparent z-25 pointer-events-none backdrop-blur-[0.5px]" />

            <div className="relative w-full h-full max-w-7xl mx-auto flex items-center z-10 px-6 sm:px-10">
              {/* LEFT COLUMN: Main typographic content & Action triggers */}
              <motion.div
                className="w-full md:w-[46%] lg:w-[42%] flex flex-col justify-center text-left py-20"
                id="left-content-block"
                initial={{ opacity: 0, x: -40 }}
                animate={
                  playHeroAnimation
                    ? {
                        opacity: isVideoSectionHovered ? 0 : 1,
                        x: isVideoSectionHovered ? -50 : 0,
                        scale: isVideoSectionHovered ? 0.95 : 1,
                      }
                    : { opacity: 0, x: -40 }
                }
                transition={{
                  duration: 1.0,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  pointerEvents: isVideoSectionHovered ? "none" : "auto",
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={
                    playHeroAnimation
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: -10 }
                  }
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="flex items-center gap-2.5 mb-6 bg-[#cdd8e6]/5 border border-[#cdd8e6]/20 hover:border-[#cdd8e6]/40 px-3.5 py-1.5 rounded-full w-fit backdrop-blur-xl select-none transition-all duration-300 shadow-[0_2px_12px_rgba(205,216,230,0.05)]"
                >
                  <img
                    src="https://disk.2gis.com/rubricator/thenomineesd5fc3fe077e03b4c544c55602eee949e.svg"
                    alt="2GIS Award nominee"
                    className="w-4 h-4 object-contain brightness-110"
                    referrerPolicy="no-referrer"
                  />
                  <span className="font-sans text-[10px] sm:text-[10.5px] text-neutral-200 font-bold tracking-wider uppercase">
                    Лучший фитнес-клуб по версии{" "}
                    <span className="text-[#cdd8e6] font-black">2ГИС</span>
                  </span>
                </motion.div>

                {/* Bold Headline Title Stack - Cinematic Swiss Typography */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={
                    playHeroAnimation
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 15 }
                  }
                  transition={{
                    duration: 0.9,
                    delay: 0.3,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="text-left mb-5"
                  id="main-headline-container"
                >
                  <h1 className="text-3xl sm:text-4xl md:text-[2.6rem] lg:text-[3.15rem] font-black tracking-tight leading-[1.1] text-white font-display uppercase">
                    <span className="text-[#e40011]">FitnessBlitz</span>
                    <span className="block text-white mt-2">Ваш путь</span>
                    <span className="block text-white mt-1">к успеху!</span>
                  </h1>
                </motion.div>

                {/* Mandatory Description Paragraph text block */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={
                    playHeroAnimation
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 10 }
                  }
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-white/70 text-xs sm:text-xs tracking-wider leading-relaxed max-w-[480px] mb-10 font-normal flex flex-col gap-2.5"
                  id="hero-desc-copy"
                >
                  <span className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#ff1a2b] shrink-0 mt-0.5" />
                    <span>Более 100 000 активных клиентов выбрали нас</span>
                  </span>
                  <span className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#ff1a2b] shrink-0 mt-0.5" />
                    <span>16 премиальных клубов с современным оборудованием</span>
                  </span>
                  <span className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#ff1a2b] shrink-0 mt-0.5" />
                    <span>Доступ в 10 крупнейших городах Казахстана</span>
                  </span>
                  <span className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#ff1a2b] shrink-0 mt-0.5" />
                    <span>
                      Уже 16 лет делаем профессиональный фитнес доступным
                    </span>
                  </span>
                </motion.p>

                {/* Action area */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={
                    playHeroAnimation
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 15 }
                  }
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
                  id="action-buttons-area"
                >
                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => setIsBuyModalOpen(true)}
                      className="bg-[#e40011] hover:bg-[#b5000d] text-white text-[10.5px] font-black uppercase tracking-widest px-8.5 py-4.5 rounded-full flex items-center gap-2.5 transition-colors duration-200 cursor-pointer"
                      id="action-btn-primary"
                    >
                      <span>КУПИТЬ АБОНЕМЕНТ</span>
                    </button>

                    <button
                      onClick={() => scrollToSectionStr("map-section", 1)}
                      className="bg-transparent border border-white/10 hover:border-white hover:bg-white/5 text-white text-[10.5px] font-black uppercase tracking-widest px-8.5 py-4.5 rounded-full transition-colors duration-200 cursor-pointer"
                      id="action-btn-secondary"
                    >
                      <span>ВЫБРАТЬ ЗАЛ</span>
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* MIDDLE CHARACTER OVERLAY */}
            <div
              className="absolute inset-x-0 bottom-0 top-0 z-30 pointer-events-none flex items-end overflow-hidden"
              id="hero-character-container"
            >
              {/* Animated Man Character */}
              <motion.div
                className="absolute bottom-0 h-[68vh] sm:h-[75vh] md:h-[82vh] lg:h-[88vh] flex items-end justify-center"
                initial={{
                  opacity: 0,
                  y: 70,
                  scale: 0.96,
                  left: isVideoSectionHovered ? "45%" : "82%",
                  x: isVideoSectionHovered
                    ? "calc(-50% - 300px)"
                    : "calc(-50% - 240px)",
                }}
                animate={
                  playHeroAnimation
                    ? {
                        opacity: 1,
                        left: isVideoSectionHovered ? "45%" : "82%",
                        x: isVideoSectionHovered
                          ? "calc(-50% - 300px)"
                          : "calc(-50% - 240px)",
                        scale: isVideoSectionHovered ? 1.05 : 1,
                        y: 0,
                      }
                    : {
                        opacity: 0,
                        y: 70,
                        scale: 0.96,
                      }
                }
                transition={{
                  duration: 1.1,
                  delay: 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {/* Cross-fading standing vs pointing images */}
                <div className="relative h-full aspect-[3/4] flex items-end">
                  {/* First image - Standing (cross-armed) */}
                  <motion.img
                    src="/man_standing_1780219318092.png"
                    alt="Atlas Security Specialist"
                    className="absolute bottom-0 max-h-full w-auto object-contain object-bottom filter drop-shadow-[0_20px_45px_rgba(0,0,0,0.9)] drop-shadow-[0_0_50px_rgba(228,0,17,0.15)] max-w-none"
                    referrerPolicy="no-referrer"
                    animate={{
                      opacity: isVideoSectionHovered ? 0 : 1,
                      y: isVideoSectionHovered ? 25 : 0,
                    }}
                    transition={{ duration: 0.55, ease: "easeInOut" }}
                  />

                  {/* Second image - Pointing */}
                  <motion.img
                    src="/man_pointing_1780219337213.png"
                    alt="Atlas Security Pointing"
                    className="absolute bottom-0 max-h-full w-auto object-contain object-bottom filter drop-shadow-[0_20px_45px_rgba(228,0,17,0.25)] drop-shadow-[0_0_60px_rgba(228,0,17,0.2)] max-w-none"
                    referrerPolicy="no-referrer"
                    animate={{
                      opacity: isVideoSectionHovered ? 1 : 0,
                      y: isVideoSectionHovered ? 0 : 25,
                    }}
                    transition={{ duration: 0.55, ease: "easeInOut" }}
                  />
                </div>
              </motion.div>
            </div>

            {/* RIGHT SIDE: Borderless infinite video loops running edge-to-edge from top-0 to bottom-0 */}
            <motion.div
              initial={{ opacity: 0, x: 120 }}
              animate={
                playHeroAnimation
                  ? {
                      opacity: 1,
                      x: 0,
                    }
                  : { opacity: 0, x: 120 }
              }
              transition={{
                duration: 1.5,
                delay: 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute right-0 top-0 bottom-0 flex items-center gap-4 overflow-hidden pointer-events-auto px-4 w-full md:w-[60%] lg:w-[56%] z-0"
              id="right-looping-canvas"
            >
              {/* COLUMN 1: Floats UP */}
              <div
                className="flex-1 h-screen overflow-hidden relative"
                onMouseEnter={() => {
                  setIsScrollPaused(true);
                }}
                onMouseLeave={() => setIsScrollPaused(false)}
              >
                <div
                  className="flex flex-col gap-4 animate-slide-up py-20 will-change-transform"
                  style={
                    {
                      animationDuration: "240s",
                      "--duration": "240s",
                      animationPlayState: isScrollPaused ? "paused" : "running",
                    } as React.CSSProperties
                  }
                >
                  {loopingColumn1.map((block, idx) => {
                    const identifier = `${block.id}-${idx}`;
                    const isHovered = hoveredBlock === identifier;

                    // Extract video numerical index to map to corresponding high-res poster (1.jpg to 8.jpg)
                    const match = block.videoUrl.match(/(\d+)\.mp4/);
                    const num = match ? parseInt(match[1]) : 1;
                    const posterIndex = ((num - 1) % 8) + 1;
                    const posterUrl = `https://raw.githubusercontent.com/mckhll-images/videos/main/${posterIndex}.jpg`;

                    return (
                      <div
                        key={identifier}
                        className={`relative w-full rounded-2xl border overflow-hidden bg-neutral-950 flex flex-col justify-end p-4 transition-all duration-500 pointer-events-none select-none ${block.aspect} border-white/5 shadow-lg shadow-black/40`}
                      >
                        {/* Direct video loop with no controls or UI */}
                        <div className="absolute inset-0 z-0 bg-neutral-900 overflow-hidden flex items-center justify-center">
                          <OptimizedVideo
                            src={block.videoUrl}
                            posterUrl={posterUrl}
                            className="absolute inset-0 w-full h-full object-cover opacity-65 transition-all duration-700 ease-out z-10"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* COLUMN 2: Floats DOWN */}
              <div
                className="flex-1 h-screen overflow-hidden relative"
                onMouseEnter={() => {
                  setIsScrollPaused(true);
                }}
                onMouseLeave={() => setIsScrollPaused(false)}
              >
                <div
                  className="flex flex-col gap-4 animate-slide-down py-20 will-change-transform"
                  style={
                    {
                      animationDuration: "280s",
                      "--duration": "280s",
                      animationPlayState: isScrollPaused ? "paused" : "running",
                    } as React.CSSProperties
                  }
                >
                  {loopingColumn2.map((block, idx) => {
                    const identifier = `${block.id}-${idx}`;

                    // Extract video numerical index to map to corresponding high-res poster (1.jpg to 8.jpg)
                    const match = block.videoUrl.match(/(\d+)\.mp4/);
                    const num = match ? parseInt(match[1]) : 1;
                    const posterIndex = ((num - 1) % 8) + 1;
                    const posterUrl = `https://raw.githubusercontent.com/mckhll-images/videos/main/${posterIndex}.jpg`;

                    return (
                      <div
                        key={identifier}
                        className={`relative w-full rounded-2xl border overflow-hidden bg-neutral-950 flex flex-col justify-end p-4 transition-all duration-500 pointer-events-none select-none ${block.aspect} border-white/5 shadow-lg shadow-black/40`}
                      >
                        {/* Direct video loop with no controls or UI */}
                        <div className="absolute inset-0 z-0 bg-neutral-900 overflow-hidden flex items-center justify-center">
                          <OptimizedVideo
                            src={block.videoUrl}
                            posterUrl={posterUrl}
                            className="absolute inset-0 w-full h-full object-cover opacity-65 transition-all duration-700 ease-out z-10"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* COLUMN 3: Removed from Hero and moved to a separate section */}
              <div className="hidden" id="instagram-news-column">
                {(() => {
                  const cityInstagramData: Record<
                    string,
                    { handle: string; url: string; name: string }
                  > = {
                    ALMATY: {
                      handle: "@fitnessblitz_almaty",
                      url: "https://www.instagram.com/fitnessblitz_almaty/",
                      name: "Алматы",
                    },
                    ASTANA: {
                      handle: "@fitnessblitz_astana",
                      url: "https://www.instagram.com/fitnessblitz_astana/",
                      name: "Астана",
                    },
                    SHYMKENT: {
                      handle: "@fitnessblitz_shymkent",
                      url: "https://www.instagram.com/fitnessblitz_shymkent/",
                      name: "Шымкент",
                    },
                    KOKSHETAU: {
                      handle: "@fitnessblitz_kokshetau",
                      url: "https://www.instagram.com/fitnessblitz_kokshetau/",
                      name: "Кокшетау",
                    },
                    KENTAU: {
                      handle: "@fitnessblitz_kentau",
                      url: "https://www.instagram.com/fitnessblitz_kentau/",
                      name: "Кентау",
                    },
                    TARAZ: {
                      handle: "@fitnessblitz_taraz",
                      url: "https://www.instagram.com/fitnessblitz_taraz/",
                      name: "Тараз",
                    },
                    KOSTANAY: {
                      handle: "@fitnessblitz_kostanay",
                      url: "https://www.instagram.com/fitnessblitz_kostanay/",
                      name: "Костанай",
                    },
                    KARAGANDA: {
                      handle: "@fitnessblitz_karaganda",
                      url: "https://www.instagram.com/fitnessblitz_karaganda/",
                      name: "Караганда",
                    },
                    SARAN: {
                      handle: "@fitnessblitz_saran",
                      url: "https://www.instagram.com/fitnessblitz_saran/",
                      name: "Сарань",
                    },
                    AKTAU: {
                      handle: "@fitnessblitz_aktau",
                      url: "https://www.instagram.com/fitnessblitz_aktau/",
                      name: "Актау",
                    },
                    AKTOBE: {
                      handle: "@fitnessblitz_aktobe",
                      url: "https://www.instagram.com/fitnessblitz_aktobe/",
                      name: "Актобе",
                    },
                  };

                  const activeCityIdForInsta =
                    selectedCityId || chosenCityId || "";
                  const localInsta = cityInstagramData[activeCityIdForInsta];

                  const generalNews = newsFeedList.filter(
                    (item) => item.isGeneral,
                  );
                  const localNews = newsFeedList.filter((item) => {
                    if (item.isGeneral) return false;
                    if (!activeCityIdForInsta) return true; // Show all local news if no city is explicitly selected
                    return item.cityId === activeCityIdForInsta;
                  });

                  // Combine both general and local feeds into a single continuous modern feed stream
                  const combinedNews = [...generalNews, ...localNews];

                  return (
                    <div className="flex flex-col gap-3 overflow-y-auto max-h-[75vh] h-[75vh] my-auto translate-y-[13px] py-1 px-2 pointer-events-auto scrollbar-none w-full max-w-full box-border">
                      {/* INSTAGRAM PROFILES ROW (SUPER COMPACT & CLEAN) */}
                      <div className="flex gap-2 w-full shrink-0">
                        {/* GENERAL INSTAGRAM PROFILE */}
                        <motion.a
                          href="https://www.instagram.com/fitnessblitz_official/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`relative rounded-xl border border-white/5 bg-neutral-900/40 hover:bg-neutral-900/60 flex items-center gap-2.5 p-3 group transition-all duration-300 cursor-pointer hover:border-[#e40011]/30 hover:shadow-[0_4px_16px_rgba(228,0,17,0.06)] ${
                            localInsta ? "w-1/2" : "w-full"
                          }`}
                          whileHover={{ scale: 1.01 }}
                          id="instagram-card-tile"
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#e40011] flex items-center justify-center shrink-0">
                            <Instagram className="w-4 h-4 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-[8px] font-sans text-[#e40011] block tracking-wider font-bold uppercase">
                              ГЛАВНЫЙ
                            </span>
                            <h3 className="text-[10px] sm:text-[11px] font-bold text-white tracking-wider uppercase font-sans truncate">
                              @fitnessblitz
                            </h3>
                          </div>
                        </motion.a>

                        {/* LOCAL INSTAGRAM PROFILE (CONDITIONAL) */}
                        {localInsta && (
                          <motion.a
                            href={localInsta.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative w-1/2 rounded-xl border border-white/5 bg-neutral-900/40 hover:bg-neutral-900/60 flex items-center gap-2.5 p-3 group transition-all duration-300 cursor-pointer hover:border-[#e40011]/30 hover:shadow-[0_4px_16px_rgba(228,0,17,0.06)]"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            whileHover={{ scale: 1.01 }}
                          >
                            <div className="w-8 h-8 rounded-lg bg-[#e40011]/10 border border-[#e40011]/20 flex items-center justify-center shrink-0">
                              <Instagram className="w-4 h-4 text-[#e40011]" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="text-[8px] font-sans text-white/50 block tracking-wider font-bold uppercase">
                                {localInsta.name}
                              </span>
                              <h3 className="text-[10px] sm:text-[11px] font-bold text-white tracking-wider uppercase font-sans truncate">
                                @fb_{localInsta.name.toLowerCase()}
                              </h3>
                            </div>
                          </motion.a>
                        )}
                      </div>

                      {/* ROW 1: GENERAL NEWS (ОБЩИЕ НОВОСТИ) */}
                      <div className="flex flex-col gap-1.5 flex-1 min-h-0">
                        <div className="flex items-center justify-between px-1 select-none shrink-0">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#e40011] animate-pulse" />
                            <span className="text-[10px] font-sans text-white tracking-wider uppercase font-bold">
                              Инфо-сеть
                            </span>
                          </div>
                          {/* Premium custom horizontal general scroll navigation */}
                          <div className="flex gap-1.5 items-center">
                            <span className="text-[8px] font-sans text-neutral-500 uppercase tracking-tight hidden sm:inline mr-1">
                              Перетащите или листайте
                            </span>
                            <button
                              onClick={() => scrollRow(1, "left")}
                              className="w-5.5 h-5.5 rounded-md bg-white/5 hover:bg-[#e40011] border border-white/10 text-white hover:text-white hover:border-[#e40011] hover:shadow-[0_0_10px_rgba(228,0,17,0.5)] flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer pointer-events-auto"
                              title="Назад"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => scrollRow(1, "right")}
                              className="w-5.5 h-5.5 rounded-md bg-white/5 hover:bg-[#e40011] border border-white/10 text-white hover:text-white hover:border-[#e40011] hover:shadow-[0_0_10px_rgba(228,0,17,0.5)] flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer pointer-events-auto"
                              title="Вперед"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <div
                          ref={newsRow1Ref}
                          className="flex gap-3 overflow-x-auto scrollbar-premium-horizontal py-1 px-1 w-full max-w-full pointer-events-auto select-none flex-1 min-h-0 pb-2.5"
                        >
                          {generalNews.map((item) => (
                            <div
                              key={item.id}
                              className="relative w-[31%] min-w-[190px] max-w-[330px] h-full shrink-0 bg-neutral-900/40 hover:bg-neutral-900/60 transition-all duration-300 rounded-xl border border-white/5 hover:border-[#e40011]/30 overflow-hidden flex flex-col group shadow-lg"
                            >
                              {/* Cinematic Image cover, almost square but shorter to fit vertical spaces beautifully */}
                              <div className="relative h-[53%] w-full overflow-hidden bg-neutral-950 shrink-0">
                                {item.imageUrl ? (
                                  <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-neutral-850 to-neutral-900 flex items-center justify-center">
                                    <span className="text-[10px] font-sans text-neutral-600">
                                      No Image
                                    </span>
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/30" />

                                {/* Integrated category badge & date overlay */}
                                <span className="absolute top-2 left-2 text-[8px] font-sans px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-black/70 backdrop-blur-sm border border-white/10 text-white/90">
                                  {item.tag}
                                </span>
                                <span className="absolute bottom-2 right-2 text-[8px] font-sans text-neutral-300 font-bold bg-neutral-950/70 backdrop-blur-sm px-1.5 py-0.5 rounded">
                                  {item.date}
                                </span>
                              </div>

                              {/* Clean Text Details & Description (Compact) */}
                              <div className="p-2 bg-neutral-900/10 flex flex-col gap-1 flex-1 min-h-0 justify-center">
                                <h4 className="text-[9.5px] sm:text-[10px] font-bold text-white tracking-tight leading-snug group-hover:text-[#e40011] transition-colors line-clamp-2 uppercase font-sans">
                                  {item.title}
                                </h4>
                                <p className="text-[8.5px] sm:text-[9px] text-neutral-400 font-normal leading-normal line-clamp-2 font-sans">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* ROW 2: LOCAL REGIONAL NEWS */}
                      <div className="flex flex-col gap-1.5 flex-1 min-h-0">
                        <div className="flex items-center justify-between px-1 select-none shrink-0">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#e40011] animate-pulse" />
                            <span className="text-[10px] font-sans text-white tracking-wider uppercase font-bold">
                              Регион {localInsta ? localInsta.name : ""}
                            </span>
                          </div>
                          {/* Premium custom horizontal regional scroll navigation */}
                          <div className="flex gap-1.5 items-center">
                            <span className="text-[8px] font-sans text-neutral-500 uppercase tracking-tight hidden sm:inline mr-1">
                              Перетащите или листайте
                            </span>
                            <button
                              onClick={() => scrollRow(2, "left")}
                              className="w-5.5 h-5.5 rounded-md bg-white/5 hover:bg-[#e40011] border border-white/10 text-white hover:text-white hover:border-[#e40011] hover:shadow-[0_0_10px_rgba(228,0,17,0.5)] flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer pointer-events-auto"
                              title="Назад"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => scrollRow(2, "right")}
                              className="w-5.5 h-5.5 rounded-md bg-white/5 hover:bg-[#e40011] border border-white/10 text-white hover:text-white hover:border-[#e40011] hover:shadow-[0_0_10px_rgba(228,0,17,0.5)] flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer pointer-events-auto"
                              title="Вперед"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <div
                          ref={newsRow2Ref}
                          className="flex gap-3 overflow-x-auto scrollbar-premium-horizontal py-1 px-1 w-full max-w-full pointer-events-auto select-none flex-1 min-h-0 pb-2.5"
                        >
                          {localNews.length > 0 ? (
                            localNews.map((item) => (
                              <div
                                key={item.id}
                                className="relative w-[31%] min-w-[190px] max-w-[330px] h-full shrink-0 bg-neutral-900/40 hover:bg-neutral-900/60 transition-all duration-300 rounded-xl border border-white/5 hover:border-[#e40011]/30 overflow-hidden flex flex-col group shadow-lg"
                              >
                                {/* Cinematic Image cover, almost square but shorter to fit vertical spaces beautifully */}
                                <div className="relative h-[53%] w-full overflow-hidden bg-neutral-950 shrink-0">
                                  {item.imageUrl ? (
                                    <img
                                      src={item.imageUrl}
                                      alt={item.title}
                                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                                      referrerPolicy="no-referrer"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-neutral-850 to-neutral-900 flex items-center justify-center">
                                      <span className="text-[10px] font-sans text-neutral-600">
                                        No Image
                                      </span>
                                    </div>
                                  )}
                                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/30" />

                                  {/* Integrated category badge & date overlay */}
                                  <span className="absolute top-2 left-2 text-[8px] font-sans px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-black/70 backdrop-blur-sm border border-white/10 text-white/90">
                                    {item.tag}
                                  </span>
                                  <span className="absolute bottom-2 right-2 text-[8px] font-sans text-neutral-300 font-bold bg-neutral-950/70 backdrop-blur-sm px-1.5 py-0.5 rounded">
                                    {item.date}
                                  </span>
                                </div>

                                {/* Clean Text Details & Description (Compact) */}
                                <div className="p-2 bg-neutral-900/10 flex flex-col gap-1 flex-1 min-h-0 justify-center">
                                  <h4 className="text-[9.5px] sm:text-[10px] font-bold text-white tracking-tight leading-snug group-hover:text-[#e40011] transition-colors line-clamp-2 uppercase font-sans">
                                    {item.title}
                                  </h4>
                                  <p className="text-[8.5px] sm:text-[9px] text-neutral-400 font-normal leading-normal line-clamp-2 font-sans">
                                    {item.description}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="flex flex-col items-center justify-center w-full h-full px-6 border border-dashed border-white/5 rounded-xl text-center bg-neutral-900/10">
                              <span className="text-[9px] text-neutral-500 font-sans uppercase tracking-wider font-bold">
                                Нет новостей для этой локации
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </div>

          {/* ================= SECTION 2: TRUST STATS BANNERS (COMPACT HORIZONTAL SPONSOR-STYLE TICKER) ================= */}
          <div
            id="stats-section"
            className="relative w-full py-3 bg-neutral-950/80 border-y border-white/5 overflow-hidden shrink-0"
          >
            <div className="relative w-full z-10 px-4 select-none">
              {/* Scroll-parallax Marquee Container */}
              <div className="relative w-full overflow-hidden py-1">
                {/* Fade masks left and right for absolute premium look */}
                <div className="absolute top-0 bottom-0 left-0 w-8 sm:w-24 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-10 pointer-events-none" />
                <div className="absolute top-0 bottom-0 right-0 w-8 sm:w-24 bg-gradient-to-l from-black/90 via-black/50 to-transparent z-10 pointer-events-none" />

                {/* Scrolling track driven entirely by scroll depth (moving left during scroll down) */}
                <div
                  className="flex gap-3 sm:gap-4 w-max will-change-transform"
                  style={{
                    transform: `translate3d(-${(scrollY * 0.3) % 1024}px, 0px, 0px)`,
                    transition: "transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)",
                  }}
                >
                  {[
                    { value: "4.9", label: "рейтинг" },
                    { value: "70+", label: "чемпионов" },
                    { value: "10к+", label: "постоянных" },
                    { value: "100+", label: "тренеров" },
                    { value: "16", label: "клубов" },
                    { value: "10", label: "городов" },
                    { value: "20+", label: "программ" },
                    { value: "16 лет", label: "опыта" },

                    { value: "4.9", label: "рейтинг" },
                    { value: "70+", label: "чемпионов" },
                    { value: "10к+", label: "постоянных" },
                    { value: "100+", label: "тренеров" },
                    { value: "16", label: "клубов" },
                    { value: "10", label: "городов" },
                    { value: "20+", label: "программ" },
                    { value: "16 лет", label: "опыта" },

                    { value: "4.9", label: "рейтинг" },
                    { value: "70+", label: "чемпионов" },
                    { value: "10к+", label: "постоянных" },
                    { value: "100+", label: "тренеров" },
                    { value: "16", label: "клубов" },
                    { value: "10", label: "городов" },
                    { value: "20+", label: "программ" },
                    { value: "16 лет", label: "опыта" },
                  ].map((stat, sIdx) => (
                    <div
                      key={`trust-marquee-stat-${stat.value}-${sIdx}`}
                      className="w-28 sm:w-36 h-14 sm:h-16 rounded-xl bg-[#0d0d10]/60 hover:bg-[#141419]/80 border border-white/[0.06] hover:border-[#ff0a21]/50 transition-all duration-300 relative group/card flex flex-col items-center justify-center block shrink-0 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(228,0,17,0.1)] hover:scale-[1.02] cursor-default"
                    >
                      {/* Big high-contrast value typography */}
                      <span className="text-sm sm:text-base font-black font-display text-white tracking-tight group-hover/card:text-[#ff1a2b] transition-all duration-300 filter group-hover/card:drop-shadow-[0_0_12px_rgba(228,0,17,0.3)]">
                        {stat.value}
                      </span>

                      {/* Short lowercase/uppercase premium tag line description */}
                      <span className="text-[7.5px] sm:text-[9px] font-sans font-black uppercase tracking-[0.12em] text-neutral-400 group-hover/card:text-white transition-colors duration-300 mt-0.5 whitespace-nowrap">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ================= SECTION 2: MAP OF KAZAKHSTAN ================= */}
          <div
            id="map-section"
            className="relative w-full min-h-screen flex flex-col justify-start bg-black pt-24 pb-16 px-4 sm:px-10 overflow-hidden shrink-0"
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
              {/* Split Screen Flex Layout and interactive glass workspace */}
              <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 min-h-screen w-full lg:items-center items-stretch overflow-visible pt-4 sm:pt-8 animate-fadeIn">
                {/* Foreground Glassmorphic Workspace Control Panel */}
                <motion.div
                  className={`bg-[#0c0c0f] border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col justify-between z-20 overflow-hidden transition-[width,min-width,max-width,height,flex] duration-[850ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${selectedCityId ? "h-fit w-full lg:w-[70%]" : "h-fit w-full lg:w-[32%]"}`}
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
                              В этой области расположено несколько наших
                              филиалов. Пожалуйста, укажите ваш город:
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
                            <p className="text-white/75 text-[11.5px] leading-relaxed max-w-[580px]">
                              От первого клуба в 2010 году до крупнейшей сети
                              фитнес-клубов страны сегодня. Тренируйтесь в любом
                              из 16 клубов FitnessBlitz — от Актау до Алматы.
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
                                  <span className="truncate">
                                    {selectedCity.name}
                                  </span>
                                  <span className="text-white/40 normal-case font-normal font-sans select-none text-[10px]">
                                    ({branches.length} залов)
                                  </span>
                                </div>
                              </div>

                              {/* Branches custom buttons container with visual layout */}
                              <div className="space-y-4">
                                <div className="text-white text-xs sm:text-sm font-sans font-black tracking-wide uppercase text-neutral-400 mb-1">
                                  Выберите филиал для просмотра информации:
                                </div>
                                <div className="grid grid-cols-1 gap-3.5 py-1 px-1 select-none">
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
                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:items-start items-start">
                                {/* Left Column (lg:col-span-6) - Image, Hours, Location */}
                                <div className="lg:col-span-6 flex flex-col gap-5">
                                  {/* Image Slider */}
                                  <div
                                    className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/10.5] rounded-2xl overflow-hidden bg-neutral-950 group border border-white/5"
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
                                  <div className="bg-white/[0.015] border border-white/5 rounded-xl p-3.5 space-y-3">
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
                                  <div className="bg-white/[0.015] border border-white/5 rounded-xl p-3.5">
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

                                {/* Right Column (lg:col-span-6) - Subscriptions Tiers and Reviews */}
                                <div className="lg:col-span-6 flex flex-col gap-5">
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
                                            desc: "1 полноценное персональное занятие с квалифицированным инструктором",
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

                                  {/* Equipment Quick Badge Container (Temporarily hidden) */}
                                  {false && (
                                    <div className="bg-white/[0.015] border border-white/5 rounded-xl p-4 space-y-3">
                                      <div>
                                        <div className="grid grid-cols-2 xs:grid-cols-3 gap-x-4 gap-y-3 text-[10.5px] text-white/75 font-sans">
                                          {[
                                            {
                                              label: "Тренажёрный зал",
                                              title: "Тренажёрный зал",
                                              desc: "Современные силовые тренажеры и блочные станции для тренировки всех групп мышц.",
                                              image:
                                                "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=300&q=80",
                                            },
                                            {
                                              label: "Кардиозона",
                                              title: "Кардиозона",
                                              desc: "Беговые дорожки, эллипсоиды и велотренажеры с датчиками пульса и мультимедиа.",
                                              image:
                                                "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=300&q=80",
                                            },
                                            {
                                              label: "Зона свободных весов",
                                              title: "Зона свободных весов",
                                              desc: "Тяжелоатлетические помосты, профессиональные грифы, гантельный ряд до 50 кг.",
                                              image:
                                                "https://images.unsplash.com/photo-1605296867304-46d5465a25f1?auto=format&fit=crop&w=300&q=80",
                                            },
                                            {
                                              label: "Зал бокса",
                                              title: "Зал бокса",
                                              desc: "Профессиональный ринг, боксерские груши разного веса для отработки ударов и выносливости.",
                                              image:
                                                "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=300&q=80",
                                            },
                                            {
                                              label: "Групповые программы",
                                              title: "Групповые программы",
                                              desc: "Йога, стретчинг, кроссфит и силовые тренировки под руководством сертифицированных инструкторов.",
                                              image:
                                                "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=300&q=80",
                                            },
                                            {
                                              label: "Душевые и раздевалки",
                                              title: "Душевые и раздевалки",
                                              desc: "Просторные индивидуальные шкафчики с электронным доступом, чистые душевые кабины и фены.",
                                              image:
                                                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80",
                                            },
                                            {
                                              label: "Сауна",
                                              title: "Сауна",
                                              desc: "Финская парная с оптимальным температурным режимом для быстрого восстановления после тренировки.",
                                              image:
                                                "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=300&q=80",
                                            },
                                            {
                                              label: "Персональные тренировки",
                                              title: "Персональное ведение",
                                              desc: "Личная программа тренировок, контроль техники, подбор питания и ведение до результата.",
                                              image:
                                                "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=300&q=80",
                                            },
                                            {
                                              label: "30 парковочных мест",
                                              title: "Удобная парковка",
                                              desc: "Бесплатный охраняемый паркинг для клиентов клуба на всё время тренировки.",
                                              image:
                                                "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=300&q=80",
                                            },
                                            {
                                              label: "Фитнес-бар",
                                              title: "Фитнес-бар",
                                              desc: "Белковые коктейли, предтренировочные комплексы, бодрящий кофе и полезные снеки.",
                                              image:
                                                "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=300&q=80",
                                            },
                                          ].map((item, idx) => (
                                            <div
                                              key={idx}
                                              className="flex min-w-0 py-0.5"
                                            >
                                              <div className="relative group/eq inline-flex items-center gap-1.5 max-w-full cursor-help">
                                                <span className="text-[#e40011] font-black text-sm select-none leading-none shrink-0 group-hover/eq:scale-125 transition-transform duration-200">
                                                  •
                                                </span>
                                                <span className="truncate border-b border-dashed border-white/10 group-hover/eq:border-[#e40011]/50 group-hover/eq:text-white transition-colors">
                                                  {item.label}
                                                </span>

                                                {/* Floating Premium Tooltip Card */}
                                                <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-64 bg-[#0d0d0f]/98 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.85)] opacity-0 pointer-events-none group-hover/eq:opacity-100 group-hover/eq:pointer-events-auto group-hover/eq:translate-y-0 translate-y-2 transition-all duration-300 z-[100] p-0 text-left">
                                                  <div className="relative w-full h-28 bg-neutral-900 border-b border-white/5">
                                                    <img
                                                      src={item.image}
                                                      alt={item.title}
                                                      className="w-full h-full object-cover"
                                                      referrerPolicy="no-referrer"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                                    <div className="absolute bottom-2.5 left-3">
                                                      <h5 className="text-[11px] font-black uppercase text-white tracking-wider font-sans leading-none">
                                                        {item.title}
                                                      </h5>
                                                    </div>
                                                  </div>
                                                  <div className="p-3">
                                                    <p className="text-[9.5px] text-neutral-300 normal-case font-normal leading-relaxed font-sans">
                                                      {item.desc}
                                                    </p>
                                                  </div>
                                                  {/* Dropdown Arrow Tip */}
                                                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white/10" />
                                                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-[#0d0d0f]" />
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}
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
                  className={`relative h-[42%] lg:h-[90%] flex items-center justify-center bg-transparent overflow-visible transition-[width,min-width,max-width,height,flex] duration-[850ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${selectedCityId ? "w-full lg:w-[30%]" : "w-full lg:w-[68%]"}`}
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

          {/* ================= SECTION 3: ENGINEERING CREW (3D CIRCULAR CAROUSEL) ================= */}
          <div
            id="coaches-section"
            className="relative w-full min-h-screen flex flex-col justify-between bg-black pt-28 pb-16 px-6 sm:px-10 overflow-hidden shrink-0"
          >
            {/* Grid ambient background helper */}
            <div className="absolute inset-0 z-0 opacity-5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3vw_3vw]" />
            </div>

            <div className="max-w-7xl mx-auto w-full flex flex-col justify-between z-10 relative">
              {/* Title / Description area */}
              <div className="text-center mt-2 mb-2">
                <h2 className="text-3xl sm:text-[2.4rem] font-black tracking-tight text-white uppercase font-display">
                  Команда <span className="text-[#e40011]">топ-тренеров</span>
                </h2>
                <p className="text-white/60 text-sm font-sans max-w-2xl mx-auto mt-3 font-normal leading-relaxed">
                  {coachesSubtitleText}
                </p>
              </div>

              {/* 3D Circular / Arc Coverflow Cards Area */}
              <div
                className="flex-1 w-full flex items-center justify-center relative overflow-hidden"
                id="crew-carousel-stage"
              >
                {/* Carousel Track with Perspective */}
                <div className="relative w-full max-w-4xl h-[465px] flex items-center justify-center">
                  {employeesList.map((emp, idx) => {
                    // Mathematical shortest difference on circular roster
                    const total = employeesList.length;
                    let diff = idx - activeCardIdx;
                    while (diff > total / 2) diff -= total;
                    while (diff <= -total / 2) diff += total;
                    const offset = diff;

                    const isActive = offset === 0;

                    // Dynamic 3D placement math
                    const rotateY = offset * -20;
                    const translateX = offset * 210;
                    const translateZ = Math.abs(offset) * -160;
                    const scale = Math.max(0.4, 1 - Math.abs(offset) * 0.12);
                    const opacity = Math.max(0, 1 - Math.abs(offset) * 0.28);
                    const zIndex = 100 - Math.abs(offset);

                    return (
                      <motion.div
                        key={emp.id}
                        onClick={() => setActiveCardIdx(idx)}
                        style={{
                          transform: `perspective(1000px) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                          opacity: opacity,
                          zIndex: zIndex,
                          transformStyle: "preserve-3d",
                        }}
                        className="absolute w-80 h-[430px] rounded-[32px] liquid-glass-card border border-white/5 overflow-hidden flex flex-col justify-between p-6 transition-all duration-700 ease-out cursor-pointer shadow-2xl select-none group"
                      >
                        {/* Inner 3D card layout */}
                        <div className="relative w-full h-full flex flex-col justify-between pointer-events-auto">
                          {/* Upper card part: Portrait background occupying the full card */}
                          <div className="absolute inset-[-24px] z-0 overflow-hidden rounded-[32px]">
                            {emp.image ? (
                              <img
                                src={emp.image}
                                alt={emp.name}
                                className="w-full h-full object-cover object-bottom opacity-100 transition-all duration-500 group-hover:scale-105"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div
                                className={`w-full h-full bg-gradient-to-b ${emp.gradient} opacity-[0.35] group-hover:opacity-[0.45] transition-opacity duration-500`}
                              />
                            )}
                            {/* Smooth vertical mask fading portrait into bottom solid container */}
                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
                          </div>

                          {/* Upper card actions / role tag in upper card right */}
                          <div className="relative z-10 w-full flex justify-between items-center">
                            <span className="text-[10px] bg-white/5 backdrop-blur-md text-white/90 font-sans px-3 py-1 rounded-full uppercase border border-white/5 tracking-wider font-bold">
                              {emp.place}
                            </span>
                          </div>

                          {/* Mid-to-bottom area: Employee details and status */}
                          <div className="relative z-10 w-full mt-auto text-left">
                            {/* Name & verification marker */}
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <h3 className="text-white text-2xl font-black tracking-tight uppercase transition-all">
                                {emp.name}
                              </h3>
                            </div>

                            {/* Role tag */}
                            <p className="text-[#e40011] font-sans text-[10px] uppercase font-black tracking-widest">
                              {emp.role}
                            </p>

                            {/* Footer with full-width action button */}
                            <div className="flex items-center justify-center mt-4">
                              {/* Instagram follow button */}
                              <a
                                href={`https://instagram.com/${emp.instagram}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="w-full py-3.5 rounded-full font-sans font-black uppercase text-[10.5px] tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] flex items-center justify-center gap-2 text-white bg-[#e40011] hover:bg-[#ff0c1f] hover:shadow-[0_0_20px_rgba(228,0,17,0.4)] shadow-md shadow-[#e40011]/20 cursor-pointer"
                              >
                                <Instagram className="w-4 h-4" />
                                <span>Instagram</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Controls / Indicators Bar */}
              <div className="flex items-center justify-center gap-6 mt-1 mb-2 z-20">
                <button
                  onClick={() => {
                    setActiveCardIdx(
                      (prev) =>
                        (prev - 1 + employeesList.length) %
                        employeesList.length,
                    );
                    setCoachSliderProgress(0);
                  }}
                  className="w-11 h-11 rounded-full bg-black/60 hover:bg-[#e40011] border border-white/5 flex items-center justify-center transition-all text-white active:scale-90 font-mono cursor-pointer shadow-lg"
                >
                  ←
                </button>

                {/* Premium story-style progress lines representing each coach card */}
                <div className="flex-1 max-w-[280px] sm:max-w-md flex items-center gap-1.5 py-1 px-2 select-none">
                  {employeesList.map((_, idx) => {
                    const isActive = activeCardIdx === idx;
                    const isCompleted = idx < activeCardIdx;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setActiveCardIdx(idx);
                          setCoachSliderProgress(0);
                        }}
                        className="flex-1 h-1.5 rounded-full bg-white/20 hover:bg-white/30 overflow-hidden relative cursor-pointer outline-none transition-all duration-300"
                        title={`Тренер ${idx + 1}`}
                      >
                        <div
                          className="absolute inset-y-0 left-0 bg-[#e40011] rounded-full transition-all ease-linear"
                          style={{
                            width: isActive
                              ? `${coachSliderProgress}%`
                              : isCompleted
                                ? "100%"
                                : "0%",
                            transitionDuration: isActive ? "20ms" : "0ms",
                          }}
                        />
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => {
                    setActiveCardIdx(
                      (prev) => (prev + 1) % employeesList.length,
                    );
                    setCoachSliderProgress(0);
                  }}
                  className="w-11 h-11 rounded-full bg-black/60 hover:bg-[#e40011] border border-white/5 flex items-center justify-center transition-all text-white active:scale-90 font-mono cursor-pointer shadow-lg"
                >
                  →
                </button>
              </div>
            </div>
          </div>

          {/* ================= SECTION: NEWS & SOCIAL MEDIA ================= */}
          <div
            id="news-section"
            className="relative w-full min-h-screen flex flex-col justify-center bg-[#000000] pt-28 pb-20 px-6 sm:px-10 overflow-hidden shrink-0"
          >
            {/* Clean minimalist design: no glowing ambient filters */}

            <div className="max-w-7xl mx-auto w-full z-10 flex flex-col gap-10">
              {/* Elegant Section Title */}
              <div className="pb-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-white font-display">
                  НОВОСТИ И <span className="text-[#e40011]">СОЦСЕТИ</span>
                </h2>
              </div>

              {/* Media feeds layout stream */}
              {(() => {
                const cityInstagramData: Record<
                  string,
                  { handle: string; url: string; name: string }
                > = {
                  ALMATY: {
                    handle: "@fitnessblitz_almaty",
                    url: "https://www.instagram.com/fitnessblitz_almaty/",
                    name: "Алматы",
                  },
                  ASTANA: {
                    handle: "@fitnessblitz_astana",
                    url: "https://www.instagram.com/fitnessblitz_astana/",
                    name: "Астана",
                  },
                  SHYMKENT: {
                    handle: "@fitnessblitz_shymkent",
                    url: "https://www.instagram.com/fitnessblitz_shymkent/",
                    name: "Шымкент",
                  },
                  KOKSHETAU: {
                    handle: "@fitnessblitz_kokshetau",
                    url: "https://www.instagram.com/fitnessblitz_kokshetau/",
                    name: "Кокшетау",
                  },
                  KENTAU: {
                    handle: "@fitnessblitz_kentau",
                    url: "https://www.instagram.com/fitnessblitz_kentau/",
                    name: "Кентау",
                  },
                  TARAZ: {
                    handle: "@fitnessblitz_taraz",
                    url: "https://www.instagram.com/fitnessblitz_taraz/",
                    name: "Тараз",
                  },
                  KOSTANAY: {
                    handle: "@fitnessblitz_kostanay",
                    url: "https://www.instagram.com/fitnessblitz_kostanay/",
                    name: "Костанай",
                  },
                  KARAGANDA: {
                    handle: "@fitnessblitz_karaganda",
                    url: "https://www.instagram.com/fitnessblitz_karaganda/",
                    name: "Караганда",
                  },
                  SARAN: {
                    handle: "@fitnessblitz_saran",
                    url: "https://www.instagram.com/fitnessblitz_saran/",
                    name: "Сарань",
                  },
                  AKTAU: {
                    handle: "@fitnessblitz_aktau",
                    url: "https://www.instagram.com/fitnessblitz_aktau/",
                    name: "Актау",
                  },
                  AKTOBE: {
                    handle: "@fitnessblitz_aktobe",
                    url: "https://www.instagram.com/fitnessblitz_aktobe/",
                    name: "Актобе",
                  },
                };

                const activeCityIdForNews = chosenCityId || "";
                const localInsta = cityInstagramData[activeCityIdForNews];

                const generalNews = newsFeedList.filter(
                  (item) => item.isGeneral,
                );
                const localNews = newsFeedList.filter((item) => {
                  if (item.isGeneral) return false;
                  if (!activeCityIdForNews) return true; // Show all local news if no city is chosen
                  return item.cityId === activeCityIdForNews;
                });

                return (
                  <div className="grid grid-cols-1 lg:grid-cols-10 gap-10 items-start w-full animate-fade-in">
                    {/* APP DOWNLOAD BOX & IMAGE COLUMN (30%) */}
                    <div className="lg:col-span-3 lg:sticky lg:top-28 self-stretch flex flex-col gap-6 w-full">
                      {/* APP DOWNLOAD BOX */}
                      <div className="w-full bg-neutral-900/30 border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:border-[#e40011]/30 transition-all duration-300 relative overflow-hidden group shadow-2xl">
                        {/* Background gradient light */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#e40011]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#e40011]/15 transition-all duration-500" />

                        <div className="relative z-10 text-left">
                          <span className="text-[10px] font-sans text-[#e40011] tracking-widest font-black uppercase block mb-3">
                            МОБИЛЬНОЕ ПРИЛОЖЕНИЕ
                          </span>
                          <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-display mb-4 leading-tight">
                            Вход в зал только по нему
                          </h3>
                          <p className="text-white/60 text-xs sm:text-sm leading-relaxed mb-6">
                            Установите официальное приложение FitnessBlitz на
                            ваш смартфон для бесконтактного входа в клуб,
                            управления абонементом, записи на тренировки и
                            отслеживания активности.
                          </p>
                        </div>

                        {/* Buttons area */}
                        <div className="flex flex-col gap-3.5 w-full mb-6 relative z-10">
                          {/* App Store button */}
                          <motion.a
                            href="https://apps.apple.com/kz/app/fitnessblitz/id1270095364#information"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center gap-3.5 bg-black hover:bg-[#e40011] border border-white/10 rounded-2xl p-4 transition-all duration-300 group/btn hover:border-[#e40011] active:scale-[0.98] select-none text-left"
                            whileHover={{ y: -2 }}
                            id="download-app-ios"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              className="w-[22px] h-[22px] text-white fill-current shrink-0"
                            >
                              <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
                            </svg>
                            <div>
                              <span className="text-[9px] block text-white/50 uppercase tracking-widest font-bold leading-none mb-1">
                                Загрузите в
                              </span>
                              <span className="text-xs sm:text-sm font-black text-white block uppercase tracking-wide leading-none font-sans">
                                App Store
                              </span>
                            </div>
                          </motion.a>

                          {/* Google Play button */}
                          <motion.a
                            href="https://play.google.com/store/apps/details?id=com.softlab.fitnessblitz&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnGVZAHIokf7D-M3XudYf4zT4nHJ4C7u_EDSS_BPugsSP4JwZqziPAZJdpYVg_aem_YWdncwCan48YO0HzCv1uxLYGAVfT&brid=YWdncwEP569-PX3WDHJCsdq-DNDl"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center gap-3.5 bg-black hover:bg-[#e40011] border border-white/10 rounded-2xl p-4 transition-all duration-300 group/btn hover:border-[#e40011] active:scale-[0.98] select-none text-left"
                            whileHover={{ y: -2 }}
                            id="download-app-android"
                          >
                            <svg
                              viewBox="0 0 32 32"
                              className="w-[22px] h-[22px] text-white fill-current shrink-0"
                            >
                              <path d="M20.331 14.644l-13.794-13.831 17.55 10.075zM2.938 0c-0.813 0.425-1.356 1.2-1.356 2.206v27.581c0 1.006 0.544 1.781 1.356 2.206l16.038-16zM29.512 14.1l-3.681-2.131-4.106 4.031 4.106 4.031 3.756-2.131c1.125-0.893 1.125-2.906-0.075-3.8zM6.538 31.188l17.55-10.075-3.756-3.756z" />
                            </svg>
                            <div>
                              <span className="text-[9px] block text-white/50 uppercase tracking-widest font-bold leading-none mb-1">
                                Доступно в
                              </span>
                              <span className="text-xs sm:text-sm font-black text-white block uppercase tracking-wide leading-none font-sans">
                                Google Play
                              </span>
                            </div>
                          </motion.a>
                        </div>
                      </div>
                    </div>

                    {/* NEWS & SOCIALS COLUMN (70%) */}
                    <div className="lg:col-span-7 flex flex-col gap-10 w-full min-w-0">
                      {/* INSTAGRAM LINK CARD ROW */}
                      <div className="flex flex-col sm:flex-row gap-4 w-full">
                        {/* GENERAL INSTAGRAM LINK CARD */}
                        <motion.a
                          href="https://www.instagram.com/fitnessblitz_official/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative rounded-2xl border border-white/5 bg-neutral-900/20 hover:bg-[#e40011]/5 flex-1 flex items-center justify-between p-5 group transition-all duration-300 cursor-pointer hover:border-[#e40011]/30 hover:shadow-[0_8px_32px_rgba(228,0,17,0.05)]"
                          whileHover={{ y: -2 }}
                          id="news-standalone-instagram-card-general"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-12 h-12 rounded-xl bg-[#e40011] flex items-center justify-center shrink-0 shadow-lg shadow-[#e40011]/25">
                              <Instagram className="w-5 h-5 text-white" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-[10px] font-sans text-[#e40011] block tracking-wider font-extrabold uppercase mb-0.5">
                                ГЛАВНЫЙ АККАУНТ СЕТИ
                              </span>
                              <h3 className="text-xs sm:text-sm font-black text-white tracking-widest uppercase font-display truncate">
                                @fitnessblitz_official
                              </h3>
                            </div>
                          </div>
                        </motion.a>

                        {/* LOCAL INSTAGRAM LINK CARD */}
                        {localInsta ? (
                          <motion.a
                            href={localInsta.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative rounded-2xl border border-white/5 bg-neutral-900/20 hover:bg-[#e40011]/5 flex-1 flex items-center justify-between p-5 group transition-all duration-300 cursor-pointer hover:border-[#e40011]/30 hover:shadow-[0_8px_32px_rgba(228,0,17,0.05)]"
                            whileHover={{ y: -2 }}
                            id="news-standalone-instagram-card-local"
                          >
                            <div className="flex items-center gap-4 min-w-0">
                              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#e40011]/30 transition-all">
                                <Instagram className="w-5 h-5 text-[#e40011]" />
                              </div>
                              <div className="min-w-0">
                                <span className="text-[10px] font-sans text-white/50 block tracking-wider font-extrabold uppercase mb-0.5">
                                  ФИЛИАЛ {localInsta.name.toUpperCase()}
                                </span>
                                <h3 className="text-xs sm:text-sm font-black text-white tracking-widest uppercase font-display truncate">
                                  {localInsta.handle}
                                </h3>
                              </div>
                            </div>
                          </motion.a>
                        ) : (
                          <div className="rounded-2xl border border-dashed border-white/10 bg-neutral-900/10 flex-1 flex items-center justify-center p-5 text-center select-none">
                            <span className="text-[10px] font-sans text-neutral-500 uppercase tracking-widest font-bold">
                              Выберите город на карте для просмотра региональных
                              разделов
                            </span>
                          </div>
                        )}
                      </div>

                      {/* SECTION ROW 1: NETWORK GENERAL NEWS */}
                      <div className="flex flex-col gap-4 w-full">
                        <div className="flex items-center justify-between px-1 select-none shrink-0">
                          <div className="flex items-center gap-2.5">
                            <span className="text-xs sm:text-sm font-sans text-white tracking-widest uppercase font-black">
                              СЕТЕВЫЕ НОВОСТИ FITNESSBLITZ
                            </span>
                          </div>
                          <div className="flex gap-2 items-center">
                            <span className="text-[9px] font-sans text-neutral-500 uppercase tracking-widest font-bold hidden md:inline mr-2">
                              МОЖНО ЛИСТАТЬ СВАЙПОМ
                            </span>
                            <button
                              onClick={() => scrollRow(1, "left", true)}
                              className="w-9 h-9 rounded-xl bg-neutral-900/60 hover:bg-[#e40011] border border-white/5 text-white hover:text-white hover:border-[#e40011] hover:shadow-[0_0_15px_rgba(228,0,17,0.45)] flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer"
                              title="Назад"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => scrollRow(1, "right", true)}
                              className="w-9 h-9 rounded-xl bg-neutral-900/60 hover:bg-[#e40011] border border-white/5 text-white hover:text-white hover:border-[#e40011] hover:shadow-[0_0_15px_rgba(228,0,17,0.45)] flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer"
                              title="Вперед"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        <div
                          ref={newsRowStandAlone1Ref}
                          className="flex gap-5 overflow-x-auto scrollbar-premium-horizontal py-3 px-1 w-full max-w-full select-none cursor-grab active:cursor-grabbing"
                        >
                          {generalNews.map((item) => (
                            <div
                              key={item.id}
                              className="relative w-[85%] sm:w-[46%] md:w-[31%] min-w-[310px] max-w-[380px] h-[370px] shrink-0 bg-neutral-950/70 hover:bg-neutral-900/75 transition-all duration-300 rounded-3xl border border-white/5 hover:border-[#e40011]/35 overflow-hidden flex flex-col group shadow-2xl"
                            >
                              <div className="relative h-[58%] w-full overflow-hidden bg-neutral-950 shrink-0">
                                {item.imageUrl ? (
                                  <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-neutral-850 to-neutral-900 flex items-center justify-center">
                                    <span className="text-xs text-neutral-600">
                                      Нет изображения
                                    </span>
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/30" />
                                <span className="absolute top-4 left-4 text-[9px] font-sans px-3 py-1.5 rounded-lg font-black uppercase tracking-widest bg-black/80 backdrop-blur-sm border border-white/10 text-white">
                                  {item.tag}
                                </span>
                                <span className="absolute bottom-4 right-4 text-[9px] font-sans text-neutral-300 font-extrabold bg-neutral-950/80 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                                  {item.date}
                                </span>
                              </div>
                              <div className="p-5 bg-neutral-900/10 flex flex-col gap-2.5 flex-1 min-h-0 justify-center text-left">
                                <h4 className="text-sm font-black text-white tracking-wide leading-snug group-hover:text-[#e40011] transition-colors line-clamp-2 uppercase font-sans">
                                  {item.title}
                                </h4>
                                <p className="text-xs text-neutral-400 font-normal leading-relaxed line-clamp-3 font-sans">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* SECTION ROW 2: LOCAL REGIONAL NEWS */}
                      <div className="flex flex-col gap-4 w-full">
                        <div className="flex items-center justify-between px-1 select-none shrink-0">
                          <div className="flex items-center gap-2.5">
                            <span className="text-xs sm:text-sm font-sans text-white tracking-widest uppercase font-black">
                              РЕГИОНАЛЬНЫЕ НОВОСТИ{" "}
                              {localInsta
                                ? `(${localInsta.name.toUpperCase()})`
                                : "СЕТИ"}
                            </span>
                          </div>
                          <div className="flex gap-2 items-center">
                            <button
                              onClick={() => scrollRow(2, "left", true)}
                              className="w-9 h-9 rounded-xl bg-neutral-900/60 hover:bg-[#e40011] border border-white/5 text-white hover:text-white hover:border-[#e40011] hover:shadow-[0_0_15px_rgba(228,0,17,0.45)] flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer"
                              title="Назад"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => scrollRow(2, "right", true)}
                              className="w-9 h-9 rounded-xl bg-neutral-900/60 hover:bg-[#e40011] border border-white/5 text-white hover:text-white hover:border-[#e40011] hover:shadow-[0_0_15px_rgba(228,0,17,0.45)] flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer"
                              title="Вперед"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        <div
                          ref={newsRowStandAlone2Ref}
                          className="flex gap-5 overflow-x-auto scrollbar-premium-horizontal py-3 px-1 w-full max-w-full select-none cursor-grab active:cursor-grabbing"
                        >
                          {localNews.length > 0 ? (
                            localNews.map((item) => (
                              <div
                                key={item.id}
                                className="relative w-[85%] sm:w-[46%] md:w-[31%] min-w-[310px] max-w-[380px] h-[370px] shrink-0 bg-neutral-950/70 hover:bg-neutral-900/75 transition-all duration-300 rounded-3xl border border-white/5 hover:border-[#e40011]/35 overflow-hidden flex flex-col group shadow-2xl"
                              >
                                <div className="relative h-[58%] w-full overflow-hidden bg-neutral-950 shrink-0">
                                  {item.imageUrl ? (
                                    <img
                                      src={item.imageUrl}
                                      alt={item.title}
                                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                                      referrerPolicy="no-referrer"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-neutral-850 to-neutral-900 flex items-center justify-center">
                                      <span className="text-xs text-neutral-600">
                                        Нет изображения
                                      </span>
                                    </div>
                                  )}
                                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/30" />
                                  <span className="absolute top-4 left-4 text-[9px] font-sans px-3 py-1.5 rounded-lg font-black uppercase tracking-widest bg-black/80 backdrop-blur-sm border border-white/10 text-white">
                                    {item.tag}
                                  </span>
                                  <span className="absolute bottom-4 right-4 text-[9px] font-sans text-neutral-300 font-extrabold bg-neutral-950/80 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                                    {item.date}
                                  </span>
                                </div>
                                <div className="p-5 bg-neutral-900/10 flex flex-col gap-2.5 flex-1 min-h-0 justify-center text-left">
                                  <h4 className="text-sm font-black text-white tracking-wide leading-snug group-hover:text-[#e40011] transition-colors line-clamp-2 uppercase font-sans">
                                    {item.title}
                                  </h4>
                                  <p className="text-xs text-neutral-400 font-normal leading-relaxed line-clamp-3 font-sans">
                                    {item.description}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="flex flex-col items-center justify-center w-full min-h-[250px] py-14 px-6 border border-dashed border-white/10 rounded-2xl text-center bg-white/[0.01]">
                              <span className="text-xs font-sans text-neutral-500 uppercase tracking-widest font-black mb-1">
                                Нет точечных объявлений
                              </span>
                              <span className="text-[10.5px] text-neutral-500 font-sans leading-relaxed max-w-md">
                                Для данного населенного пункта в настоящее время
                                нет персональных локальных объявлений. Смотрите
                                общие события сети.
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* ================= SECTION: HOMEPAGE FAQ ================= */}
          <div
            id="faq-preview-section"
            className="relative w-full bg-[#000000] py-24 px-6 sm:px-10 overflow-hidden shrink-0"
          >
            {/* Clean minimalist design: no glowing ambient filters */}

            <div className="max-w-4xl mx-auto w-full relative z-10 text-center">
              {/* Elegant Section Title - Rules of the Club */}
              <div className="pb-6 mb-14 text-left max-w-3xl mx-auto">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-white font-display">
                  Правила <span className="text-[#e40011]">клуба</span>
                </h2>
              </div>

              <div className="flex flex-col gap-4 text-left max-w-3xl mx-auto">
                {homepageFeaturedFAQ.map((faq, idx) => {
                  const isOpen = activeFeaturedFaqIdx === idx;
                  return (
                    <div
                      key={idx}
                      className={`rounded-2xl p-5 sm:p-6 transition-all duration-300 cursor-pointer bg-[#0c0c0f] border ${
                        isOpen
                          ? "border-[#e40011] bg-[#101014]"
                          : "border-white/[0.05] hover:border-white/10"
                      }`}
                      onClick={() =>
                        setActiveFeaturedFaqIdx(isOpen ? null : idx)
                      }
                    >
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="text-sm sm:text-base font-bold text-white font-sans tracking-wide">
                          {faq.question}
                        </h3>
                        <button className="flex items-center justify-center w-7 h-7 rounded-full bg-white/5 text-white/50 group-hover:text-white transition-all duration-300 shrink-0 select-none">
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180 text-white" : ""}`}
                          />
                        </button>
                      </div>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                            animate={{
                              height: "auto",
                              opacity: 1,
                              marginTop: 16,
                            }}
                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans font-normal border-t border-white/5 pt-4 whitespace-pre-line">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              <div className="mt-12 flex justify-center">
                <button
                  onClick={() => {
                    setActivePage("faq");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="group inline-flex items-center gap-2.5 bg-neutral-900 hover:bg-neutral-900/70 border border-white/10 hover:border-[#e40011]/30 text-white text-[11px] font-extrabold uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <span>Читать правила и регламент</span>
                  <ArrowRight className="w-4 h-4 text-[#e40011] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* ================= SECTION 4: LEAVE REQUEST (PHONE FORM / WHATSAPP PRE-FILL) ================= */}
          <div
            id="request-section"
            className="relative w-full min-h-screen flex flex-col justify-center bg-neutral-950 pt-28 pb-20 px-6 sm:px-10 overflow-hidden shrink-0"
          >
            {/* Grid ambient background helper */}
            <div className="absolute inset-0 z-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(228,0,17,0.15)_1px,transparent_1px)] bg-[size:3vw_3vw]" />
            </div>

            <div className="max-w-4xl mx-auto w-full z-10 relative">
              {/* Title / Description area */}
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-white font-display">
                  Начните{" "}
                  <span className="text-[#e40011] filter drop-shadow-[0_4px_12px_rgba(228,0,17,0.15)]">
                    тренировки
                  </span>{" "}
                  сегодня
                </h2>
              </div>

              {/* Custom Tab Segment Switcher */}
              <div className="flex justify-center mb-10 w-full max-w-md mx-auto">
                <div className="flex bg-neutral-900/50 border border-white/5 rounded-full p-1.5 w-full relative">
                  <button
                    type="button"
                    onClick={() => setRequestTab("phone")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-[10px] sm:text-xs font-sans uppercase tracking-widest font-extrabold transition-all duration-300 cursor-pointer ${
                      requestTab === "phone"
                        ? "bg-[#e40011] text-white shadow-[0_4px_16px_rgba(228,0,17,0.35)] scale-[1.02]"
                        : "text-white/50 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>По телефону</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRequestTab("whatsapp")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-[10px] sm:text-xs font-sans uppercase tracking-widest font-extrabold transition-all duration-300 cursor-pointer ${
                      requestTab === "whatsapp"
                        ? "bg-[#e40011] text-white shadow-[0_4px_16px_rgba(228,0,17,0.35)] scale-[1.02]"
                        : "text-white/50 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>По WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Form Panels with clean AnimatePresence container */}
              <div className="max-w-2xl mx-auto w-full">
                <AnimatePresence mode="wait">
                  {requestTab === "phone" ? (
                    <motion.div
                      key="phone-panel"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="relative bg-neutral-900/30 border border-white/5 rounded-[32px] p-6 sm:p-10 backdrop-blur-3xl shadow-xl shadow-black/40"
                    >
                      {!leadFormSubmitted ? (
                        <form
                          onSubmit={handleSubmitLeadForm}
                          className="flex flex-col gap-5"
                        >
                          {/* Name Input */}
                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-sans text-neutral-400 font-bold uppercase tracking-wider">
                              Ваше имя
                            </label>
                            <div className="relative flex items-center">
                              <User className="absolute left-4 w-4 h-4 text-white/30" />
                              <input
                                type="text"
                                required
                                placeholder="Иван Иванов"
                                value={leadName}
                                onChange={(e) => setLeadName(e.target.value)}
                                className="w-full bg-[#0d0d10]/90 border border-white/10 focus:border-[#ff0a21] focus:ring-1 focus:ring-[#ff0a21]/35 rounded-xl py-3.5 pl-11 pr-4 text-sm font-sans text-white placeholder-white/20 focus:outline-none transition-all focus:shadow-[0_0_15px_rgba(228,0,17,0.1)]"
                              />
                            </div>
                          </div>

                          {/* Flex Row name & phone */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Phone Input */}
                            <div className="flex flex-col gap-2">
                              <label className="text-[10px] font-sans text-neutral-400 font-bold uppercase tracking-wider">
                                Номер телефона
                              </label>
                              <div className="relative flex items-center">
                                <Phone className="absolute left-4 w-4 h-4 text-white/30" />
                                <input
                                  type="tel"
                                  required
                                  placeholder="+7 (707) 123-4567"
                                  value={leadPhone}
                                  onChange={(e) => setLeadPhone(e.target.value)}
                                  className="w-full bg-[#0d0d10]/90 border border-white/10 focus:border-[#ff0a21] focus:ring-1 focus:ring-[#ff0a21]/35 rounded-xl py-3.5 pl-11 pr-4 text-sm font-sans text-white placeholder-white/20 focus:outline-none transition-all focus:shadow-[0_0_15px_rgba(228,0,17,0.1)]"
                                />
                              </div>
                            </div>

                            {/* Email Input */}
                            <div className="flex flex-col gap-2">
                              <label className="text-[10px] font-sans text-neutral-400 font-bold uppercase tracking-wider">
                                Электронная почта
                              </label>
                              <div className="relative flex items-center">
                                <Mail className="absolute left-4 w-4 h-4 text-white/30" />
                                <input
                                  type="email"
                                  required
                                  placeholder="ivan@example.com"
                                  value={leadEmail}
                                  onChange={(e) => setLeadEmail(e.target.value)}
                                  className="w-full bg-[#0d0d10]/90 border border-white/10 focus:border-[#ff0a21] focus:ring-1 focus:ring-[#ff0a21]/35 rounded-xl py-3.5 pl-11 pr-4 text-sm font-sans text-white placeholder-white/20 focus:outline-none transition-all focus:shadow-[0_0_15px_rgba(228,0,17,0.1)]"
                                />
                              </div>
                            </div>
                          </div>

                          {/* City Select */}
                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-sans text-neutral-400 font-bold uppercase tracking-wider">
                              Выберите ваш город залов
                            </label>
                            <div className="relative">
                              <select
                                value={leadCityId}
                                onChange={(e) => setLeadCityId(e.target.value)}
                                className="w-full bg-[#0d0d10]/90 border border-white/10 focus:border-[#ff0a21] focus:ring-1 focus:ring-[#ff0a21]/35 rounded-xl py-3.5 px-4 text-sm font-sans text-white focus:outline-none transition-all appearance-none cursor-pointer focus:shadow-[0_0_15px_rgba(228,0,17,0.1)]"
                              >
                                {citiesList.map((city) => (
                                  <option
                                    key={city.id}
                                    value={city.id}
                                    className="bg-neutral-900 text-white"
                                  >
                                    {city.name}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                            </div>
                          </div>

                          {/* Processing Consent with real 152-FZ Russian citation link as requested */}
                          <label className="flex items-start gap-3 mt-2 group cursor-pointer">
                            <input
                              type="checkbox"
                              required
                              checked={leadConsent}
                              onChange={(e) => setLeadConsent(e.target.checked)}
                              className="mt-1 w-4 h-4 rounded border-white/15 bg-black/50 border text-[#ff0a21] focus:ring-[#ff0a21]/20 transition-all accent-[#ff0a21] cursor-pointer"
                            />
                            <span className="text-[10px] sm:text-[10.5px] text-white/50 font-sans leading-normal font-normal group-hover:text-white/70 transition-colors">
                              Нажимая кнопку «Отправить», я даю свое согласие на
                              обработку моих персональных данных, в соответствии
                              с Федеральным законом от 27.07.2006 года №152-ФЗ
                              «О персональных данных», на условиях и для целей,
                              определенных в Согласии на обработку персональных
                              данных *
                            </span>
                          </label>

                          {/* Submit Button */}
                          <button
                            type="submit"
                            disabled={!leadConsent}
                            className={`w-full h-12 flex items-center justify-center gap-2.5 mt-2 rounded-full font-sans font-extrabold uppercase text-[10.5px] tracking-widest transition-colors duration-200 ${
                              leadConsent
                                ? "bg-[#e40011] hover:bg-[#b5000d] text-white cursor-pointer"
                                : "bg-neutral-800 text-white/35 border border-white/5 cursor-not-allowed"
                            }`}
                          >
                            <Send className="w-4 h-4" />
                            <span>Отправить заявку</span>
                          </button>
                        </form>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-center py-10 flex flex-col items-center justify-center gap-4"
                        >
                          <div className="w-16 h-16 rounded-full bg-[#e40011]/20 border border-[#e40011]/40 flex items-center justify-center mb-2 animate-pulse">
                            <Check className="w-8 h-8 text-[#e40011]" />
                          </div>
                          <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight font-sans text-white">
                            Заявка отправлена!
                          </h3>
                          <p className="text-neutral-400 text-sm font-sans max-w-sm mx-auto leading-relaxed">
                            Спасибо,{" "}
                            <span className="text-white font-bold">
                              {leadName}
                            </span>
                            ! Мы свяжемся с вами по номеру{" "}
                            <span className="text-white font-bold">
                              {leadPhone}
                            </span>{" "}
                            в ближайшее время.
                          </p>
                          <button
                            onClick={() => {
                              setLeadFormSubmitted(false);
                              setLeadName("");
                              setLeadPhone("");
                              setLeadEmail("");
                            }}
                            className="mt-4 px-6 py-2.5 rounded-full border border-white/10 text-[9px] font-bold uppercase tracking-widest text-[#e40011] hover:bg-neutral-800 transition-all active:scale-95 cursor-pointer"
                          >
                            Отправить еще одну заявку
                          </button>
                        </motion.div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="wa-panel"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="relative bg-neutral-900/30 border border-white/5 rounded-[32px] p-6 sm:p-10 backdrop-blur-3xl shadow-xl shadow-black/40"
                    >
                      <div className="flex flex-col gap-6">
                        {/* WA City Dropdown Selection */}
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-sans text-neutral-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#e40011]" />
                            <span>
                              Выберите ваш город (влияет на номер консультанта)
                            </span>
                          </label>
                          <div className="relative">
                            <select
                              value={waCityId}
                              onChange={(e) => setWaCityId(e.target.value)}
                              className="w-full bg-black/40 border border-white/5 focus:border-[#ff0a21] focus:ring-1 focus:ring-[#ff0a21]/35 rounded-xl py-3.5 px-4 text-sm font-sans text-white focus:outline-none transition-all appearance-none cursor-pointer"
                            >
                              {citiesList.map((city) => (
                                <option
                                  key={city.id}
                                  value={city.id}
                                  className="bg-neutral-900 text-white"
                                >
                                  {city.name}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                          </div>
                        </div>

                        {/* WA Training Time selection */}
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-sans text-neutral-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#e40011]" />
                            <span>В какое время вам удобнее заниматься?</span>
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {[
                              "Утренняя смена (до 12:00)",
                              "Дневная смена (12:00 - 17:00)",
                              "Вечерняя смена (после 17:00)",
                              "Без ограничений / Безлимит",
                            ].map((timeOption) => {
                              const isSelected = waPreferredTime === timeOption;
                              return (
                                <button
                                  key={timeOption}
                                  type="button"
                                  onClick={() => setWaPreferredTime(timeOption)}
                                  className={`py-3 px-4 rounded-xl border text-center text-xs font-sans tracking-tight font-bold transition-all duration-300 active:scale-95 cursor-pointer ${
                                    isSelected
                                      ? "bg-[#ff0a21]/10 border-[#ff0a21] text-white"
                                      : "bg-black/20 border-white/5 text-white/50 hover:text-white/90 hover:border-white/10"
                                  }`}
                                >
                                  {timeOption}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Informative live template preview message */}
                        <div className="bg-black/30 border border-white/5 rounded-2xl p-4.5">
                          <span className="text-[8px] font-sans text-neutral-500 uppercase tracking-widest block mb-2 font-bold">
                            Предварительный просмотр сообщения:
                          </span>
                          <p className="text-neutral-300 text-xs font-sans italic leading-relaxed font-normal p-3 bg-neutral-900/40 rounded-xl border border-white/5 select-all">
                            &ldquo;Здравствуйте! Хочу записаться на тренировки в
                            FitnessBlitz в г. {selectedWaCityName}. Мне удобнее
                            заниматься в следующее время: {waPreferredTime}
                            .&rdquo;
                          </p>
                        </div>

                        {/* Direct API redirect button optimized as real physical static anchor with high performance hover mechanics */}
                        <a
                          href={waHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full h-12 rounded-full bg-[#e40011] hover:bg-[#b5000d] font-sans font-extrabold uppercase text-[10.5px] tracking-widest text-white transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2.5 text-center"
                        >
                          <MessageSquare className="w-4 h-4 text-white" />
                          <span>Написать в WhatsApp</span>
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ================= FOOTER SECTION ================= */}
          <footer className="relative w-full bg-neutral-950 border-t border-white/5 pt-16 pb-12 px-6 sm:px-10 z-10 select-none overflow-hidden shrink-0">
            {/* Clean minimalist design: no glowing ambient filters */}

            <div className="max-w-7xl mx-auto w-full">
              {/* Top row of footer grids */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12">
                {/* Brand Column (Col Span 4) */}
                <div className="lg:col-span-4 flex flex-col gap-5 text-left">
                  <div className="flex items-center gap-3">
                    <img
                      src="/logo.png"
                      alt="FitnessBlitz Logo"
                      className="h-10 sm:h-11 w-auto object-contain"
                    />
                  </div>
                  <p className="text-white/50 text-xs sm:text-sm font-sans leading-relaxed">
                    Мы — первая и крупнейшая сеть современных фитнес-клубов
                    безлимитного формата в Казахстане. Наша миссия — сделать
                    фитнес доступным, качественным и приятным для всех жителей
                    страны.
                  </p>

                  {/* 2GIS Award Indicator */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/5 w-fit">
                    <img
                      src="https://disk.2gis.com/rubricator/thenomineesd5fc3fe077e03b4c544c55602eee949e.svg"
                      alt="2GIS Brand nominee"
                      className="w-4 h-4 object-contain brightness-110"
                      referrerPolicy="no-referrer"
                    />
                    <span className="font-sans text-[10px] text-[#cdd8e6] font-extrabold uppercase tracking-wider">
                      Победитель 2ГИС
                    </span>
                  </div>
                </div>

                {/* Navigation Links Column (Col Span 2) */}
                <div className="lg:col-span-2 flex flex-col gap-4 text-left">
                  <h4 className="text-xs font-sans text-white font-black uppercase tracking-widest border-l-2 border-[#e40011] pl-2.5">
                    Навигация
                  </h4>
                  <ul className="flex flex-col gap-2.5 text-xs font-bold uppercase tracking-wider text-white/50">
                    <li>
                      <button
                        onClick={() => scrollToSectionStr("hero-section", 0)}
                        className="hover:text-white transition-colors duration-200 cursor-pointer focus:outline-none text-left"
                      >
                        Главная
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => scrollToSectionStr("map-section", 1)}
                        className="hover:text-white transition-colors duration-200 cursor-pointer focus:outline-none text-left"
                      >
                        Наши клубы
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => scrollToSectionStr("news-section", 3)}
                        className="hover:text-white transition-colors duration-200 cursor-pointer focus:outline-none text-left"
                      >
                        Новости
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          setActivePage("faq");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="hover:text-white transition-colors duration-200 cursor-pointer focus:outline-none text-left"
                      >
                        Правила
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          alert("Раздел Франшиза находится в разработке.");
                        }}
                        className="hover:text-white transition-colors duration-200 cursor-pointer focus:outline-none text-left"
                      >
                        Франшиза
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Cities / Branch selector Column (Col Span 3) */}
                <div className="lg:col-span-3 flex flex-col gap-4 text-left">
                  <h4 className="text-xs font-sans text-white font-black uppercase tracking-widest border-l-2 border-[#e40011] pl-2.5">
                    Наши филиалы
                  </h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                    {citiesList.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          handleSelectChosenCity(c.id);
                          scrollToSectionStr("map-section", 1);
                        }}
                        className={`text-left text-xs font-sans transition-all duration-200 cursor-pointer focus:outline-none hover:text-white capitalize flex items-center gap-1.5 ${
                          chosenCityId === c.id
                            ? "text-[#e40011] font-black"
                            : "text-white/50 font-normal"
                        }`}
                      >
                        <MapPin className="w-3 h-3 opacity-60 shrink-0" />
                        <span className="truncate">{c.name}</span>
                      </button>
                    ))}
                    {/* Select All */}
                    <button
                      onClick={() => {
                        handleSelectChosenCity(null);
                        scrollToSectionStr("map-section", 1);
                      }}
                      className={`text-left col-span-2 text-xs font-sans font-bold uppercase tracking-widest transition-all duration-200 cursor-pointer focus:outline-none hover:text-[#e40011] mt-1 flex items-center gap-1.5 ${
                        !chosenCityId
                          ? "text-[#e40011] font-black"
                          : "text-white/40"
                      }`}
                    >
                      <span>Показать все на карте</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Direct Support Contacts Column (Col Span 3) */}
                <div className="lg:col-span-3 flex flex-col gap-4 text-left">
                  <h4 className="text-xs font-sans text-white font-black uppercase tracking-widest border-l-2 border-[#e40011] pl-2.5">
                    Контакты и Режим работы
                  </h4>
                  <div className="flex flex-col gap-3 font-sans text-xs">
                    <div className="flex gap-3 items-start">
                      <Phone className="w-4 h-4 text-[#e40011] shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-white/40 font-bold uppercase text-[9px] tracking-wider mb-0.5">
                          Единый Колл-центр
                        </span>
                        <a
                          href="tel:+77073331234"
                          className="text-white hover:text-[#e40011] transition-colors font-bold"
                        >
                          +7 (707) 333-12-34
                        </a>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start">
                      <Clock className="w-4 h-4 text-[#e40011] shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-white/40 font-bold uppercase text-[9px] tracking-wider mb-0.5">
                          Режим работы залов
                        </span>
                        <p className="text-white">Будни: 07:00 – 23:00</p>
                        <p className="text-white">Выходные: 09:00 – 22:00</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start">
                      <Instagram className="w-4 h-4 text-[#e40011] shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-white/40 font-bold uppercase text-[9px] tracking-wider mb-0.5">
                          Социальные сети
                        </span>
                        <a
                          href="https://www.instagram.com/fitnessblitz_official/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:text-[#e40011] transition-colors font-bold flex items-center gap-1"
                        >
                          <span>@fitnessblitz_official</span>
                          <ExternalLink className="w-3 h-3 opacity-55" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Separator Divider */}
              <div className="w-full h-px bg-white/5" />

              {/* Bottom Row */}
              <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-5 w-full">
                {/* Left Details */}
                <div className="text-left font-sans text-[11px] text-white/30 flex flex-col gap-1 leading-normal select-none">
                  <p className="font-semibold text-white/40">
                    © {new Date().getFullYear()} FitnessBlitz. Все права
                    защищены.
                  </p>
                  <p>
                    Использование материалов сайта без предварительного согласия
                    правообладателя запрещено законом Казахстана.
                  </p>
                  <p className="text-[10px] mt-1 text-white/20">
                    Соответствие Закону Республики Казахстан № 94-V «О
                    персональных данных и их защите».
                  </p>
                </div>

                {/* Right Details - Social actions and scroll up */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => scrollToSectionStr("hero-section", 0)}
                    className="px-4.5 py-2.5 rounded-xl bg-white/[0.02] hover:bg-[#e40011] border border-white/5 hover:border-[#e40011] transition-all text-[10px] font-sans font-black uppercase tracking-widest text-white/70 hover:text-white cursor-pointer active:scale-95 text-center flex items-center gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
                    title="Наверх"
                  >
                    <span>Наверх</span>
                    <ChevronLeft className="w-4 h-4 rotate-90" />
                  </button>
                </div>
              </div>
            </div>
          </footer>
        </div>
      )}

      {/* Immersive Command Node Selector First Login Modal */}
      <AnimatePresence>
        {isFirstLoginModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-3xl"
            id="first-login-modal-overlay"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg bg-[#0d0d0e]/95 border border-white/5 rounded-[32px] p-8 sm:p-11 text-center shadow-[0_35px_100px_rgba(0,0,0,0.95)]"
              id="first-login-modal-container"
            >
              <div className="relative z-10 w-full animate-fade-in">
                {/* Simplified Title & Concept */}
                <h3 className="text-lg sm:text-xl font-black tracking-tight text-white mb-3.5 leading-tight uppercase font-display">
                  Выберите ваш город
                </h3>
                <p className="text-white/50 text-xs sm:text-sm font-sans max-w-sm mx-auto mb-8 leading-relaxed font-normal">
                  Выберите ваш филиал сети фитнес-клубов{" "}
                  <span className="text-[#e40011] font-bold">FitnessBlitz</span>{" "}
                  в Казахстане. Это поможет показать вам тренерский состав,
                  актуальные абонементы и ближайшие залы.
                </p>

                {/* 3x3 Simplified Grid of City Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-w-sm mx-auto mb-4">
                  {citiesList.map((city) => {
                    return (
                      <button
                        key={city.id}
                        onClick={() => {
                          handleSelectChosenCity(city.id);
                          setIsFirstLoginModalOpen(false);
                        }}
                        className="flex items-center justify-center py-3 px-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#e40011]/30 hover:bg-[#e40011]/5 text-white transition-all duration-300 text-[10.5px] font-sans font-extrabold tracking-widest uppercase cursor-pointer text-center hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {getCityLabel(city.id)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Minimal Skip / Global option */}
              <div className="relative z-10 pt-0 flex flex-col items-center justify-between w-full">
                <button
                  onClick={() => {
                    handleSelectChosenCity(null);
                    setIsFirstLoginModalOpen(false);
                  }}
                  className="w-full text-center text-[11px] font-sans tracking-wider uppercase text-white/40 hover:text-[#e40011] transition-colors py-2 active:scale-98 cursor-pointer font-bold"
                >
                  Пропустить и показать все филиалы
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Immersive Buy Subscription Modal */}
      <AnimatePresence>
        {isBuyModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-3xl overflow-y-auto"
            id="buy-subscription-modal-overlay"
            onClick={() => {
              setIsBuyModalOpen(false);
              setBuyModalSubmitted(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-xl bg-[#09090a]/95 border border-white/5 rounded-[32px] p-6 sm:p-10 text-center shadow-[0_35px_100px_rgba(0,0,0,0.95)] max-h-[90vh] overflow-y-auto"
              id="buy-subscription-modal-container"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setIsBuyModalOpen(false);
                  setBuyModalSubmitted(false);
                }}
                className="absolute top-5 right-5 z-[130] bg-white/[0.03] hover:bg-[#e40011] border border-white/5 text-white p-2 text-center rounded-full transition-all cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95"
                title="Закрыть"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative z-10 w-full text-left">
                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mb-6 font-display">
                  Купить <span className="text-[#e40011]">абонемент</span>{" "}
                  сейчас
                </h3>

                {/* Custom Tab Segment Switcher */}
                <div className="flex justify-center mb-6 w-full max-w-md">
                  <div className="flex bg-neutral-900/50 border border-white/5 rounded-full p-1 w-full relative">
                    <button
                      type="button"
                      onClick={() => setBuyModalTab("phone")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-[9px] sm:text-[10px] font-sans uppercase tracking-widest font-extrabold transition-all duration-300 cursor-pointer ${
                        buyModalTab === "phone"
                          ? "bg-[#e40011] text-white shadow-[0_4px_16px_rgba(228,0,17,0.35)] scale-[1.02]"
                          : "text-white/50 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Phone className="w-3 h-3" />
                      <span>По телефону</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBuyModalTab("whatsapp")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-[9px] sm:text-[10px] font-sans uppercase tracking-widest font-extrabold transition-all duration-300 cursor-pointer ${
                        buyModalTab === "whatsapp"
                          ? "bg-[#e40011] text-white shadow-[0_4px_16px_rgba(228,0,17,0.35)] scale-[1.02]"
                          : "text-white/50 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>По WhatsApp</span>
                    </button>
                  </div>
                </div>

                {/* Form Panels container */}
                <AnimatePresence mode="wait">
                  {buyModalTab === "phone" ? (
                    <motion.div
                      key="buy-phone-panel"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="w-full"
                    >
                      {!buyModalSubmitted ? (
                        <form
                          onSubmit={handleSubmitBuyModalForm}
                          className="flex flex-col gap-4"
                        >
                          {/* Name Input */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] font-sans text-neutral-400 font-bold uppercase tracking-wider">
                              Ваше имя
                            </label>
                            <div className="relative flex items-center">
                              <User className="absolute left-4 w-4 h-4 text-white/30" />
                              <input
                                type="text"
                                required
                                placeholder="Иван Иванов"
                                value={buyModalName}
                                onChange={(e) =>
                                  setBuyModalName(e.target.value)
                                }
                                className="w-full bg-[#0d0d10]/90 border border-white/10 focus:border-[#ff0a21] focus:ring-1 focus:ring-[#ff0a21]/35 rounded-xl py-3 pl-11 pr-4 text-xs font-sans text-white placeholder-white/20 focus:outline-none transition-all"
                              />
                            </div>
                          </div>

                          {/* Flex Row name & phone */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Phone Input */}
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-sans text-neutral-400 font-bold uppercase tracking-wider">
                                Номер телефона
                              </label>
                              <div className="relative flex items-center">
                                <Phone className="absolute left-4 w-4 h-4 text-white/30" />
                                <input
                                  type="tel"
                                  required
                                  placeholder="+7 (707) 123-4567"
                                  value={buyModalPhone}
                                  onChange={(e) =>
                                    setBuyModalPhone(e.target.value)
                                  }
                                  className="w-full bg-[#0d0d10]/90 border border-white/10 focus:border-[#ff0a21] focus:ring-1 focus:ring-[#ff0a21]/35 rounded-xl py-3 pl-11 pr-4 text-xs font-sans text-white placeholder-white/20 focus:outline-none transition-all"
                                />
                              </div>
                            </div>

                            {/* Email Input */}
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-sans text-neutral-400 font-bold uppercase tracking-wider">
                                Электронная почта
                              </label>
                              <div className="relative flex items-center">
                                <Mail className="absolute left-4 w-4 h-4 text-white/30" />
                                <input
                                  type="email"
                                  required
                                  placeholder="ivan@example.com"
                                  value={buyModalEmail}
                                  onChange={(e) =>
                                    setBuyModalEmail(e.target.value)
                                  }
                                  className="w-full bg-[#0d0d10]/90 border border-white/10 focus:border-[#ff0a21] focus:ring-1 focus:ring-[#ff0a21]/35 rounded-xl py-3 pl-11 pr-4 text-xs font-sans text-white placeholder-white/20 focus:outline-none transition-all"
                                />
                              </div>
                            </div>
                          </div>

                          {/* City Select */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] font-sans text-neutral-400 font-bold uppercase tracking-wider">
                              Выберите ваш город залов
                            </label>
                            <div className="relative">
                              <select
                                value={buyModalCityId}
                                onChange={(e) =>
                                  setBuyModalCityId(e.target.value)
                                }
                                className="w-full bg-[#0d0d10]/90 border border-white/10 focus:border-[#ff0a21] focus:ring-1 focus:ring-[#ff0a21]/35 rounded-xl py-3 px-4 text-xs font-sans text-white focus:outline-none transition-all appearance-none cursor-pointer"
                              >
                                {citiesList.map((city) => (
                                  <option
                                    key={city.id}
                                    value={city.id}
                                    className="bg-neutral-900 text-white"
                                  >
                                    {city.name}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                            </div>
                          </div>

                          {/* Consent check */}
                          <label className="flex items-start gap-3 mt-1 group cursor-pointer">
                            <input
                              type="checkbox"
                              required
                              checked={buyModalConsent}
                              onChange={(e) =>
                                setBuyModalConsent(e.target.checked)
                              }
                              className="mt-0.5 w-4 h-4 rounded border-white/15 bg-black/50 border text-[#ff0a21] focus:ring-[#ff0a21]/20 transition-all accent-[#ff0a21] cursor-pointer"
                            />
                            <span className="text-[9px] text-white/50 font-sans leading-normal font-normal group-hover:text-white/70 transition-colors">
                              Нажимая кнопку «Отправить», я даю свое согласие на
                              обработку моих персональных данных, в соответствии
                              с Федеральным законом от 27.07.2006 года №152-ФЗ
                              «О персональных данных», на условиях и для целей,
                              определенных в Согласии на обработку персональных
                              данных *
                            </span>
                          </label>

                          {/* Submit Button */}
                          <button
                            type="submit"
                            disabled={!buyModalConsent}
                            className={`w-full h-11 flex items-center justify-center gap-2 mt-1 rounded-full font-sans font-extrabold uppercase text-[10px] tracking-widest transition-all duration-300 ${
                              buyModalConsent
                                ? "bg-[#e40011] hover:bg-[#ff1a2b] text-white hover:scale-[1.01] active:scale-[0.98] cursor-pointer shadow-[0_6px_20px_rgba(228,0,17,0.3)]"
                                : "bg-neutral-800 text-white/35 border border-white/5 cursor-not-allowed"
                            }`}
                          >
                            <span>Купить абонемент</span>
                          </button>
                        </form>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-center py-6 flex flex-col items-center justify-center gap-3"
                        >
                          <div className="w-14 h-14 rounded-full bg-[#e40011]/20 border border-[#e40011]/40 flex items-center justify-center mb-1">
                            <Check className="w-6 h-6 text-[#e40011]" />
                          </div>
                          <h4 className="text-lg font-black uppercase tracking-tight font-sans text-white">
                            Заявка принята!
                          </h4>
                          <p className="text-neutral-400 text-xs font-sans max-w-sm mx-auto leading-relaxed">
                            Спасибо,{" "}
                            <span className="text-white font-bold">
                              {buyModalName}
                            </span>
                            ! Мы забронировали для вас абонемент и свяжемся с
                            вами по номеру{" "}
                            <span className="text-white font-bold">
                              {buyModalPhone}
                            </span>{" "}
                            в ближайшее время.
                          </p>
                          <button
                            onClick={() => {
                              setBuyModalSubmitted(false);
                              setBuyModalName("");
                              setBuyModalPhone("");
                              setBuyModalEmail("");
                            }}
                            className="mt-2 px-5 py-2 rounded-full border border-white/10 text-[8.5px] font-bold uppercase tracking-widest text-[#e40011] hover:bg-neutral-800 transition-all active:scale-95 cursor-pointer"
                          >
                            Вернуться назад
                          </button>
                        </motion.div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="buy-wa-panel"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="w-full flex flex-col gap-4"
                    >
                      {/* WA City choice */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-sans text-neutral-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-[#e40011]" />
                          <span>
                            Выберите ваш город (влияет на номер консультанта)
                          </span>
                        </label>
                        <div className="relative">
                          <select
                            value={buyModalCityId}
                            onChange={(e) => setBuyModalCityId(e.target.value)}
                            className="w-full bg-[#0d0d10]/95 border border-white/10 focus:border-[#ff0a21] focus:ring-1 focus:ring-[#ff0a21]/35 rounded-xl py-3 px-4 text-xs font-sans text-white focus:outline-none transition-all appearance-none cursor-pointer"
                          >
                            {citiesList.map((city) => (
                              <option
                                key={city.id}
                                value={city.id}
                                className="bg-neutral-900 text-white"
                              >
                                {city.name}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                        </div>
                      </div>

                      {/* WA preferred times */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-sans text-neutral-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-[#e40011]" />
                          <span>В какое время вам удобнее заниматься?</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {[
                            "Утренняя смена (до 12:00)",
                            "Дневная смена (12:00 - 17:00)",
                            "Вечерняя смена (после 17:00)",
                            "Без ограничений / Безлимит",
                          ].map((timeOption) => {
                            const isSelected =
                              buyModalWaPreferredTime === timeOption;
                            return (
                              <button
                                key={timeOption}
                                type="button"
                                onClick={() =>
                                  setBuyModalWaPreferredTime(timeOption)
                                }
                                className={`py-2 px-3 rounded-xl border text-center text-[10.5px] font-sans tracking-tight font-bold transition-all duration-300 active:scale-95 cursor-pointer ${
                                  isSelected
                                    ? "bg-[#ff0a21]/10 border-[#ff0a21] text-white"
                                    : "bg-black/20 border-white/5 text-white/50 hover:text-white/90 hover:border-white/10"
                                }`}
                              >
                                {timeOption}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Msg preview */}
                      <div className="bg-black/30 border border-white/5 rounded-2xl p-3">
                        <span className="text-[8px] font-sans text-neutral-500 uppercase tracking-widest block mb-1 font-bold">
                          Предварительный просмотр сообщения:
                        </span>
                        <p className="text-neutral-300 text-xs font-sans italic leading-relaxed font-normal p-2.5 bg-neutral-900/40 rounded-xl border border-white/5 select-all font-sans leading-relaxed">
                          &ldquo;Здравствуйте! Хочу приобрести абонемент в
                          FitnessBlitz в г. {selectedBuyModalWaCityName}. Мне
                          удобнее заниматься в следующее время:{" "}
                          {buyModalWaPreferredTime}.&rdquo;
                        </p>
                      </div>

                      {/* Direct WA contact */}
                      <a
                        href={buyModalWaHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full h-11 rounded-full bg-[#128c7e] hover:bg-[#25d366] font-sans font-extrabold uppercase text-[10px] tracking-widest text-white transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-2.5 text-center shadow-[0_6px_20px_rgba(37,211,102,0.25)]"
                      >
                        <MessageSquare className="w-4 h-4 text-white" />
                        <span>Написать в WhatsApp</span>
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Immersive Lightbox Zoom Modal */}
      <AnimatePresence>
        {isImgZoomed &&
          selectedCityId &&
          (() => {
            const city = citiesList.find((c) => c.id === selectedCityId);
            if (!city) return null;
            const kokshetauImages = Array.from(
              { length: 10 },
              (_, i) =>
                `https://github.com/mckhll-images/videos/blob/main/${i + 1}.png?raw=true`,
            );
            const genericImages = [
              "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
            ];
            const images =
              city.id === "KOKSHETAU" ? kokshetauImages : genericImages;
            const activeImg = images[activeImgIndex % images.length];

            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-black/95 backdrop-blur-2xl p-4 sm:p-8"
                onClick={() => setIsImgZoomed(false)}
              >
                {/* Close Button on top-right */}
                <button
                  onClick={() => setIsImgZoomed(false)}
                  className="absolute top-6 right-6 z-[120] bg-white/10 hover:bg-[#e40011] text-white p-2.5 rounded-full transition-all cursor-pointer flex items-center justify-center hover:scale-105 active:scale-95"
                  title="Закрыть"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Left/Right manual controls */}
                <div className="absolute inset-y-0 inset-x-4 sm:inset-x-8 flex justify-between items-center z-10 pointer-events-none">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSlideDirection(-1);
                      setActiveImgIndex(
                        (prev) => (prev - 1 + images.length) % images.length,
                      );
                      setSliderProgress(0);
                    }}
                    className="bg-black/60 hover:bg-[#e40011] text-white p-3 rounded-full transition-all cursor-pointer flex items-center justify-center w-12 h-12 pointer-events-auto border border-white/10 hover:scale-105 active:scale-95"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSlideDirection(1);
                      setActiveImgIndex((prev) => (prev + 1) % images.length);
                      setSliderProgress(0);
                    }}
                    className="bg-black/60 hover:bg-[#e40011] text-white p-3 rounded-full transition-all cursor-pointer flex items-center justify-center w-12 h-12 pointer-events-auto border border-white/10 hover:scale-105 active:scale-95"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>

                {/* Centered Image */}
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  transition={{ type: "spring", damping: 25, stiffness: 180 }}
                  className="relative max-w-5xl w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.8)] border border-white/15"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={activeImg}
                    alt={`${city.name} zoomed view`}
                    className="w-full h-full object-cover select-none"
                    referrerPolicy="no-referrer"
                  />

                  {/* Caption bottom overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-center">
                    <span className="text-white/60 text-xs tracking-widest uppercase font-mono">
                      {city.name} • ФОТО {(activeImgIndex % images.length) + 1}{" "}
                      / {images.length}
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            );
          })()}
      </AnimatePresence>
    </div>
  );
}

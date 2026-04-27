import React from "react";
import { Bell, Languages, ChevronDown } from "lucide-react"; // Icons updated
import { Logo } from "./Logo"; 
import { useI18n } from "../i18n/I18nProvider";

export const Header = () => {
  const { lang, setLang, languages, t } = useI18n();

  const rawUserRole = (localStorage.getItem("userRole") || "guest").toLowerCase();
  const userRole = rawUserRole === "owner" ? "admin" : rawUserRole;
  const roleLabel = t(`role.${userRole}`);

  return (
    <header className="fixed top-4 left-1/2 z-50 w-[95%] max-w-6xl -translate-x-1/2 font-sans">
      {/* Main Glassy Container */}
      <div className="flex items-center justify-between rounded-xl border border-white/40 bg-white/40 px-4 py-2 shadow-lg backdrop-blur-xl">
        
        {/* Left Section: Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white shadow-md">
            <Logo size={22} color="white" /> 
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none">
              {t("app.name")}
            </span>
            <h1 className="text-sm font-black text-slate-900 leading-tight">
              {t("header.commandCenter")}
            </h1>
          </div>
        </div>

        {/* Center Section: Live Status */}
        <div className="hidden items-center gap-2 rounded-full border border-slate-100 bg-white/60 px-4 py-1.5 shadow-sm md:flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
            <span className="relative h-2 w-2 rounded-full bg-green-600"></span>
          </span>
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider">
            {t("header.liveHotel", { hotel: "The Marlowe Grand" })}
          </span>
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-3">
          
          {/* Language Switcher */}
          <div className="relative">
            <Languages size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <ChevronDown size={12} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              aria-label={t("header.language")}
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="h-9 appearance-none rounded-lg bg-slate-900/5 pl-9 pr-8 text-xs font-black text-slate-700 transition-all hover:bg-slate-900/10 focus:outline-none"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Notification Icon */}
          <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-900/5 transition-all">
            <Bell size={20} strokeWidth={2.5} />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2 border-l border-slate-200 pl-3 ml-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-[11px] font-black text-white shadow-sm ring-2 ring-red-100">
              SC
            </div>
            <span className="hidden text-[11px] font-black text-slate-900 uppercase lg:block tracking-wider">
              {roleLabel}
            </span>
          </div>
        </div>

      </div>
    </header>
  );
};
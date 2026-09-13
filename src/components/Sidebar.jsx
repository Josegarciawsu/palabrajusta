// src/components/Sidebar.jsx
import {
  LayoutDashboard,
  BookOpen,
  List,
  Layers,
  Link2,
  HelpCircle,
  Gavel,
  GraduationCap,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import Logo from "./Logo.jsx";
import { semanas } from "../data/index.js";

function NavItem({ label, Icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] transition-all ${
        active
          ? "bg-white/15 text-white font-medium shadow-sm ring-1 ring-white/10"
          : "text-slate-300 hover:bg-white/[0.08] hover:text-white"
      }`}
    >
      <Icon size={16} strokeWidth={1.8} />
      <span className="flex-1 text-left">{label}</span>
    </button>
  );
}

function GroupLabel({ children }) {
  return (
    <p className="px-3 pt-6 pb-2 text-[10px] font-semibold tracking-[0.16em] uppercase text-slate-500">
      {children}
    </p>
  );
}

function SidebarContent({ view, onNavigate }) {
  return (
    <div className="sidebar-panel w-[272px] flex-shrink-0 h-full flex flex-col py-6 px-4 bg-sidebar border-r border-white/[0.07] overflow-y-auto">
      <div className="flex items-center gap-3 px-1 mb-1">
        <span className="grid place-items-center w-11 h-11 rounded-2xl bg-white shadow-lg shadow-black/20"><Logo size={33} /></span>
        <p className="font-serif font-semibold text-[18px] leading-tight text-white tracking-[-0.02em]">
          Palabra Justa
        </p>
      </div>
      <p className="px-1 mt-2 text-[11.5px] text-slate-400 mb-2 leading-snug">
        Certificación de intérprete judicial · Utah
      </p>

      <nav className="flex-1 mt-1 space-y-0.5">
        <GroupLabel>Estudio</GroupLabel>
        <NavItem
          label="Resumen"
          Icon={LayoutDashboard}
          active={view === "resumen"}
          onClick={() => onNavigate("resumen")}
        />
        {semanas.map((s, i) => (
          <NavItem
            key={s.id}
            label={`Semana ${i + 1}`}
            Icon={BookOpen}
            active={view === s.id}
            onClick={() => onNavigate(s.id)}
          />
        ))}

        <GroupLabel>Práctica</GroupLabel>
        <NavItem
          label="Glosario"
          Icon={List}
          active={view === "glosario"}
          onClick={() => onNavigate("glosario")}
        />
        <NavItem
          label="Tarjetas"
          Icon={Layers}
          active={view === "tarjetas"}
          onClick={() => onNavigate("tarjetas")}
        />
        <NavItem
          label="Relacionar"
          Icon={Link2}
          active={view === "relacionar"}
          onClick={() => onNavigate("relacionar")}
        />
        <NavItem
          label="Quiz"
          Icon={HelpCircle}
          active={view === "quiz"}
          onClick={() => onNavigate("quiz")}
        />

        <GroupLabel>Referencia</GroupLabel>
        <NavItem
          label="Caso de la semana"
          Icon={Gavel}
          active={view === "caso"}
          onClick={() => onNavigate("caso")}
        />
        <NavItem
          label="Recursos"
          Icon={GraduationCap}
          active={view === "recursos"}
          onClick={() => onNavigate("recursos")}
        />
      </nav>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.06] p-3.5">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-mint shadow-[0_0_0_4px_rgba(34,181,115,.12)]" />
          <span className="text-[11px] font-medium text-slate-200">Contenido verificado</span>
        </div>
        <p className="text-[10.5px] leading-relaxed text-slate-500">Preparación enfocada en la certificación judicial de Utah.</p>
      </div>
    </div>
  );
}

export default function Sidebar({ view, onNavigate }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="hidden md:block h-screen sticky top-0">
        <SidebarContent view={view} onNavigate={onNavigate} />
      </div>

      <div className="mobile-header md:hidden flex items-center justify-between px-3.5 py-2.5 bg-sidebar border-b border-white/10 sticky top-0 z-40 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-white"><Logo size={27} /></span>
          <p className="font-serif text-base text-white">Palabra Justa</p>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menú"
          className="text-white p-2"
        >
          <Menu size={22} />
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-72 h-full bg-sidebar relative">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Cerrar menú"
              className="absolute top-4 right-4 text-slate-300 p-1 z-10"
            >
              <X size={20} />
            </button>
            <SidebarContent
              view={view}
              onNavigate={(id) => {
                onNavigate(id);
                setMobileOpen(false);
              }}
            />
          </div>
          <div className="flex-1 bg-black/30" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </>
  );
}

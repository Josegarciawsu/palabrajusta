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
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] transition-colors ${
        active
          ? "bg-accent text-white font-medium"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <Icon size={16} strokeWidth={1.8} />
      <span className="flex-1 text-left">{label}</span>
    </button>
  );
}

function GroupLabel({ children }) {
  return (
    <p className="px-3 pt-5 pb-1.5 text-[10.5px] font-semibold tracking-wider text-gray-400">
      {children}
    </p>
  );
}

function SidebarContent({ view, onNavigate }) {
  return (
    <div className="w-64 flex-shrink-0 h-full flex flex-col py-5 px-3 bg-sidebar border-r border-sidebarBorder overflow-y-auto">
      <div className="flex items-center gap-3 px-1 mb-1">
        <Logo size={40} />
        <p className="font-serif text-[18px] leading-tight text-gray-900">
          Palabra Justa
        </p>
      </div>
      <p className="px-1 text-[12px] text-gray-400 mb-2 leading-snug">
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

      <div className="border-t border-sidebarBorder pt-3 px-1 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-mint" />
        <span className="text-[11px] text-gray-400">Contenido oficial de clase</span>
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

      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-sidebar border-b border-sidebarBorder sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Logo size={30} />
          <p className="font-serif text-base text-gray-900">Palabra Justa</p>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menú"
          className="text-gray-700 p-2"
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
              className="absolute top-4 right-4 text-gray-500 p-1"
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

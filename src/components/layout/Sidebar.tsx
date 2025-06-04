import React, { useState } from "react";
import { SlidersHorizontal, PlugZap, Shield, BarChart3, Settings, Tag, Eye, FileText, Lock, Shield as ShieldIcon, Type, ChevronLeft, ChevronRight, Briefcase, Scale, UserCog } from "lucide-react";
import { Section } from "../NovaAdminConsole";

interface SidebarProps {
  currentSection: Section;
  setSection: (section: Section) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentSection, setSection }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`bg-white border-r border-slate-200 shadow-sm h-screen transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <Shield className="w-6 h-6 text-blue-700" />
                <h1 className="text-xl font-bold text-slate-800">Nova Admin</h1>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 hover:bg-slate-100 rounded-md"
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5 text-slate-600" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              )}
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="space-y-1">
            <h3 className={`text-xs text-slate-500 uppercase font-semibold mb-3 ${
              isCollapsed ? 'sr-only' : 'pl-2'
            }`}>
              Management
            </h3>
            <NavItem 
              icon={<Briefcase className="w-4 h-4" />} 
              label="Business" 
              isActive={currentSection === "orchestration"}
              onClick={() => setSection("orchestration")}
              isCollapsed={isCollapsed}
            />
            <NavItem 
              icon={<Scale className="w-4 h-4" />} 
              label="Security & Compliance" 
              isActive={currentSection === "security"}
              onClick={() => setSection("security")}
              isCollapsed={isCollapsed}
            />
            <NavItem 
              icon={<PlugZap className="w-4 h-4" />} 
              label="Integrations" 
              isActive={currentSection === "integrations" || currentSection === "fieldmapping"}
              onClick={() => setSection("integrations")}
              isCollapsed={isCollapsed}
            />
          </div>

          <div className="space-y-1">
            <h3 className={`text-xs text-slate-500 uppercase font-semibold mb-3 ${
              isCollapsed ? 'sr-only' : 'pl-2'
            }`}>
              Classification
            </h3>
            <NavItem 
              icon={<FileText className="w-4 h-4" />} 
              label="Labels" 
              isActive={currentSection === "labels"}
              onClick={() => setSection("labels")}
              isCollapsed={isCollapsed}
            />
            <NavItem 
              icon={<FileText className="w-4 h-4" />} 
              label="Content Policies" 
              isActive={currentSection === "contentpolicies"}
              onClick={() => setSection("contentpolicies")}
              isCollapsed={isCollapsed}
            />
            <NavItem 
              icon={<FileText className="w-4 h-4" />} 
              label="Publishing Policies" 
              isActive={currentSection === "publishingpolicies"}
              onClick={() => setSection("publishingpolicies")}
              isCollapsed={isCollapsed}
            />
          </div>

          <div className="space-y-1">
            <h3 className={`text-xs text-slate-500 uppercase font-semibold mb-3 ${
              isCollapsed ? 'sr-only' : 'pl-2'
            }`}>
              Protection
            </h3>
            <NavItem 
              icon={<Tag className="w-4 h-4" />} 
              label="Tagging" 
              isActive={currentSection === "tagging"}
              onClick={() => setSection("tagging")}
              isCollapsed={isCollapsed}
            />
            <NavItem 
              icon={<Eye className="w-4 h-4" />} 
              label="Visual Marking" 
              isActive={currentSection === "visualmarking"}
              onClick={() => setSection("visualmarking")}
              isCollapsed={isCollapsed}
            />
            <NavItem 
              icon={<Type className="w-4 h-4" />} 
              label="Watermark" 
              isActive={currentSection === "watermark"}
              onClick={() => setSection("watermark")}
              isCollapsed={isCollapsed}
            />
            <NavItem 
              icon={<Lock className="w-4 h-4" />} 
              label="Encryption" 
              isActive={currentSection === "encryption"}
              onClick={() => setSection("encryption")}
              isCollapsed={isCollapsed}
            />
            <NavItem 
              icon={<ShieldIcon className="w-4 h-4" />} 
              label="EDRM" 
              isActive={currentSection === "edrm"}
              onClick={() => setSection("edrm")}
              isCollapsed={isCollapsed}
            />
          </div>
          
          <div className="space-y-1">
            <h3 className={`text-xs text-slate-500 uppercase font-semibold mb-3 ${
              isCollapsed ? 'sr-only' : 'pl-2'
            }`}>
              Analytics
            </h3>
            <NavItem 
              icon={<BarChart3 className="w-4 h-4" />} 
              label="Reports" 
              isActive={false}
              onClick={() => {}}
              isCollapsed={isCollapsed}
            />
            <NavItem 
              icon={<UserCog className="w-4 h-4" />} 
              label="Administration" 
              isActive={currentSection === "administration"}
              onClick={() => setSection("administration")}
              isCollapsed={isCollapsed}
            />
          </div>
        </div>

        <div className="p-4 border-t border-slate-200">
          <NavItem 
            icon={<Settings className="w-4 h-4" />} 
            label="Settings" 
            isActive={false}
            onClick={() => {}}
            isCollapsed={isCollapsed}
          />
        </div>
      </div>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  isCollapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick, isCollapsed }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-3 py-2 rounded-md transition-all duration-200 ${
        isActive 
          ? "bg-blue-50 text-blue-700 font-medium" 
          : "text-slate-600 hover:bg-slate-100"
      }`}
      title={isCollapsed ? label : undefined}
    >
      <span className={`${isActive ? "text-blue-700" : "text-slate-500"}`}>{icon}</span>
      {!isCollapsed && <span className="ml-3">{label}</span>}
    </button>
  );
};

export default Sidebar;
import React from "react";
import { PolicyDocument, RoleType } from "../types";
import { FileText, Lock, ShieldCheck, History } from "lucide-react";

interface SidebarProps {
  documents: PolicyDocument[];
  currentRole: RoleType;
  showAudit: boolean;
  auditCount: number;
  onToggleAudit: () => void;
  onSelectDoc: (doc: PolicyDocument) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  documents,
  currentRole,
  showAudit,
  auditCount,
  onToggleAudit,
  onSelectDoc,
}) => {
  const accessibleDocs = documents.filter((d) => d.roles.includes(currentRole));
  const restrictedDocs = documents.filter((d) => !d.roles.includes(currentRole));

  return (
    <aside className="w-full md:w-64 border-r border-[#D8DCE3] bg-white p-5 flex flex-col justify-between shrink-0">
      <div className="space-y-5">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#5B6472] mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2F6F4F]" />
            <span>Accessible Documents</span>
          </div>
          <div className="space-y-2">
            {accessibleDocs.map((doc) => (
              <button
                key={doc.id}
                onClick={() => onSelectDoc(doc)}
                className="w-full text-left flex items-start gap-2 text-xs text-[#14213D] p-2 rounded-md hover:bg-[#F7F8FA] transition-colors group cursor-pointer"
              >
                <span className="text-[#2F6F4F] font-bold mt-0.5 select-none">●</span>
                <span className="group-hover:text-blue-900 font-medium leading-snug">
                  {doc.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {restrictedDocs.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#8A93A0] mb-3">
              <Lock className="w-3.5 h-3.5 text-[#9E3B3B]" />
              <span>Restricted for this role</span>
            </div>
            <div className="space-y-2">
              {restrictedDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-start gap-2 text-xs text-[#8A93A0] p-2 rounded-md bg-[#FAFAFA] border border-dashed border-[#E5E7EB]"
                >
                  <span className="text-[#9E3B3B] font-bold mt-0.5 select-none">●</span>
                  <span className="leading-snug">{doc.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="pt-6 mt-4 border-t border-[#EDEFF2]">
        <button
          id="auditToggle"
          onClick={onToggleAudit}
          className={`w-full flex items-center justify-center gap-2 font-mono-code text-xs px-3 py-2.5 rounded-md border transition-all cursor-pointer ${
            showAudit
              ? "bg-[#14213D] text-white border-[#14213D] shadow-xs"
              : "bg-[#F7F8FA] text-[#14213D] border-[#C7CDD6] hover:bg-[#EDEFF2]"
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>{showAudit ? "Hide audit log" : `View audit log (${auditCount})`}</span>
        </button>
      </div>
    </aside>
  );
};

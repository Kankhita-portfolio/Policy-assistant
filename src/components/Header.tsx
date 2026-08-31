import React from "react";
import { RoleType } from "../types";
import { ROLES } from "../data/policies";
import { Shield, Key, FileText, CheckCircle2, AlertCircle } from "lucide-react";

interface HeaderProps {
  currentRole: RoleType;
  onRoleChange: (role: RoleType) => void;
  apiKey: string;
  hasServerKey: boolean;
  onOpenApiKeyModal: () => void;
  onOpenDocsModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  apiKey,
  hasServerKey,
  onOpenApiKeyModal,
  onOpenDocsModal,
}) => {
  const isKeyConfigured = Boolean(apiKey || hasServerKey);

  return (
    <header className="border-b border-[#D8DCE3] bg-white px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sticky top-0 z-10 shadow-xs">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded bg-[#14213D] text-white">
            <Shield className="w-5 h-5 text-amber-300" />
          </div>
          <h1 className="font-serif-display text-2xl font-semibold tracking-tight text-[#14213D]">
            Policy Assistant
          </h1>
        </div>
        <p className="text-xs text-[#5B6472] mt-0.5 font-sans-body">
          Answers grounded strictly in company policy documents with verbatim citations.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <button
          id="inspectPoliciesBtn"
          onClick={onOpenDocsModal}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#14213D] bg-[#F7F8FA] hover:bg-[#EDEFF2] border border-[#C7CDD6] rounded-md transition-colors cursor-pointer"
          title="Inspect grounded company policies"
        >
          <FileText className="w-3.5 h-3.5 text-[#5B6472]" />
          <span>Policies</span>
        </button>

        <button
          id="configureApiKeyBtn"
          onClick={onOpenApiKeyModal}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
            isKeyConfigured
              ? "bg-[#F0FDF4] text-[#166534] border-[#BBF7D0] hover:bg-[#DCFCE7]"
              : "bg-[#FFFBEB] text-[#92400E] border-[#FDE68A] hover:bg-[#FEF3C7]"
          }`}
          title="Configure Gemini API Key"
        >
          <Key className="w-3.5 h-3.5" />
          <span>
            {hasServerKey
              ? "AI Studio Key (Active)"
              : apiKey
              ? "Custom Key (Active)"
              : "Set Gemini API Key"}
          </span>
          {isKeyConfigured ? (
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          ) : (
            <AlertCircle className="w-3 h-3 text-amber-600" />
          )}
        </button>

        <div className="flex items-center gap-2 ml-auto md:ml-0">
          <label htmlFor="roleSelect" className="text-xs font-medium text-[#5B6472]">
            Viewing as:
          </label>
          <select
            id="roleSelect"
            value={currentRole}
            onChange={(e) => onRoleChange(e.target.value as RoleType)}
            className="font-sans-body text-xs font-medium px-3 py-1.5 rounded-md border border-[#C7CDD6] bg-[#F7F8FA] text-[#14213D] hover:border-[#9AA3B0] focus:outline-hidden focus:ring-1 focus:ring-[#14213D] cursor-pointer"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};

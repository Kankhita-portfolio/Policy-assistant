import React from "react";
import { PolicyDocument, RoleType } from "../types";
import { X, FileText, CheckCircle, ShieldAlert } from "lucide-react";

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: PolicyDocument[];
  currentRole: RoleType;
  selectedDoc: PolicyDocument | null;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
  isOpen,
  onClose,
  documents,
  currentRole,
  selectedDoc,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-[#D8DCE3]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#D8DCE3] flex items-center justify-between bg-[#F7F8FA]">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#14213D]" />
            <div>
              <h3 className="font-serif-display text-base font-semibold text-[#14213D]">
                Grounded Policy Documents
              </h3>
              <p className="text-xs text-[#5B6472]">
                Inspect verbatim company policy text and role-level visibility
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#5B6472] hover:text-[#14213D] hover:bg-[#E5E7EB] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {documents.map((doc) => {
            const isAccessible = doc.roles.includes(currentRole);
            const isHighlight = selectedDoc?.id === doc.id;

            return (
              <div
                key={doc.id}
                className={`rounded-lg border p-5 transition-all ${
                  isHighlight
                    ? "border-[#14213D] ring-2 ring-[#14213D]/10 bg-[#FBFBFC]"
                    : "border-[#D8DCE3] bg-white"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-[#EDEFF2]">
                  <div>
                    <h4 className="font-serif-display font-semibold text-sm text-[#14213D]">
                      {doc.name}
                    </h4>
                    <span className="text-[11px] text-[#5B6472]">{doc.category}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isAccessible ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#2F6F4F] bg-[#F0FDF4] border border-[#BBF7D0] px-2 py-0.5 rounded">
                        <CheckCircle className="w-3 h-3" />
                        Accessible by {currentRole}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#9E3B3B] bg-[#FEF2F2] border border-[#FCA5A5] px-2 py-0.5 rounded">
                        <ShieldAlert className="w-3 h-3" />
                        Restricted for {currentRole}
                      </span>
                    )}
                  </div>
                </div>

                {/* Paragraphs */}
                <div className="space-y-2.5">
                  {doc.paragraphs.map((para, pIdx) => (
                    <div
                      key={pIdx}
                      className="text-xs text-[#14213D] flex items-start gap-2.5 p-2 rounded hover:bg-[#F7F8FA]"
                    >
                      <span className="font-mono-code text-[11px] font-semibold text-[#A6784B] shrink-0 bg-[#FFF9EE] px-1.5 py-0.5 rounded border border-[#F3E2C4]">
                        ¶{pIdx + 1}
                      </span>
                      <span className="leading-relaxed">{para}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-2 border-t border-[#EDEFF2] flex items-center gap-1 text-[11px] text-[#5B6472]">
                  <span className="font-medium">Authorized roles:</span>
                  <span>{doc.roles.join(", ")}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#D8DCE3] bg-[#F7F8FA] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium bg-[#14213D] text-white rounded-md hover:bg-[#1E2F54] transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

import React from "react";
import { AuditLogEntry } from "../types";
import { ShieldCheck, History, Trash2, ArrowLeft } from "lucide-react";

interface AuditPanelProps {
  auditLog: AuditLogEntry[];
  onClearAudit: () => void;
  onClose: () => void;
}

export const AuditPanel: React.FC<AuditPanelProps> = ({
  auditLog,
  onClearAudit,
  onClose,
}) => {
  return (
    <div id="auditPanel" className="flex-1 flex flex-col bg-white p-6 overflow-y-auto">
      <div className="max-w-5xl w-full mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-[#D8DCE3] pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-[#F7F8FA] border border-[#D8DCE3] text-[#5B6472] hover:text-[#14213D] transition-colors cursor-pointer"
              title="Return to policy chat"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="font-serif-display text-xl font-semibold text-[#14213D]">
                Compliance & Access Audit Trail
              </h2>
              <p className="text-xs text-[#5B6472]">
                Every query, role permission check, and grounded paragraph citation is recorded for auditability.
              </p>
            </div>
          </div>

          {auditLog.length > 0 && (
            <button
              onClick={onClearAudit}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#9E3B3B] hover:bg-[#FEF2F2] border border-[#FCA5A5] rounded-md transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Log</span>
            </button>
          )}
        </div>

        {auditLog.length === 0 ? (
          <div className="py-16 text-center">
            <History className="w-10 h-10 text-[#C7CDD6] mx-auto mb-3" />
            <p className="text-sm font-medium text-[#5B6472] mb-1">
              No policy queries logged yet
            </p>
            <p className="text-xs text-[#8A93A0] max-w-sm mx-auto">
              Ask questions through the chat to view the real-time access control and chunk retrieval audit log here.
            </p>
          </div>
        ) : (
          <div className="border border-[#D8DCE3] rounded-lg overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#F7F8FA] border-b border-[#D8DCE3]">
                <tr>
                  <th className="py-3 px-4 font-semibold text-[#5B6472] uppercase tracking-wider text-[11px]">
                    Timestamp
                  </th>
                  <th className="py-3 px-4 font-semibold text-[#5B6472] uppercase tracking-wider text-[11px]">
                    Assigned Role
                  </th>
                  <th className="py-3 px-4 font-semibold text-[#5B6472] uppercase tracking-wider text-[11px]">
                    Question Asked
                  </th>
                  <th className="py-3 px-4 font-semibold text-[#5B6472] uppercase tracking-wider text-[11px]">
                    Grounded Sources Used
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDEFF2]">
                {auditLog.map((log) => (
                  <tr key={log.id} className="hover:bg-[#FBFBFC] transition-colors">
                    <td className="py-3 px-4 font-mono-code text-[#5B6472] whitespace-nowrap">
                      {log.time}
                    </td>
                    <td className="py-3 px-4 font-medium text-[#14213D]">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#EEF1F5] text-[#14213D] text-[11px]">
                        {log.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#14213D] max-w-xs font-sans-body">
                      {log.question}
                    </td>
                    <td className="py-3 px-4 font-mono-code text-[#A6784B] text-[11px]">
                      {log.sources ? (
                        <div className="flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#2F6F4F] shrink-0" />
                          <span>{log.sources}</span>
                        </div>
                      ) : (
                        <span className="text-[#8A93A0] italic">No matching accessible source</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

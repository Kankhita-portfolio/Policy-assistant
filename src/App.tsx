import React, { useState, useEffect } from "react";
import { RoleType, ChatMessage, AuditLogEntry, PolicyDocument } from "./types";
import { ROLES, DOCUMENTS, retrieveChunks } from "./data/policies";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { ChatView } from "./components/ChatView";
import { AuditPanel } from "./components/AuditPanel";
import { PolicyModal } from "./components/PolicyModal";
import { ApiKeyModal } from "./components/ApiKeyModal";

export default function App() {
  const [currentRole, setCurrentRole] = useState<RoleType>(ROLES[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [inputQuery, setInputQuery] = useState<string>("");
  const [showAudit, setShowAudit] = useState<boolean>(false);

  // Key configuration
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem("gemini_policy_api_key") || "";
  });
  const [hasServerKey, setHasServerKey] = useState<boolean>(false);

  // Modals
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState<boolean>(false);
  const [selectedDoc, setSelectedDoc] = useState<PolicyDocument | null>(null);

  // Check health / server key availability on mount
  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        if (data.hasEnvKey) {
          setHasServerKey(true);
        }
      })
      .catch(() => {
        // Dev server or standalone
      });
  }, []);

  const handleSaveApiKey = (newKey: string) => {
    setApiKey(newKey);
    localStorage.setItem("gemini_policy_api_key", newKey);
  };

  const handleOpenDocModalWithDoc = (doc: PolicyDocument) => {
    setSelectedDoc(doc);
    setIsDocsModalOpen(true);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleClearAudit = () => {
    setAuditLog([]);
  };

  const handleAsk = async (questionOverride?: string) => {
    const question = (questionOverride || inputQuery).trim();
    if (!question || loading) return;

    setInputQuery("");
    const userMessage: ChatMessage = {
      id: "msg-" + Date.now() + "-user",
      sender: "user",
      text: question,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    const accessibleDocs = DOCUMENTS.filter((d) => d.roles.includes(currentRole));
    const chunks = retrieveChunks(question, accessibleDocs, 3);

    let answerText = "";
    let sourcesUsed: string[] = [];
    let auditStatus: AuditLogEntry["status"] = "success";

    if (chunks.length === 0) {
      answerText =
        "I don't have information about that in the documents you have access to. This may be covered in a document outside your current role's access, or it may not be documented at all — you may want to check with your manager or Compliance.";
      auditStatus = "restricted";
    } else {
      sourcesUsed = chunks.map((c) => `${c.docName} ¶${c.paraIndex}`);
      const contextBlock = chunks
        .map((c) => `[Source: ${c.docName}, paragraph ${c.paraIndex}]\n${c.text}`)
        .join("\n\n");

      const systemGroundedPrompt = `You are an internal policy assistant. Answer the employee's question using ONLY the context below. Do not use outside knowledge. Cite the source document and paragraph number inline for every claim, like (Expense & Reimbursement Policy ¶2). If the context does not fully answer the question, say so explicitly rather than guessing.\n\nContext:\n${contextBlock}\n\nQuestion: ${question}\n\nGive a concise, direct answer (3-5 sentences max).`;

      // Server-side Gemini API request through /api/ask
      try {
        const response = await fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: systemGroundedPrompt,
            customApiKey: apiKey || undefined,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          answerText =
            data.error ||
            "To get a live answer, configure the GEMINI_API_KEY environment variable on your server/Vercel or click 'Set Gemini API Key' in the top bar.";
          auditStatus = response.status === 401 ? "no-sources" : "error";
        } else {
          answerText = data.text || "Sorry, I couldn't generate an answer just now.";
        }
      } catch (err: any) {
        console.error("Ask error:", err);
        answerText =
          "Something went wrong reaching the policy assistant: " +
          (err.message || "Network error") +
          ". Please ensure your server or Vercel deployment is running.";
        auditStatus = "error";
      }
    }

    const assistantMessage: ChatMessage = {
      id: "msg-" + Date.now() + "-asst",
      sender: "assistant",
      text: answerText,
      sources: sourcesUsed,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, assistantMessage]);

    // Record audit entry
    const newAuditEntry: AuditLogEntry = {
      id: "audit-" + Date.now(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      role: currentRole,
      question,
      sources: sourcesUsed.length > 0 ? sourcesUsed.join(", ") : "No accessible matching source",
      status: auditStatus,
    };

    setAuditLog((prev) => [newAuditEntry, ...prev]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#EEF1F5] font-sans-body">
      {/* Top Banner if API Key is not configured */}
      {!apiKey && !hasServerKey && (
        <div className="bg-[#FFF7E6] border-b border-[#F0DFAE] px-6 py-2.5 text-xs text-[#6B5D2E] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Gemini API Key:</span>
            <span>Provide a Gemini API key to activate live generative Q&A with real-time grounded policy answers.</span>
          </div>
          <button
            onClick={() => setIsApiKeyModalOpen(true)}
            className="px-3 py-1 bg-[#14213D] text-white rounded-md text-xs font-medium hover:bg-[#1E2F54] transition-colors cursor-pointer"
          >
            Enter Key
          </button>
        </div>
      )}

      {/* Main App Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={(role) => setCurrentRole(role)}
        apiKey={apiKey}
        hasServerKey={hasServerKey}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenDocsModal={() => {
          setSelectedDoc(null);
          setIsDocsModalOpen(true);
        }}
      />

      {/* Main Body Area */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        <Sidebar
          documents={DOCUMENTS}
          currentRole={currentRole}
          showAudit={showAudit}
          auditCount={auditLog.length}
          onToggleAudit={() => setShowAudit(!showAudit)}
          onSelectDoc={handleOpenDocModalWithDoc}
        />

        <main className="flex-1 flex flex-col min-w-0 min-h-[500px]">
          {showAudit ? (
            <AuditPanel
              auditLog={auditLog}
              onClearAudit={handleClearAudit}
              onClose={() => setShowAudit(false)}
            />
          ) : (
            <ChatView
              messages={messages}
              loading={loading}
              inputQuery={inputQuery}
              onInputChange={setInputQuery}
              onSend={() => handleAsk()}
              onSelectSampleQuestion={(sq) => {
                setInputQuery(sq);
                handleAsk(sq);
              }}
              onClearChat={handleClearChat}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <PolicyModal
        isOpen={isDocsModalOpen}
        onClose={() => setIsDocsModalOpen(false)}
        documents={DOCUMENTS}
        currentRole={currentRole}
        selectedDoc={selectedDoc}
      />

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
        hasServerKey={hasServerKey}
      />
    </div>
  );
}

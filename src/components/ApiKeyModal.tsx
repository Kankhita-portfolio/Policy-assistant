import React, { useState } from "react";
import { Key, ExternalLink, CheckCircle2, AlertCircle, X } from "lucide-react";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
  hasServerKey: boolean;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
  hasServerKey,
}) => {
  const [tempKey, setTempKey] = useState(apiKey);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveApiKey(tempKey.trim());
    setTestResult(null);
    onClose();
  };

  const handleTestKey = async () => {
    setTesting(true);
    setTestResult(null);

    const keyToTest = tempKey.trim();
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: "Reply with the single word 'OK' to verify API key connectivity.",
          customApiKey: keyToTest || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to verify key");
      }

      setTestResult({
        success: true,
        message: "Key verified successfully! Gemini API responded: " + data.text.trim(),
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || "Failed to connect to Gemini API",
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full flex flex-col overflow-hidden border border-[#D8DCE3]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#D8DCE3] flex items-center justify-between bg-[#F7F8FA]">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-[#14213D]" />
            <h3 className="font-serif-display text-base font-semibold text-[#14213D]">
              Gemini API Key Configuration
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#5B6472] hover:text-[#14213D] hover:bg-[#E5E7EB] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs font-sans-body">
          {hasServerKey && (
            <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg text-[#166534] flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block">Environment Key Detected</strong>
                A default Gemini API key is already configured on the server environment. You can ask policy questions right away!
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#14213D] mb-1.5">
              Custom Gemini API Key (Optional Override)
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                placeholder="AIzaSy..."
                className="flex-1 px-3 py-2 border border-[#C7CDD6] rounded-md bg-[#F7F8FA] text-xs font-mono-code focus:outline-hidden focus:ring-1 focus:ring-[#14213D]"
              />
              <button
                type="button"
                onClick={handleTestKey}
                disabled={testing}
                className="px-3 py-2 bg-[#F0F4FF] text-[#1E3A8A] border border-[#BFDBFE] rounded-md hover:bg-[#DBEAFE] transition-colors disabled:opacity-50 cursor-pointer whitespace-nowrap"
              >
                {testing ? "Testing..." : "Test Key"}
              </button>
            </div>
            <p className="text-[11px] text-[#5B6472] mt-1">
              Your key is kept safe and only used to generate grounded policy responses.
            </p>
          </div>

          {testResult && (
            <div
              className={`p-3 rounded-lg border flex items-start gap-2 ${
                testResult.success
                  ? "bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]"
                  : "bg-[#FEF2F2] text-[#991B1B] border-[#FCA5A5]"
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <span className="leading-snug">{testResult.message}</span>
            </div>
          )}

          {/* Guide */}
          <div className="bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg p-3.5 space-y-2">
            <div className="flex items-center justify-between font-semibold text-[#14213D] text-[11px]">
              <span>How to get a Gemini API Key</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-blue-700 hover:underline flex items-center gap-1 inline-flex"
              >
                <span>Google AI Studio</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[11.5px] text-[#5B6472] leading-relaxed">
              <li>Open Google AI Studio with your Google account.</li>
              <li>Click <strong>"Get API key"</strong> on the left sidebar.</li>
              <li>Click <strong>"Create API key"</strong> and select your project.</li>
              <li>Copy and paste the key above.</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#D8DCE3] bg-[#F7F8FA] flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs text-[#5B6472] hover:text-[#14213D] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 text-xs font-medium bg-[#14213D] text-white rounded-md hover:bg-[#1E2F54] transition-colors cursor-pointer"
          >
            Save Key
          </button>
        </div>
      </div>
    </div>
  );
};

export type RoleType =
  | "Employee (General Access)"
  | "Compliance Officer"
  | "Engineering"
  | "People & HR";

export interface PolicyDocument {
  id: string;
  name: string;
  category: string;
  roles: RoleType[];
  paragraphs: string[];
}

export interface RetrievedChunk {
  docName: string;
  paraIndex: number;
  text: string;
  score: number;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  sources?: string[];
  timestamp: string;
}

export interface AuditLogEntry {
  id: string;
  time: string;
  role: RoleType;
  question: string;
  sources: string;
  status: "success" | "restricted" | "no-sources" | "error";
}

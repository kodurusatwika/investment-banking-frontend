import { User } from "./user.model";

export enum DealType {
  M_A = 'M_A',
  EQUITY_FINANCING = 'EQUITY_FINANCING',
  DEBT_OFFERING = 'DEBT_OFFERING',
  IPO = 'IPO'
}

export enum DealStage {
  PROSPECT = 'PROSPECT',
  UNDER_EVALUATION = 'UNDER_EVALUATION',
  TERM_SHEET_SUBMITTED = 'TERM_SHEET_SUBMITTED',
  CLOSED = 'CLOSED',
  LOST = 'LOST'
}

export interface Note {
  id: number;
  note: string;
  user: User;
  timestamp: string;
}

export interface Deal {
  id: number;
  clientName: string;
  dealType: DealType;
  sector: string;
  dealValue: number | null;
  currentStage: DealStage;
  summary: string;
  notes: Note[];
  createdBy: User;
  assignedTo: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDeal {
  clientName: string;
  dealType: DealType;
  sector: string;
  currentStage: DealStage;
  summary: string;
  assignedToId: number;
}

export interface AddNote {
  note: string;
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
}
export interface OCDItem {
  id: number;
  description: string;
  subtype: string | null;
  current: boolean;
  created_at: string;
}

export interface Subtype {
  id: number;
  name: string;
  created_at: string;
}

export interface GAD7Score {
  id: number;
  score: number;
  created_at: string;
}

export interface DeleteModalProps {
  subtypeName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface SymptomListProps {
  items: OCDItem[];
  onDelete: (id: number) => void;
} 
export type SessionAuth = {
  id?: string;
  nameSession: string;
};

export interface GlobalContextType {
  dataSession: SessionAuth | null;
  isLoading: boolean;
  setDataSession: (sessionData: SessionAuth) => void;
}

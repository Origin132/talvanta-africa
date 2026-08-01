export type AccountType = "candidate" | "employer";
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type ProfileRow = { id: string; full_name: string; account_type: AccountType; onboarding_completed: boolean; created_at: string; updated_at: string };
type CandidateRow = { user_id: string; phone: string | null; current_location: string | null; professional_title: string | null; years_of_experience: number | null; professional_summary: string | null; linkedin_url: string | null; portfolio_url: string | null; preferred_roles: string[] | null; preferred_locations: string[] | null; preferred_employment_types: string[] | null; preferred_workplace_types: string[] | null; created_at: string; updated_at: string };
type EmployerRow = { user_id: string; organisation_name: string | null; organisation_website: string | null; industry: string | null; organisation_size: string | null; contact_role: string | null; phone: string | null; organisation_location: string | null; organisation_summary: string | null; created_at: string; updated_at: string };
type CandidateDocumentRow = { id: string; user_id: string; document_type: "cv"; bucket_name: "candidate-cvs"; storage_path: string; original_filename: string; stored_filename: string; mime_type: "application/pdf"; file_size_bytes: number; uploaded_at: string; updated_at: string };

export type Database = {
  public: {
    Tables: {
      profiles: { Row: ProfileRow; Insert: { id: string; full_name: string; account_type: AccountType; onboarding_completed?: boolean; created_at?: string; updated_at?: string }; Update: Partial<Omit<ProfileRow, "id" | "account_type" | "created_at">>; Relationships: [] };
      candidate_profiles: { Row: CandidateRow; Insert: { user_id: string } & Partial<Omit<CandidateRow, "user_id" | "created_at" | "updated_at">>; Update: Partial<Omit<CandidateRow, "user_id" | "created_at">>; Relationships: [] };
      employer_profiles: { Row: EmployerRow; Insert: { user_id: string } & Partial<Omit<EmployerRow, "user_id" | "created_at" | "updated_at">>; Update: Partial<Omit<EmployerRow, "user_id" | "created_at">>; Relationships: [] };
      candidate_documents: { Row: CandidateDocumentRow; Insert: Omit<CandidateDocumentRow, "uploaded_at" | "updated_at"> & { uploaded_at?: string; updated_at?: string }; Update: Partial<Omit<CandidateDocumentRow, "id" | "user_id" | "uploaded_at">>; Relationships: [] };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
export type CandidateProfile = Database["public"]["Tables"]["candidate_profiles"]["Row"];
export type CandidateProfileInsert = Database["public"]["Tables"]["candidate_profiles"]["Insert"];
export type CandidateProfileUpdate = Database["public"]["Tables"]["candidate_profiles"]["Update"];
export type EmployerProfile = Database["public"]["Tables"]["employer_profiles"]["Row"];
export type EmployerProfileInsert = Database["public"]["Tables"]["employer_profiles"]["Insert"];
export type EmployerProfileUpdate = Database["public"]["Tables"]["employer_profiles"]["Update"];
export type CandidateDocument = Database["public"]["Tables"]["candidate_documents"]["Row"];
export type CandidateDocumentInsert = Database["public"]["Tables"]["candidate_documents"]["Insert"];
export type CandidateDocumentUpdate = Database["public"]["Tables"]["candidate_documents"]["Update"];

export type AccountType = "candidate" | "employer";
export type ApplicationRole = "admin";
export type RecruitmentRequestStatus = "draft" | "submitted" | "under-review" | "clarification-required" | "accepted" | "declined" | "withdrawn" | "closed";
export type VacancyStatus = "draft" | "published" | "closing-soon" | "closed" | "archived";
export type JobApplicationStatus = "submitted" | "under-review" | "shortlisted" | "interview" | "offer" | "unsuccessful" | "withdrawn" | "hired";
export type JobApplicationChangeSource = "candidate" | "administrator" | "employer" | "system";
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type ProfileRow = { id: string; full_name: string; account_type: AccountType; onboarding_completed: boolean; created_at: string; updated_at: string };
type CandidateRow = { user_id: string; phone: string | null; current_location: string | null; professional_title: string | null; years_of_experience: number | null; professional_summary: string | null; linkedin_url: string | null; portfolio_url: string | null; preferred_roles: string[] | null; preferred_locations: string[] | null; preferred_employment_types: string[] | null; preferred_workplace_types: string[] | null; created_at: string; updated_at: string };
type EmployerRow = { user_id: string; organisation_name: string | null; organisation_website: string | null; industry: string | null; organisation_size: string | null; contact_role: string | null; phone: string | null; organisation_location: string | null; organisation_summary: string | null; created_at: string; updated_at: string };
type CandidateDocumentRow = { id: string; user_id: string; document_type: "cv"; bucket_name: "candidate-cvs"; storage_path: string; original_filename: string; stored_filename: string; mime_type: "application/pdf"; file_size_bytes: number; uploaded_at: string; updated_at: string };
type RecruitmentRequestRow = { id: string; employer_user_id: string; organisation_name: string; job_title: string; department: string | null; employment_type: string | null; workplace_type: string | null; number_of_positions: number | null; job_location: string | null; preferred_start_date: string | null; recruitment_timeline: string | null; salary_range: string | null; role_summary: string | null; responsibilities: string[] | null; required_skills: string[] | null; required_experience: string | null; education_requirements: string | null; preferred_service: string | null; additional_information: string | null; status: RecruitmentRequestStatus; submitted_at: string | null; withdrawn_at: string | null; created_at: string; updated_at: string };
type UserRoleRow = { id: string; user_id: string; role: ApplicationRole; created_at: string };
type VacancyRow = { id: string; recruitment_request_id: string | null; employer_user_id: string | null; created_by_admin_user_id: string | null; slug: string; job_title: string; organisation_name: string; department: string | null; employment_type: string; workplace_type: string; job_location: string; number_of_positions: number; salary_range: string | null; role_summary: string; responsibilities: string[] | null; required_skills: string[] | null; required_experience: string | null; education_requirements: string | null; application_instructions: string | null; status: VacancyStatus; applications_open: boolean; published_at: string | null; closes_at: string | null; created_at: string | null; updated_at: string | null };
type JobApplicationRow = { id: string; vacancy_id: string; candidate_user_id: string; candidate_document_id: string | null; cover_note: string | null; status: JobApplicationStatus; submitted_at: string; withdrawn_at: string | null; created_at: string; updated_at: string };
type JobApplicationStatusHistoryRow = { id: string; application_id: string; previous_status: JobApplicationStatus | null; new_status: JobApplicationStatus; changed_by_user_id: string | null; change_source: JobApplicationChangeSource; public_note: string | null; created_at: string };

export type Database = {
  public: {
    Tables: {
      profiles: { Row: ProfileRow; Insert: { id: string; full_name: string; account_type: AccountType; onboarding_completed?: boolean; created_at?: string; updated_at?: string }; Update: Partial<Omit<ProfileRow, "id" | "account_type" | "created_at">>; Relationships: [] };
      candidate_profiles: { Row: CandidateRow; Insert: { user_id: string } & Partial<Omit<CandidateRow, "user_id" | "created_at" | "updated_at">>; Update: Partial<Omit<CandidateRow, "user_id" | "created_at">>; Relationships: [] };
      employer_profiles: { Row: EmployerRow; Insert: { user_id: string } & Partial<Omit<EmployerRow, "user_id" | "created_at" | "updated_at">>; Update: Partial<Omit<EmployerRow, "user_id" | "created_at">>; Relationships: [] };
      candidate_documents: { Row: CandidateDocumentRow; Insert: Omit<CandidateDocumentRow, "uploaded_at" | "updated_at"> & { uploaded_at?: string; updated_at?: string }; Update: Partial<Omit<CandidateDocumentRow, "id" | "user_id" | "uploaded_at">>; Relationships: [] };
      recruitment_requests: { Row: RecruitmentRequestRow; Insert: { id: string; employer_user_id: string; organisation_name: string; job_title: string; status: RecruitmentRequestStatus; created_at?: string; updated_at?: string } & Partial<Omit<RecruitmentRequestRow, "id" | "employer_user_id" | "organisation_name" | "job_title" | "status" | "created_at" | "updated_at">>; Update: Partial<Omit<RecruitmentRequestRow, "id" | "employer_user_id" | "created_at">>; Relationships: [] };
      user_roles: { Row: UserRoleRow; Insert: { id?: string; user_id: string; role: ApplicationRole; created_at?: string }; Update: Partial<UserRoleRow>; Relationships: [] };
      vacancies: { Row: VacancyRow; Insert: { id?: string; slug: string; job_title: string; organisation_name: string; employment_type: string; workplace_type: string; job_location: string; number_of_positions: number; role_summary: string; status: VacancyStatus; applications_open: boolean; recruitment_request_id?: string | null; employer_user_id?: string | null; created_by_admin_user_id?: string | null; department?: string | null; salary_range?: string | null; responsibilities?: string[] | null; required_skills?: string[] | null; required_experience?: string | null; education_requirements?: string | null; application_instructions?: string | null; published_at?: string | null; closes_at?: string | null; created_at?: string | null; updated_at?: string | null }; Update: Partial<VacancyRow>; Relationships: [] };
      job_applications: { Row: JobApplicationRow; Insert: { id?: string; vacancy_id: string; candidate_user_id: string; candidate_document_id?: string | null; cover_note?: string | null; status?: JobApplicationStatus; submitted_at?: string; withdrawn_at?: string | null; created_at?: string; updated_at?: string }; Update: Partial<Omit<JobApplicationRow, "id" | "vacancy_id" | "candidate_user_id" | "created_at">>; Relationships: [] };
      job_application_status_history: { Row: JobApplicationStatusHistoryRow; Insert: { id?: string; application_id: string; previous_status?: JobApplicationStatus | null; new_status: JobApplicationStatus; changed_by_user_id?: string | null; change_source: JobApplicationChangeSource; public_note?: string | null; created_at?: string }; Update: Partial<Omit<JobApplicationStatusHistoryRow, "id" | "application_id" | "created_at">>; Relationships: [] };
    };
    Views: Record<string, never>;
    Functions: { has_role: { Args: { requested_role: ApplicationRole }; Returns: boolean } };
    Enums: { application_role: ApplicationRole; vacancy_status: VacancyStatus; job_application_status: JobApplicationStatus };
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
export type RecruitmentRequest = Database["public"]["Tables"]["recruitment_requests"]["Row"];
export type RecruitmentRequestInsert = Database["public"]["Tables"]["recruitment_requests"]["Insert"];
export type RecruitmentRequestUpdate = Database["public"]["Tables"]["recruitment_requests"]["Update"];
export type UserRole = Database["public"]["Tables"]["user_roles"]["Row"];
export type UserRoleInsert = Database["public"]["Tables"]["user_roles"]["Insert"];
export type UserRoleUpdate = Database["public"]["Tables"]["user_roles"]["Update"];
export type Vacancy = Database["public"]["Tables"]["vacancies"]["Row"];
export type VacancyInsert = Database["public"]["Tables"]["vacancies"]["Insert"];
export type VacancyUpdate = Database["public"]["Tables"]["vacancies"]["Update"];
export type JobApplication = Database["public"]["Tables"]["job_applications"]["Row"];
export type JobApplicationInsert = Database["public"]["Tables"]["job_applications"]["Insert"];
export type JobApplicationUpdate = Database["public"]["Tables"]["job_applications"]["Update"];
export type JobApplicationStatusHistory = Database["public"]["Tables"]["job_application_status_history"]["Row"];
export type JobApplicationStatusHistoryInsert = Database["public"]["Tables"]["job_application_status_history"]["Insert"];
export type JobApplicationStatusHistoryUpdate = Database["public"]["Tables"]["job_application_status_history"]["Update"];

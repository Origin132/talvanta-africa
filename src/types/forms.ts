export type FormErrors = Record<string, string>;

export type SubmissionState = "idle" | "loading" | "success" | "failure";

export type SubmissionFeedback = {
  message: string;
  reference?: string;
};

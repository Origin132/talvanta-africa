import type { FormErrors } from "@/types/forms";

export type SubmissionSuccessResponse = {
  success: true;
  message: string;
  submissionId: string;
};

export type SubmissionValidationResponse = {
  success: false;
  message: string;
  fieldErrors: FormErrors;
};

export type SubmissionFailureResponse = {
  success: false;
  message: string;
};

export type SubmissionApiResponse =
  | SubmissionSuccessResponse
  | SubmissionValidationResponse
  | SubmissionFailureResponse;

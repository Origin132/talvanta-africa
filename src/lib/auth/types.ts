export type AuthFieldErrors = Record<string, string>;

export type AuthActionState = {
  status: "idle" | "error" | "success";
  message?: string;
  errors?: AuthFieldErrors;
};

export const initialAuthState: AuthActionState = { status: "idle" };

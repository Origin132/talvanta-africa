export type TaliaRole = "user" | "assistant";

export type TaliaInternalLink = {
  label: string;
  href: string;
};

export type TaliaMessage = {
  id: string;
  role: TaliaRole;
  content: string;
  internalLink?: TaliaInternalLink;
};

export type TaliaRequestMessage = Pick<TaliaMessage, "role" | "content">;

export type TaliaApiSuccess = {
  success: true;
  message: Omit<TaliaMessage, "id">;
};

export type TaliaApiFailure = {
  success: false;
  message: string;
  fieldErrors?: {
    messages?: string;
  };
};

export type TaliaApiResponse = TaliaApiSuccess | TaliaApiFailure;

export type TaliaResponse = {
  content: string;
  internalLink?: TaliaInternalLink;
};

export interface Member {
  id: number;
  email: string;
  name: string;
  user_id: number;
  organization_id: number;
  created_at: string;
  updated_at: string;
  invited_at: string | null;
  invitation_key: string | null;
  joined_at: string | null;
  archived_number: number;
  archived_at: string | null;
  initial: string;
  color: string;
  status: string;
  localized_status: string;
  org_admin: boolean;
  translations: {
    name: {
      en: string;
      fa: string;
    };
  };
}

// Type for member status
export type MemberStatus = 'not_invited' | 'invited' | 'joined' | 'archived';

// Form data for creating/updating a member
export interface MemberFormData {
  email: string;
  name: string;        // In current locale
  initial: string;
  color: string;
}

// API request for creating a member
export interface CreateMemberRequest {
  email: string;
  name_en: string;
  name_fa: string;
  initial: string;
  color: string;
  invite?: boolean;    // If true, send invitation email
}
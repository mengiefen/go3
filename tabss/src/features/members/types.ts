export type MemberStatus = 'not_invited' | 'invited' | 'joined' | 'archived';

export interface Member {
  id: string;
  email: string;
  name: string;
  user_id: string | null;
  organization_id: string;
  created_at: string;
  updated_at: string;
  invited_at: string | null;
  invitation_key: string | null;
  joined_at: string | null;
  archived_at: string | null;
  archived_number: number | null;
  initial: string;
  color: string;
  status: MemberStatus;
  localized_status: string;
  org_admin: boolean;
  translations: {
    name: { en: string; fa: string };
  };
}

export interface CreateMemberRequest {
  name_en: string;
  name_fa?: string;
  email: string;
  initial: string;
  color: string;
  invite?: boolean;
  invitation_key?: string;
}

export interface UpdateMemberRequest {
  name_en?: string;
  name_fa?: string;
  initial?: string;
  color?: string;
}

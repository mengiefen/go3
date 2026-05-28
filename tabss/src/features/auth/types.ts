export interface SignUpRequest {
  email: string;
  first_name: string;
  last_name: string;
  timezone: string;
  locale: string;
}

export interface UserResponse {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  timezone: string;
  locale: string;
  confirmation_sent_at?: string;
}

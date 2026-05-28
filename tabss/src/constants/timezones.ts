export const timezones = [
  'UTC'
] as const;

export type Timezone = typeof timezones[number];
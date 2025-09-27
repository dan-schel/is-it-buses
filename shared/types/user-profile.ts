export type UserProfile = {
  username: string;
  rank: string;
  permissions: {
    canCreateUsers: boolean;
  };
};

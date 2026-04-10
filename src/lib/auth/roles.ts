export type AppRole = "employee" | "candidate";

export const isAppRole = (value: unknown): value is AppRole => {
  return value === "employee" || value === "candidate";
};

export const getRoleFromUser = (user: {
  user_metadata?: Record<string, unknown> | null;
  app_metadata?: Record<string, unknown> | null;
} | null): AppRole | null => {
  if (!user) {
    return null;
  }

  const roleFromUserMetadata = user.user_metadata?.role;
  if (isAppRole(roleFromUserMetadata)) {
    return roleFromUserMetadata;
  }

  const roleFromAppMetadata = user.app_metadata?.role;
  if (isAppRole(roleFromAppMetadata)) {
    return roleFromAppMetadata;
  }

  return null;
};

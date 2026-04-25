export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const whitelist = process.env.ADMIN_EMAILS;
  if (!whitelist) return false;
  const normalized = email.trim().toLowerCase();
  return whitelist
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
    .includes(normalized);
}

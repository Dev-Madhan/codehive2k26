export const BOOTSTRAP_ADMIN_EMAIL = "jeeviththunderjoe@gmail.com";

export function isBootstrapAdminEmail(email: string): boolean {
  return email.trim().toLowerCase() === BOOTSTRAP_ADMIN_EMAIL;
}

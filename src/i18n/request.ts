import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => {
  const defaultLocale = locale || "vi";

  // Tải các bản dịch
  const login = (await import(`@messages/${defaultLocale}/login.json`)).default;
  const profile = (await import(`@messages/${defaultLocale}/profile.json`)).default;

  return {
    locale: defaultLocale,
    messages: { login, profile },
  };
});

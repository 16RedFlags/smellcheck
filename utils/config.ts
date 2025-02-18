export const config = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  isDevelopment: process.env.NODE_ENV === "development",
  allowedOrigins: [
    "http://localhost:3000",
    "https://smellcheck.vercel.app",
    "https://smellcheck-16redflags.vercel.app",
    "https://smellcheck-git-main-16redflags.vercel.app",
  ] as string[],
} as const;

// Validate config
Object.entries(config).forEach(([key, value]) => {
  if (value === undefined) {
    throw new Error(`Missing required config: ${key}`);
  }
});

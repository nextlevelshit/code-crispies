import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is configured
export const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Only create client if configured
const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Auth helpers - all return null/rejected promise if not configured
export const auth = {
  signUp: (email, password) =>
    supabase?.auth.signUp({ email, password }) ??
    Promise.resolve({ data: null, error: { message: "Not configured" } }),

  signIn: (email, password) =>
    supabase?.auth.signInWithPassword({ email, password }) ??
    Promise.resolve({ data: null, error: { message: "Not configured" } }),

  signOut: () =>
    supabase?.auth.signOut() ??
    Promise.resolve({ error: null }),

  resetPassword: (email) =>
    supabase?.auth.resetPasswordForEmail(email) ??
    Promise.resolve({ data: null, error: { message: "Not configured" } }),

  signInWithGoogle: () =>
    supabase?.auth.signInWithOAuth({ provider: "google" }) ??
    Promise.resolve({ data: null, error: { message: "Not configured" } }),

  signInWithGitHub: () =>
    supabase?.auth.signInWithOAuth({ provider: "github" }) ??
    Promise.resolve({ data: null, error: { message: "Not configured" } }),

  getUser: () =>
    supabase?.auth.getUser() ??
    Promise.resolve({ data: { user: null }, error: null }),

  getSession: () =>
    supabase?.auth.getSession() ??
    Promise.resolve({ data: { session: null }, error: null }),

  onAuthStateChange: (callback) =>
    supabase?.auth.onAuthStateChange(callback) ?? { data: { subscription: { unsubscribe: () => {} } } },

  deleteAccount: async () => {
    if (!supabase) return { error: { message: "Not configured" } };
    const { error } = await supabase.rpc("delete_own_account");
    return { error };
  },
};

// Progress sync helpers
export const progressDB = {
  async load(userId) {
    if (!supabase) return { data: null, error: { message: "Not configured" } };
    const { data, error } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userId)
      .single();
    return { data, error };
  },

  async save(userId, progress, userCode, settings, language) {
    if (!supabase) return { error: { message: "Not configured" } };
    const { error } = await supabase.from("user_progress").upsert(
      {
        user_id: userId,
        progress,
        user_code: userCode,
        settings,
        language,
      },
      { onConflict: "user_id" }
    );
    return { error };
  },
};

// Newsletter subscription helper
export const newsletter = {
  async subscribe(email) {
    if (!supabase) return { error: { message: "Not configured" } };
    // Use insert with ignoreDuplicates since RLS only allows INSERT
    const { error } = await supabase.from("newsletter_subscribers").insert(
      {
        email: email.toLowerCase().trim(),
        subscribed_at: new Date().toISOString(),
      },
      { onConflict: "email", ignoreDuplicates: true }
    );
    // Ignore duplicate email errors (already subscribed)
    if (error?.code === "23505") return { error: null };
    return { error };
  },
};

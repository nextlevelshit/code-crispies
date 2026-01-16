import { t, applyTranslations } from "./i18n.js";

let currentUser = null;
let lessonEngineRef = null;
let authModule = null;
let progressModule = null;
let supabaseAvailable = false;

/**
 * Initialize the auth system
 * @param {Object} engine - The LessonEngine instance
 */
export async function initAuth(engine) {
  lessonEngineRef = engine;

  // Try to load Supabase - if not configured, auth is disabled
  try {
    const supabaseModule = await import("./supabase.js");

    // Check if Supabase is configured via environment variables
    if (!supabaseModule.isConfigured) {
      console.log("Supabase not configured - auth disabled");
      hideAuthUI();
      return;
    }

    authModule = supabaseModule.auth;
    progressModule = supabaseModule.progressDB;
    supabaseAvailable = true;
  } catch (e) {
    console.log("Supabase not available - auth disabled:", e.message);
    hideAuthUI();
    return;
  }

  // Check initial session
  try {
    const { data } = await authModule.getUser();
    if (data?.user) handleLogin(data.user);
  } catch (e) {
    console.log("Auth check failed:", e.message);
  }

  // Listen for auth changes
  authModule.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN" && session?.user) {
      handleLogin(session.user);
    } else if (event === "SIGNED_OUT") {
      handleLogout();
    }
  });

  // Attach form handlers
  setupAuthForms();
}

function hideAuthUI() {
  document.getElementById("auth-trigger-header")?.classList.add("hidden");
  document.querySelector(".sidebar-auth-box")?.classList.add("hidden");
}

async function handleLogin(user) {
  currentUser = user;
  updateAuthUI(user);

  if (!progressModule) return;

  // Load cloud progress
  const { data } = await progressModule.load(user.id);

  if (data) {
    // Merge with localStorage (cloud wins for conflicts)
    mergeProgress(data);
  } else {
    // First login: upload localStorage to cloud
    await syncToCloud();
  }
}

function handleLogout() {
  currentUser = null;
  updateAuthUI(null);
  // Keep localStorage progress, just disconnect from cloud
}

function updateAuthUI(user) {
  // Header elements
  const authTriggerHeader = document.getElementById("auth-trigger-header");
  const userEmailHeader = document.getElementById("user-email-header");

  // Sidebar elements
  const authTriggerSidebar = document.getElementById("auth-trigger-sidebar");
  const userMenuSidebar = document.getElementById("user-menu-sidebar");
  const userEmailSidebar = document.getElementById("user-email-sidebar");
  const sidebarHint = document.querySelector(".sidebar-auth-hint");

  if (user) {
    authTriggerHeader?.classList.add("hidden");
    userEmailHeader?.classList.remove("hidden");
    authTriggerSidebar?.classList.add("hidden");
    userMenuSidebar?.classList.remove("hidden");
    sidebarHint?.classList.add("hidden");
    if (userEmailHeader) userEmailHeader.textContent = user.email;
    if (userEmailSidebar) userEmailSidebar.textContent = user.email;
  } else {
    authTriggerHeader?.classList.remove("hidden");
    userEmailHeader?.classList.add("hidden");
    authTriggerSidebar?.classList.remove("hidden");
    userMenuSidebar?.classList.add("hidden");
    sidebarHint?.classList.remove("hidden");
  }
}

export async function syncToCloud() {
  if (!currentUser || !progressModule) return;

  const progress = JSON.parse(
    localStorage.getItem("codeCrispies.progress") || "{}"
  );
  const userCodeEntries = JSON.parse(
    localStorage.getItem("codeCrispies.userCode") || "[]"
  );
  const userCode = Object.fromEntries(userCodeEntries);
  const settings = JSON.parse(
    localStorage.getItem("codeCrispies.settings") || "{}"
  );
  const language = localStorage.getItem("codeCrispies.language") || "en";

  await progressModule.save(currentUser.id, progress, userCode, settings, language);
}

function mergeProgress(cloudData) {
  // Update localStorage with cloud data
  localStorage.setItem(
    "codeCrispies.progress",
    JSON.stringify(cloudData.progress)
  );
  localStorage.setItem(
    "codeCrispies.userCode",
    JSON.stringify(Object.entries(cloudData.user_code))
  );
  localStorage.setItem(
    "codeCrispies.settings",
    JSON.stringify(cloudData.settings)
  );
  localStorage.setItem("codeCrispies.language", cloudData.language);

  // Reload engine state
  if (lessonEngineRef) {
    lessonEngineRef.loadUserProgress();
    lessonEngineRef.loadUserCodeFromStorage();
  }
}

export function isLoggedIn() {
  return supabaseAvailable && currentUser !== null;
}

export function getCurrentUser() {
  return currentUser;
}

// Debounce utility
function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// Export debounced sync for use by LessonEngine
export const debouncedSyncToCloud = debounce(() => syncToCloud(), 2000);

function setupAuthForms() {
  const authDialog = document.getElementById("auth-dialog");
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const resetForm = document.getElementById("reset-form");

  // Form submissions
  loginForm?.addEventListener("submit", handleLoginSubmit);
  signupForm?.addEventListener("submit", handleSignupSubmit);
  resetForm?.addEventListener("submit", handleResetSubmit);

  // Form switchers
  document
    .getElementById("show-signup")
    ?.addEventListener("click", () => switchForm("signup"));
  document
    .getElementById("show-login")
    ?.addEventListener("click", () => switchForm("login"));
  document
    .getElementById("show-reset")
    ?.addEventListener("click", () => switchForm("reset"));

  // Dialog triggers (both header and sidebar)
  document
    .getElementById("auth-trigger-header")
    ?.addEventListener("click", () => {
      authDialog?.showModal();
    });
  document
    .getElementById("auth-trigger-sidebar")
    ?.addEventListener("click", () => {
      authDialog?.showModal();
    });

  // Logout button (sidebar only)
  document
    .getElementById("logout-btn-sidebar")
    ?.addEventListener("click", async () => {
      await authModule?.signOut();
    });

  // Delete account button and dialog
  const deleteDialog = document.getElementById("delete-account-dialog");

  document
    .getElementById("delete-account-btn")
    ?.addEventListener("click", () => {
      deleteDialog?.showModal();
    });

  document
    .getElementById("cancel-delete")
    ?.addEventListener("click", () => {
      deleteDialog?.close();
    });

  document
    .getElementById("delete-dialog-close")
    ?.addEventListener("click", () => {
      deleteDialog?.close();
    });

  deleteDialog?.addEventListener("click", (e) => {
    if (e.target === deleteDialog) deleteDialog.close();
  });

  document
    .getElementById("confirm-delete")
    ?.addEventListener("click", async () => {
      const errorEl = document.getElementById("delete-account-error");
      const confirmBtn = document.getElementById("confirm-delete");

      confirmBtn.disabled = true;

      const { error } = await authModule.deleteAccount();

      if (error) {
        errorEl.textContent = error.message;
        errorEl.classList.remove("hidden");
        confirmBtn.disabled = false;
      } else {
        errorEl.classList.add("hidden");
        deleteDialog.close();
        // Sign out and clear local state
        await authModule.signOut();
      }
    });

  // OAuth buttons
  document.getElementById("google-login")?.addEventListener("click", () => {
    authModule?.signInWithGoogle();
  });

  document.getElementById("github-login")?.addEventListener("click", () => {
    authModule?.signInWithGitHub();
  });

  // Close dialog on backdrop click
  authDialog?.addEventListener("click", (e) => {
    if (e.target === authDialog) authDialog.close();
  });

  // Close button
  authDialog?.querySelector(".close-dialog")?.addEventListener("click", () => {
    authDialog.close();
  });
}

async function handleLoginSubmit(e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const errorEl = document.getElementById("login-error");
  const submitBtn = e.target.querySelector('button[type="submit"]');

  // Disable button while processing
  submitBtn.disabled = true;

  const { error } = await authModule.signIn(email, password);

  submitBtn.disabled = false;

  if (error) {
    errorEl.textContent = error.message;
    errorEl.classList.remove("hidden");
  } else {
    errorEl.classList.add("hidden");
    document.getElementById("auth-dialog").close();
  }
}

async function handleSignupSubmit(e) {
  e.preventDefault();
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const confirm = document.getElementById("signup-confirm").value;
  const errorEl = document.getElementById("signup-error");
  const submitBtn = e.target.querySelector('button[type="submit"]');

  if (password !== confirm) {
    errorEl.textContent = t("authPasswordMismatch") || "Passwords do not match";
    errorEl.classList.remove("hidden");
    return;
  }

  // Disable button while processing
  submitBtn.disabled = true;

  const { error } = await authModule.signUp(email, password);

  submitBtn.disabled = false;

  if (error) {
    errorEl.textContent = error.message;
    errorEl.classList.remove("hidden");
    document.getElementById("signup-success")?.classList.add("hidden");
  } else {
    errorEl.classList.add("hidden");
    // Show success message
    const successEl = document.getElementById("signup-success");
    successEl?.classList.remove("hidden");
    // Hide the form fields and button
    e.target.querySelectorAll(".form-field, button[type='submit']").forEach(el => {
      el.classList.add("hidden");
    });
  }
}

async function handleResetSubmit(e) {
  e.preventDefault();
  const email = document.getElementById("reset-email").value;
  const errorEl = document.getElementById("reset-error");
  const successEl = document.getElementById("reset-success");
  const submitBtn = e.target.querySelector('button[type="submit"]');

  // Disable button while processing
  submitBtn.disabled = true;

  const { error } = await authModule.resetPassword(email);

  submitBtn.disabled = false;

  if (error) {
    errorEl.textContent = error.message;
    errorEl.classList.remove("hidden");
    successEl.classList.add("hidden");
  } else {
    errorEl.classList.add("hidden");
    successEl.classList.remove("hidden");
  }
}

function switchForm(formName) {
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const resetForm = document.getElementById("reset-form");
  const showSignup = document.getElementById("show-signup");
  const showLogin = document.getElementById("show-login");
  const showReset = document.getElementById("show-reset");
  const titleEl = document.getElementById("auth-dialog-title");
  const socialSection = document.querySelector(".auth-social");

  // Hide all forms
  loginForm?.classList.add("hidden");
  signupForm?.classList.add("hidden");
  resetForm?.classList.add("hidden");

  // Show the selected form
  if (formName === "login") {
    loginForm?.classList.remove("hidden");
    showSignup?.classList.remove("hidden");
    showLogin?.classList.add("hidden");
    showReset?.classList.remove("hidden");
    socialSection?.classList.remove("hidden");
    if (titleEl) titleEl.setAttribute("data-i18n", "authLogin");
  } else if (formName === "signup") {
    signupForm?.classList.remove("hidden");
    // Reset signup form to initial state (in case it was showing success)
    signupForm?.querySelectorAll(".form-field, button[type='submit']").forEach(el => {
      el.classList.remove("hidden");
    });
    signupForm?.reset();
    showSignup?.classList.add("hidden");
    showLogin?.classList.remove("hidden");
    showReset?.classList.add("hidden");
    socialSection?.classList.remove("hidden");
    if (titleEl) titleEl.setAttribute("data-i18n", "authSignUp");
  } else if (formName === "reset") {
    resetForm?.classList.remove("hidden");
    showSignup?.classList.add("hidden");
    showLogin?.classList.remove("hidden");
    showReset?.classList.add("hidden");
    socialSection?.classList.add("hidden");
    if (titleEl) titleEl.setAttribute("data-i18n", "authResetPassword");
  }

  // Clear error messages
  document.getElementById("login-error")?.classList.add("hidden");
  document.getElementById("signup-error")?.classList.add("hidden");
  document.getElementById("reset-error")?.classList.add("hidden");
  document.getElementById("reset-success")?.classList.add("hidden");

  // Apply translations to updated elements
  applyTranslations();
}

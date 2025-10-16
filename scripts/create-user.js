// Script to create a test user in Supabase
// Run this with: node scripts/create-user.js

const { createClient } = require("@supabase/supabase-js");

// You need to set these environment variables or replace with your actual values
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://izjnryuoujzfxjyptnli.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error("Please set SUPABASE_SERVICE_ROLE_KEY environment variable");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTestUser() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: "admin@example.com",
    password: "password123",
    email_confirm: true,
  });

  if (error) {
    console.error("Error creating user:", error);
  } else {
    console.log("User created successfully:", data.user);
  }
}

createTestUser();

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Load environment variables from .env.local
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...valueParts] = trimmed.split("=");
      const value = valueParts.join("=");
      if (key) {
        process.env[key.trim()] = value.trim();
      }
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  console.error("URL:", supabaseUrl ? "✓" : "✗");
  console.error("Key:", supabaseKey ? "✓" : "✗");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Get or create test users
    const testUsers = [
      {
        email: "designer@example.com",
        profile: {
          full_name: "Sarah Designer",
          headline: "UI/UX Designer | Creative",
          university: "Tech University",
          major: "Design",
          year: "3rd Year",
          bio: "Passionate about creating beautiful and functional user experiences.",
        },
      },
      {
        email: "developer@example.com",
        profile: {
          full_name: "Alex Developer",
          headline: "Full Stack Developer | Tech Enthusiast",
          university: "Tech University",
          major: "Computer Science",
          year: "2nd Year",
          bio: "Love building scalable applications and learning new technologies.",
        },
      },
      {
        email: "student@example.com",
        profile: {
          full_name: "Jordan Student",
          headline: "Computer Science Student",
          university: "Tech University",
          major: "Computer Science",
          year: "1st Year",
          bio: "Always eager to collaborate and learn from experienced professionals.",
        },
      },
    ];

    const userIds: string[] = [];

    for (const testUser of testUsers) {
      try {
        // Check if user already exists
        const { data: existingUser } = await supabase
          .from("user_profiles")
          .select("user_id")
          .eq("full_name", testUser.profile.full_name)
          .single();

        if (!existingUser) {
          // Create auth user
          const { data: authUser, error: authError } =
            await supabase.auth.admin.createUser({
              email: testUser.email,
              password: "TestPassword123!",
              email_confirm: true,
            });

          if (authError) {
            console.warn(`⚠️  User ${testUser.email} exists or error:`, authError.message);
          } else if (authUser?.user?.id) {
            userIds.push(authUser.user.id);

            // Create user profile
            const { error: profileError } = await supabase
              .from("user_profiles")
              .insert({
                user_id: authUser.user.id,
                ...testUser.profile,
                verified: false,
                rating: 5.0,
                endorsements: 0,
                avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${testUser.email}`,
              });

            if (profileError) {
              console.warn(`⚠️  Error creating profile for ${testUser.email}:`, profileError.message);
            } else {
              console.log(`✅ Created user: ${testUser.profile.full_name} (${testUser.email})`);
            }
          }
        } else {
          console.log(`ℹ️  User ${testUser.profile.full_name} already exists`);
          userIds.push(existingUser.user_id);
        }
      } catch (error: any) {
        console.warn(`⚠️  Error processing user ${testUser.email}:`, error.message);
      }
    }

    if (userIds.length === 0) {
      console.warn("⚠️  No users available for creating opportunities");
      return;
    }

    console.log(`\n📍 Created/found ${userIds.length} users`);
    console.log("✅ Database seeding completed!");
  } catch (error: any) {
    console.error("❌ Error seeding database:", error.message);
    process.exit(1);
  }
}

seedDatabase();

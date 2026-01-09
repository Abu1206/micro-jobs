import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  try {
    console.log("Starting database seeding...");

    // Get or create test users
    const testEmails = [
      "designer@example.com",
      "student1@example.com",
      "student2@example.com",
    ];
    const userIds: string[] = [];

    for (const email of testEmails) {
      // Create user if doesn't exist
      const { data: existingUser } = await supabase
        .from("user_profiles")
        .select("user_id")
        .eq("full_name", email.split("@")[0])
        .single()
        .catch(() => ({ data: null }));

      if (!existingUser) {
        const { data: authUser, error: authError } =
          await supabase.auth.admin.createUser({
            email,
            password: "TestPassword123!",
            email_confirm: true,
          });

        if (authError) {
          console.log(`User ${email} might already exist or error:`, authError);
        } else if (authUser?.user?.id) {
          userIds.push(authUser.user.id);

          // Create user profile
          await supabase.from("user_profiles").insert({
            user_id: authUser.user.id,
            full_name: email.split("@")[0],
            headline: "Computer Science Student",
            university: "Tech University",
            major: "Computer Science",
            verified: true,
            rating: 4.8,
            endorsements: 12,
            year: "3rd Year",
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          });

          console.log(`✓ Created user: ${email}`);
        }
      }
    }

    // Get existing user if any
    const { data: existingProfiles } = await supabase
      .from("user_profiles")
      .select("user_id")
      .limit(1);

    const mainUserId =
      userIds[0] || (existingProfiles?.[0]?.user_id as string);

    if (!mainUserId) {
      console.error(
        "Could not find or create a user for opportunities creation"
      );
      return;
    }

    // Create sample opportunities
    const opportunities = [
      {
        user_id: mainUserId,
        title: "UI/UX Designer for Student Startup",
        category: "gigs",
        description:
          "We are looking for a talented UI/UX Designer to join our team. You will be responsible for designing user interfaces for our mobile and web applications.\n\nRequirements:\n- Strong portfolio of UI/UX work\n- Proficiency in Figma or Adobe XD\n- Understanding of user-centered design principles\n- Excellent communication skills",
        location: "Online",
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        tags: ["Design", "Remote", "Paid"],
        media_urls: [
          "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500",
        ],
        status: "active",
      },
      {
        user_id: mainUserId,
        title: "Annual Campus Hackathon 2024",
        category: "events",
        description:
          "Join us for the biggest hackathon of the year! This is your chance to showcase your coding skills, meet amazing developers, and potentially win great prizes.\n\nSchedule:\n- Day 1: Opening ceremony and team formation\n- Day 2: Hacking begins\n- Day 3: Final submissions and judging\n- Day 4: Awards ceremony\n\nPrizes: Up to $5000 in awards",
        location: "Student Center, Main Hall",
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
        tags: ["Hackathon", "Coding", "Competition"],
        media_urls: [
          "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500",
        ],
        status: "active",
      },
      {
        user_id: mainUserId,
        title: "Weekend Study Group: Linear Algebra",
        category: "collab",
        description:
          "Struggling with Linear Algebra? Join our study group! We meet every weekend to go through course material, solve problem sets together, and help each other understand difficult concepts.\n\nWhat we cover:\n- Matrix operations\n- Eigenvalues and eigenvectors\n- Systems of linear equations\n- Vector spaces\n\nNo prior knowledge required - all welcome!",
        location: "Library Room 3B",
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
        tags: ["Study", "Math", "Collaboration"],
        media_urls: [
          "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500",
        ],
        status: "active",
      },
    ];

    for (const opp of opportunities) {
      const { error } = await supabase
        .from("opportunities")
        .insert(opp)
        .select();

      if (error) {
        console.log("Error inserting opportunity:", error);
      } else {
        console.log(`✓ Created opportunity: ${opp.title}`);
      }
    }

    console.log("✅ Database seeding completed!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();

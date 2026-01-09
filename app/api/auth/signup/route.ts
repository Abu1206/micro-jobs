import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, fullName, schoolId } = body;

    const supabase = await createClient();

    // Sign up user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          school_id: schoolId,
        },
      },
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Insert user profile in a public table (optional)
    if (data.user) {
      await supabase
        .from('user_profiles')
        .insert({
          user_id: data.user.id,
          email: data.user.email,
          full_name: fullName,
          school_id: schoolId,
          created_at: new Date().toISOString(),
        })
        .select();
    }

    return NextResponse.json(
      {
        message: 'Sign up successful. Please check your email to verify.',
        user: data.user,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

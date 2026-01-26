import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, fullName, schoolId } = body;

    // Validate inputs
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Email, password, and full name are required' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    if (fullName.length < 2 || fullName.length > 100) {
      return NextResponse.json(
        { error: 'Full name must be between 2 and 100 characters' },
        { status: 400 }
      );
    }

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
      console.error('[SIGNUP_ERROR]:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Insert user profile in a public table (optional)
    if (data.user) {
      await supabase
        .from('user_profiles')
        .insert([{
          user_id: data.user.id,
          email: data.user.email,
          full_name: fullName,
          school_id: schoolId,
          created_at: new Date().toISOString(),
        }] as any)
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
    console.error('[SIGNUP_SERVER_ERROR]:', error);
    return NextResponse.json(
      { error: process.env.NODE_ENV === 'development' ? error.message : 'Sign up failed' },
      { status: 500 }
    );
  }
}

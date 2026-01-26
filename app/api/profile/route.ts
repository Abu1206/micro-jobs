import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch user profile from database
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return NextResponse.json(
      {
        profile: profile || {
          user_id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name,
          headline: user.user_metadata?.headline,
          university: user.user_metadata?.university,
          major: user.user_metadata?.major,
          skills: user.user_metadata?.skills || [],
          github: user.user_metadata?.github,
          behance: user.user_metadata?.behance,
          linkedin: user.user_metadata?.linkedin,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[PROFILE_GET_ERROR]:', error);
    return NextResponse.json(
      { error: process.env.NODE_ENV === 'development' ? error.message : 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const {
      fullName,
      headline,
      university,
      major,
      skills,
      github,
      behance,
      linkedin,
    } = body;

    // Update user metadata
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        full_name: fullName,
        headline,
        university,
        major,
        skills,
        github,
        behance,
        linkedin,
      },
    });

    if (updateError) throw updateError;

    // Upsert profile in database
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: user.id,
        email: user.email,
        full_name: fullName,
        headline,
        university,
        major,
        skills,
        github,
        behance,
        linkedin,
        updated_at: new Date().toISOString(),
      })
      .select();

    if (error) throw error;

    return NextResponse.json(
      {
        message: 'Profile updated successfully',
        profile: profile[0],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[PROFILE_POST_ERROR]:', error);
    return NextResponse.json(
      { error: process.env.NODE_ENV === 'development' ? error.message : 'Failed to update profile' },
      { status: 500 }
    );
  }
}

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      category,
      description,
      location,
      deadline,
      tags,
      media_urls,
    } = body;

    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate required fields
    if (!title || !category || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create opportunity
    const { data, error } = await supabase
      .from('opportunities')
      .insert({
        user_id: user.id,
        title,
        category,
        description,
        location: location || null,
        deadline: deadline || null,
        tags: tags || [],
        media_urls: media_urls || [],
        created_at: new Date().toISOString(),
        status: 'active',
      })
      .select();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: 'Opportunity created successfully',
        data: data[0],
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

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
        { error: 'Missing required fields: title, category, and description are required' },
        { status: 400 }
      );
    }

    // Validate field lengths
    if (title.length < 5 || title.length > 200) {
      return NextResponse.json(
        { error: 'Title must be between 5 and 200 characters' },
        { status: 400 }
      );
    }

    if (description.length < 20 || description.length > 5000) {
      return NextResponse.json(
        { error: 'Description must be between 20 and 5000 characters' },
        { status: 400 }
      );
    }

    if (location && location.length > 500) {
      return NextResponse.json(
        { error: 'Location must be less than 500 characters' },
        { status: 400 }
      );
    }

    // Create opportunity
    const { data, error } = await supabase
      .from('opportunities')
      .insert([{
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
      }] as any)
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
    console.error('[CREATE_OPPORTUNITY_ERROR]:', error);
    return NextResponse.json(
      { 
        error: process.env.NODE_ENV === 'development' 
          ? error.message || 'Internal server error'
          : 'Failed to create opportunity'
      },
      { status: 500 }
    );
  }
}

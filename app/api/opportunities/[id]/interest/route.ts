import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Check if user is authenticated
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if opportunity exists
    const { data: opportunity, error: oppError } = await supabase
      .from('opportunities')
      .select('id')
      .eq('id', id)
      .single();

    if (oppError || !opportunity) {
      return NextResponse.json(
        { error: 'Opportunity not found' },
        { status: 404 }
      );
    }

    // Check if user already expressed interest
    const { data: existingApplication } = await supabase
      .from('applications')
      .select('id')
      .eq('user_id', user.id)
      .eq('opportunity_id', id)
      .single();

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You already expressed interest in this opportunity' },
        { status: 400 }
      );
    }

    // Create application record
    const { data: application, error: createError } = await supabase
      .from('applications')
      .insert([{
        user_id: user.id,
        opportunity_id: id,
        status: 'pending',
        created_at: new Date().toISOString(),
      }] as any)
      .select();

    if (createError) {
      throw createError;
    }

    return NextResponse.json(
      {
        message: 'Interest expressed successfully',
        application: application[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error expressing interest:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

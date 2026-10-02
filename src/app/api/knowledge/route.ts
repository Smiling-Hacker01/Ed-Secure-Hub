import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/utils/security';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;

    const posts = await db.getBlogPosts(category, search);

    return successResponse({
      posts,
      total: posts.length,
      categories: [
        'All',
        'Cyber Fraud',
        'Privacy',
        'Account Security',
        'Mobile Security',
        'Financial Safety',
        'Social Media Safety',
        'Cyber Awareness',
      ],
    });
  } catch (error) {
    console.error('Get knowledge posts error:', error);
    return errorResponse('INTERNAL_ERROR', 'Failed to retrieve knowledge resources.', 500);
  }
}

import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/utils/security';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const post = await db.getBlogPostBySlug(slug);

    if (!post) {
      return errorResponse('ARTICLE_NOT_FOUND', 'The requested knowledge article could not be found.', 404);
    }

    // Fetch related articles from same category
    const allPosts = await db.getBlogPosts(post.category);
    const related = allPosts.filter((p) => p.id !== post.id).slice(0, 3);

    return successResponse({
      post,
      related,
    });
  } catch (error) {
    console.error('Get single knowledge post error:', error);
    return errorResponse('INTERNAL_ERROR', 'Failed to retrieve article.', 500);
  }
}

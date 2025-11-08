import { NextRequest } from 'next/server';
import { getSearchParamsAsObject } from '@/lib/utils';
import { GetRandomQuestionQuerySchema } from '@/lib/zod/schemas/questions';
import { EnemApiError, handleAndReturnErrorResponse } from '@/lib/api/errors';
import { getRandomQuestion } from '@/lib/api/questions/get-random-question';
import { RateLimiter } from '@/lib/api/rate-limit';
import { logger } from '@/lib/api/logger';

export const dynamic = 'force-dynamic';

const rateLimiter = new RateLimiter();

export async function GET(request: NextRequest) {
    try {
        const { rateLimitHeaders } = rateLimiter.check(request);

        await logger(request);

        const searchParams = request.nextUrl.searchParams;

        const { year, discipline, language } =
            GetRandomQuestionQuerySchema.parse(
                getSearchParamsAsObject(searchParams),
            );

        const questionDetails = await getRandomQuestion({
            year,
            discipline,
            language,
        });

        if (!questionDetails) {
            throw new EnemApiError({
                code: 'not_found',
                message: 'No question found matching the specified filters',
            });
        }

        return Response.json(questionDetails, { headers: rateLimitHeaders });
    } catch (error) {
        return handleAndReturnErrorResponse(error);
    }
}

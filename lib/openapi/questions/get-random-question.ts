import { ZodOpenApiOperationObject } from 'zod-openapi';
import {
    QuestionDetailSchema,
    GetRandomQuestionQuerySchema,
} from '@/lib/zod/schemas/questions';
import { openApiErrorResponses } from '@/lib/openapi/responses';

export const getRandomQuestion: ZodOpenApiOperationObject = {
    operationId: 'getRandomQuestion',
    summary: 'Obter questão aleatória',
    description:
        'Obter uma questão aleatória de todas as provas disponíveis, com opções de filtro',
    requestParams: {
        query: GetRandomQuestionQuerySchema,
    },
    responses: {
        '200': {
            description: 'Detalhes de uma questão aleatória',
            content: {
                'application/json': {
                    schema: QuestionDetailSchema,
                },
            },
        },
        ...openApiErrorResponses,
    },
    tags: ['Questões'],
};

import { getExams } from '@/lib/api/exams/get-exams';
import { getExamDetails } from '@/lib/api/exams/get-exam-details';
import { getQuestionDetails } from '@/lib/api/questions/get-question-details';

type GetRandomQuestionFilters = {
    year?: number;
    discipline?: string;
    language?: string;
};

export async function getRandomQuestion(
    filters: GetRandomQuestionFilters = {},
) {
    const exams = await getExams();

    // Filter exams by year if specified
    const filteredExams = filters.year
        ? exams.filter(exam => exam.year === filters.year)
        : exams;

    if (filteredExams.length === 0) {
        return null;
    }

    // Get all questions from all exams
    const allQuestions: Array<{
        year: number;
        index: number;
        discipline: string | null;
        language: string | null;
    }> = [];

    for (const exam of filteredExams) {
        const examDetails = await getExamDetails(exam.year);
        if (!examDetails) continue;

        // Filter questions by discipline and/or language if specified
        const examQuestions = examDetails.questions.filter(question => {
            const disciplineMatch = filters.discipline
                ? question.discipline === filters.discipline
                : true;
            const languageMatch = filters.language
                ? question.language === filters.language
                : true;
            return disciplineMatch && languageMatch;
        });

        allQuestions.push(
            ...examQuestions.map(q => ({
                year: exam.year,
                index: q.index,
                discipline: q.discipline,
                language: q.language,
            })),
        );
    }

    if (allQuestions.length === 0) {
        return null;
    }

    // Shuffle questions to get random order
    const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5);

    // Find the first question with images
    for (const question of shuffledQuestions) {
        const questionDetails = await getQuestionDetails({
            year: question.year,
            index: question.index,
            language: question.language,
        });

        if (questionDetails && questionDetails.files.length > 0) {
            return questionDetails;
        }
    }

    // No question with images found
    return null;
}

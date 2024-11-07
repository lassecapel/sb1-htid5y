import { supabase } from '../lib/supabase';
import { ApiError } from '../utils/ApiError';
import type { TestResult, TestAnswer } from '../types';

export class TestResultService {
  async saveTestResult(result: Omit<TestResult, 'id'>): Promise<TestResult> {
    // Insert test result
    const { data: testResult, error: resultError } = await supabase
      .from('test_results')
      .insert([{
        user_id: result.userId,
        word_list_id: result.wordListId,
        type: result.type,
        started_at: result.startedAt,
        completed_at: result.completedAt,
        total_time: result.totalTime,
        correct_count: result.correctCount,
        total_count: result.totalCount,
        score: result.score,
        state: result.state
      }])
      .select()
      .single();

    if (resultError) throw new ApiError(resultError.message, 500);

    // Insert test answers
    const { error: answersError } = await supabase
      .from('test_answers')
      .insert(
        result.answers.map(answer => ({
          test_result_id: testResult.id,
          word_id: answer.wordId,
          given_answer: answer.givenAnswer,
          correct_answer: answer.correctAnswer,
          is_correct: answer.isCorrect,
          match_score: answer.matchScore,
          time_spent: answer.timeSpent,
          attempts: answer.attempts
        }))
      );

    if (answersError) throw new ApiError(answersError.message, 500);

    // Return complete test result with answers
    const { data: completeResult, error: fetchError } = await supabase
      .from('test_results')
      .select(`
        *,
        answers:test_answers(*)
      `)
      .eq('id', testResult.id)
      .single();

    if (fetchError) throw new ApiError(fetchError.message, 500);
    return completeResult;
  }

  async getTestResults(userId: string, wordListId?: string): Promise<TestResult[]> {
    let query = supabase
      .from('test_results')
      .select(`
        *,
        answers:test_answers(*)
      `)
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });

    if (wordListId) {
      query = query.eq('word_list_id', wordListId);
    }

    const { data, error } = await query;

    if (error) throw new ApiError(error.message, 500);
    return data;
  }
}
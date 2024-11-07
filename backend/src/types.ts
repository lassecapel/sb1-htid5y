export interface Language {
  code: string;
  name: string;
}

export interface Translation {
  id: string;
  wordId: string;
  languageCode: string;
  value: string;
  pronunciation?: string;
}

export interface Word {
  id: string;
  category: string;
  complexity: number;
  translations: Translation[];
}

export interface WordList {
  id: string;
  title: string;
  description: string;
  fromLanguage: Language;
  toLanguage: Language;
  words: string[]; // Array of word IDs
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  forkCount: number;
}

export interface TestAnswer {
  wordId: string;
  givenAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  matchScore: number;
  timeSpent: number; // in milliseconds
  attempts: number;
}

export interface TestResult {
  id: string;
  userId: string;
  wordListId: string;
  type: 'flashcards' | 'writing' | 'quiz' | 'listening';
  answers: TestAnswer[];
  startedAt: Date;
  completedAt: Date;
  totalTime: number; // in milliseconds
  correctCount: number;
  totalCount: number;
  score: number;
  state: {
    wordOrder: string[]; // Array of word IDs in the order they were presented
    currentIndex: number;
    remainingWords: string[]; // Array of word IDs that weren't tested yet
    mistakeWords: string[]; // Array of word IDs that were answered incorrectly
  };
}</content></file>
<boltAction type="file" filePath="backend/src/db/schema.sql">-- Languages table (static data)
CREATE TABLE languages (
  code VARCHAR(10) PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

-- Words table (unique words)
CREATE TABLE words (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(100) NOT NULL,
  complexity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Translations table (translations for each word)
CREATE TABLE translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word_id UUID NOT NULL REFERENCES words(id) ON DELETE CASCADE,
  language_code VARCHAR(10) NOT NULL REFERENCES languages(code),
  value TEXT NOT NULL,
  pronunciation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(word_id, language_code, value)
);

-- Word lists table
CREATE TABLE word_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  from_language VARCHAR(10) NOT NULL REFERENCES languages(code),
  to_language VARCHAR(10) NOT NULL REFERENCES languages(code),
  user_id UUID NOT NULL,
  fork_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Word list entries (junction table between word_lists and words)
CREATE TABLE word_list_entries (
  word_list_id UUID NOT NULL REFERENCES word_lists(id) ON DELETE CASCADE,
  word_id UUID NOT NULL REFERENCES words(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (word_list_id, word_id)
);

-- Test results table
CREATE TABLE test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  word_list_id UUID NOT NULL REFERENCES word_lists(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL,
  total_time INTEGER NOT NULL, -- in milliseconds
  correct_count INTEGER NOT NULL,
  total_count INTEGER NOT NULL,
  score DECIMAL(5,2) NOT NULL,
  state JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Test answers table
CREATE TABLE test_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_result_id UUID NOT NULL REFERENCES test_results(id) ON DELETE CASCADE,
  word_id UUID NOT NULL REFERENCES words(id) ON DELETE CASCADE,
  given_answer TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  match_score INTEGER NOT NULL,
  time_spent INTEGER NOT NULL, -- in milliseconds
  attempts INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_translations_word_id ON translations(word_id);
CREATE INDEX idx_translations_language ON translations(language_code);
CREATE INDEX idx_word_list_entries_word_id ON word_list_entries(word_id);
CREATE INDEX idx_test_results_user ON test_results(user_id);
CREATE INDEX idx_test_results_word_list ON test_results(word_list_id);
CREATE INDEX idx_test_answers_test_result ON test_answers(test_result_id);
CREATE INDEX idx_test_answers_word ON test_answers(word_id);

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_words_updated_at
  BEFORE UPDATE ON words
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_translations_updated_at
  BEFORE UPDATE ON translations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_word_lists_updated_at
  BEFORE UPDATE ON word_lists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
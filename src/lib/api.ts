import { config } from './config';
import type { WordList, Word, TestResult, Language } from '../types';

class ApiClient {
  private baseUrl: string;
  private token: string | null;
  private controller: AbortController | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Cancel any ongoing requests
    if (this.controller) {
      this.controller.abort();
    }
    this.controller = new AbortController();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
        signal: this.controller.signal,
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/';
          throw new Error('Session expired');
        }
        const error = await response.json();
        throw new Error(error.message || 'API request failed');
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request cancelled');
      }
      throw error;
    } finally {
      this.controller = null;
    }
  }

  // Word Lists
  async getWordLists(): Promise<WordList[]> {
    return this.request('/wordlists');
  }

  async createWordList(data: Partial<WordList>): Promise<WordList> {
    return this.request('/wordlists', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateWordList(id: string, data: Partial<WordList>): Promise<WordList> {
    return this.request(`/wordlists/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteWordList(id: string): Promise<void> {
    return this.request(`/wordlists/${id}`, {
      method: 'DELETE',
    });
  }

  async forkWordList(id: string): Promise<WordList> {
    return this.request(`/wordlists/${id}/fork`, {
      method: 'POST',
    });
  }

  // Words
  async findOrCreateWord(category: string, translations: { languageCode: string; value: string; pronunciation?: string }[]): Promise<Word> {
    return this.request('/words', {
      method: 'POST',
      body: JSON.stringify({ category, translations }),
    });
  }

  async getWordWithTranslations(id: string): Promise<Word> {
    return this.request(`/words/${id}`);
  }

  // Test Results
  async saveTestResult(result: Omit<TestResult, 'id'>): Promise<TestResult> {
    return this.request('/test-results', {
      method: 'POST',
      body: JSON.stringify(result),
    });
  }

  async getTestResults(wordListId?: string): Promise<TestResult[]> {
    const endpoint = wordListId ? `/test-results?wordListId=${wordListId}` : '/test-results';
    return this.request(endpoint);
  }

  // Languages
  async getSupportedLanguages(): Promise<Language[]> {
    return this.request('/languages');
  }
}

export const api = new ApiClient(config.apiUrl);
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { WordList, TestResult, Word } from '../types';

interface GuestDB extends DBSchema {
  wordLists: {
    key: string;
    value: WordList;
    indexes: { 'by-user': string };
  };
  words: {
    key: string;
    value: Word;
  };
  testResults: {
    key: string;
    value: TestResult;
    indexes: { 'by-list': string };
  };
}

let db: IDBPDatabase<GuestDB> | null = null;

export async function initGuestDB() {
  if (db) return db;

  db = await openDB<GuestDB>('wordzy-guest', 1, {
    upgrade(db) {
      // Word Lists Store
      const wordListsStore = db.createObjectStore('wordLists', { keyPath: 'id' });
      wordListsStore.createIndex('by-user', 'userId');

      // Words Store
      const wordsStore = db.createObjectStore('words', { keyPath: 'id' });

      // Test Results Store
      const testResultsStore = db.createObjectStore('testResults', { keyPath: 'id' });
      testResultsStore.createIndex('by-list', 'wordListId');
    },
  });

  return db;
}

export async function getGuestDB() {
  if (!db) {
    await initGuestDB();
  }
  return db!;
}

export async function saveGuestWordList(list: WordList): Promise<void> {
  const db = await getGuestDB();
  await db.put('wordLists', list);
}

export async function getGuestWordList(id: string): Promise<WordList | undefined> {
  const db = await getGuestDB();
  const list = await db.get('wordLists', id);
  
  if (list) {
    // Load all words for the list
    const words = await Promise.all(
      list.words.map(wordId => getGuestWord(wordId))
    );
    list.words = words.filter(Boolean) as Word[];
  }
  
  return list;
}

export async function getAllGuestWordLists(userId: string): Promise<WordList[]> {
  const db = await getGuestDB();
  const lists = await db.getAllFromIndex('wordLists', 'by-user', userId);
  
  // Load words for each list
  for (const list of lists) {
    const words = await Promise.all(
      list.words.map(wordId => getGuestWord(wordId))
    );
    list.words = words.filter(Boolean) as Word[];
  }
  
  return lists;
}

export async function deleteGuestWordList(id: string): Promise<void> {
  const db = await getGuestDB();
  await db.delete('wordLists', id);
}

export async function saveGuestWord(word: Word): Promise<void> {
  const db = await getGuestDB();
  await db.put('words', word);
}

export async function getGuestWord(id: string): Promise<Word | undefined> {
  const db = await getGuestDB();
  return db.get('words', id);
}

export async function saveGuestTestResult(result: TestResult): Promise<void> {
  const db = await getGuestDB();
  await db.put('testResults', result);
}

export async function getGuestTestResults(wordListId?: string): Promise<TestResult[]> {
  const db = await getGuestDB();
  if (wordListId) {
    return db.getAllFromIndex('testResults', 'by-list', wordListId);
  }
  return db.getAll('testResults');
}

export async function clearGuestData(): Promise<void> {
  const db = await getGuestDB();
  await db.clear('wordLists');
  await db.clear('words');
  await db.clear('testResults');
}
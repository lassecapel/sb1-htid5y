import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { WordList, TestResult } from '../types';

interface WordzyDB extends DBSchema {
  wordLists: {
    key: string;
    value: WordList;
  };
  testResults: {
    key: string;
    value: TestResult;
    indexes: { 'by-list': string };
  };
  pendingSync: {
    key: string;
    value: {
      type: 'testResult';
      data: TestResult;
      timestamp: number;
    };
  };
}

let db: IDBPDatabase<WordzyDB> | null = null;

export async function initDB() {
  if (db) return db;

  db = await openDB<WordzyDB>('wordzy', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('wordLists')) {
        db.createObjectStore('wordLists', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('testResults')) {
        const testResults = db.createObjectStore('testResults', { keyPath: 'id' });
        testResults.createIndex('by-list', 'wordListId');
      }
      
      if (!db.objectStoreNames.contains('pendingSync')) {
        db.createObjectStore('pendingSync', { keyPath: 'id', autoIncrement: true });
      }
    },
  });

  return db;
}

export async function getDB() {
  if (!db) {
    await initDB();
  }
  return db!;
}

export async function saveWordList(list: WordList) {
  const database = await getDB();
  await database.put('wordLists', list);
}

export async function getWordList(id: string): Promise<WordList | undefined> {
  const database = await getDB();
  return database.get('wordLists', id);
}

export async function getAllWordLists(): Promise<WordList[]> {
  const database = await getDB();
  return database.getAll('wordLists');
}

export async function saveTestResult(result: TestResult) {
  const database = await getDB();
  await database.put('testResults', result);
  
  // Add to pending sync if offline
  if (!navigator.onLine) {
    await database.add('pendingSync', {
      type: 'testResult',
      data: result,
      timestamp: Date.now(),
    });
  }
}

export async function getTestResults(wordListId?: string): Promise<TestResult[]> {
  const database = await getDB();
  if (wordListId) {
    return database.getAllFromIndex('testResults', 'by-list', wordListId);
  }
  return database.getAll('testResults');
}

export async function getPendingSyncs() {
  const database = await getDB();
  return database.getAll('pendingSync');
}

export async function removePendingSync(id: string) {
  const database = await getDB();
  await database.delete('pendingSync', id);
}
import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useWordListStore } from '../stores/wordListStore';
import { useGuestStore } from '../stores/guestStore';
import type { Word, WordList, TestResult } from '../types';

export function useWordLists() {
  const { user } = useAuthStore();
  const {
    lists: persistedLists,
    loading: persistedLoading,
    error: persistedError,
    fetchUserLists,
    createList: createPersistedList,
    updateList: updatePersistedList,
    deleteList: deletePersistedList,
    addWords: addPersistedWords,
    saveTestResult: savePersistedTestResult
  } = useWordListStore();

  const {
    lists: guestLists,
    loading: guestLoading,
    error: guestError,
    initialized: guestInitialized,
    initialize: initializeGuest,
    addList: addGuestList,
    updateList: updateGuestList,
    deleteList: deleteGuestList,
    addWords: addGuestWords,
    saveTestResult: saveGuestTestResult
  } = useGuestStore();

  useEffect(() => {
    if (user?.isGuest && !guestInitialized) {
      initializeGuest();
    } else if (user && !user.isGuest) {
      fetchUserLists();
    }
  }, [user, guestInitialized, initializeGuest, fetchUserLists]);

  const isGuest = user?.isGuest ?? false;
  const lists = isGuest ? guestLists : persistedLists;
  const loading = isGuest ? guestLoading : persistedLoading;
  const error = isGuest ? guestError : persistedError;

  const createList = async (list: Partial<WordList>): Promise<WordList> => {
    if (!list.title) {
      throw new Error('List title is required');
    }

    if (isGuest) {
      return addGuestList(list);
    }

    return createPersistedList(list);
  };

  const updateList = async (id: string, updates: Partial<WordList>): Promise<void> => {
    if (isGuest) {
      await updateGuestList(id, updates);
    } else {
      await updatePersistedList(id, updates);
    }
  };

  const deleteList = async (id: string): Promise<void> => {
    if (isGuest) {
      await deleteGuestList(id);
    } else {
      await deletePersistedList(id);
    }
  };

  const addWords = async (listId: string, words: Word[]): Promise<void> => {
    if (isGuest) {
      await addGuestWords(listId, words);
    } else {
      await addPersistedWords(listId, words);
    }
  };

  const saveTestResult = async (result: Omit<TestResult, 'id'>): Promise<void> => {
    if (isGuest) {
      await saveGuestTestResult(result);
    } else {
      await savePersistedTestResult(result);
    }
  };

  return {
    lists,
    loading,
    error,
    createList,
    updateList,
    deleteList,
    addWords,
    saveTestResult
  };
}
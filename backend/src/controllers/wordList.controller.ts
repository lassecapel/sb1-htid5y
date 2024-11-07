import { Request, Response } from 'express';
import { WordListService } from '../services/wordList.service';
import { AuthRequest } from '../middleware/auth';
import { ApiError } from '../utils/ApiError';

export class WordListController {
  constructor(private wordListService: WordListService) {}

  getWordLists = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new ApiError('User not found', 404);
    
    const lists = await this.wordListService.getWordLists(userId);
    res.json(lists);
  };

  createWordList = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new ApiError('User not found', 404);
    
    const list = await this.wordListService.createWordList({
      ...req.body,
      userId
    });
    res.status(201).json(list);
  };

  updateWordList = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const listId = req.params.id;
    
    if (!userId) throw new ApiError('User not found', 404);
    
    const list = await this.wordListService.updateWordList(listId, req.body, userId);
    res.json(list);
  };

  deleteWordList = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const listId = req.params.id;
    
    if (!userId) throw new ApiError('User not found', 404);
    
    await this.wordListService.deleteWordList(listId, userId);
    res.status(204).send();
  };

  forkWordList = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const listId = req.params.id;
    
    if (!userId) throw new ApiError('User not found', 404);
    
    const forkedList = await this.wordListService.forkWordList(listId, userId);
    res.status(201).json(forkedList);
  };
}
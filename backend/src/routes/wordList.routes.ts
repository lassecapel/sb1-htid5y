import { Router } from 'express';
import { WordListController } from '../controllers/wordList.controller';
import { WordListService } from '../services/wordList.service';
import { authenticate } from '../middleware/auth';

const router = Router();
const wordListService = new WordListService();
const wordListController = new WordListController(wordListService);

router.use(authenticate);

router.get('/', wordListController.getWordLists);
router.post('/', wordListController.createWordList);
router.put('/:id', wordListController.updateWordList);
router.delete('/:id', wordListController.deleteWordList);
router.post('/:id/fork', wordListController.forkWordList);

export default router;
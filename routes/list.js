import express from 'express';
import { getName, getGenre, getDescription, getPrice } from '../controllers/lists.js';
    
const router = express.Router();

router.get('/', getName);
router.get('/', getGenre);
router.get('/', getDescription);
router.get('/', getPrice);

export default router;

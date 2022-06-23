import express, {Request, Response} from 'express';
const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    res.render('pages/csvTogeoJSON');
});

router.get('/feature', (req: Request, res: Response) => {
    res.render('pages/createFeature');
})

export default router;
import {Request, Response} from 'express'
import { DeleteEarnService } from '../../services/earn/DeleteEarnService';

class DeleteEarnController {
    async handle(req: Request, res: Response){
        const { id} = req.body;
        
        const user_id = req.user_id as string;
        const created_by = user_id;
        const updated_by = user_id;

        const Earn = await new DeleteEarnService().execute({ id});

        return res.json(Earn);

    }
}
    
export { DeleteEarnController }
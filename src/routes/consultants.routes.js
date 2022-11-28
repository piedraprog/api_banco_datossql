import { Router } from 'express';
import { getConsultant } from '@controllers/consultant.controller';
import { generateInform } from '../controllers/consultant.controller';


const consultantRouter = Router();

consultantRouter.get('/',getConsultant);

consultantRouter.post('/inform', generateInform);

export default consultantRouter;
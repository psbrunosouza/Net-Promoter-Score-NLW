import { Router } from 'express';
import { UserController } from './Controllers/UserController';
import { SurveyController } from './Controllers/SurveyController';
import { SendMailController } from './Controllers/SendMailController'; 
import { AnswerController } from './Controllers/AnswerController';
import { NpsController } from './Controllers/NpsController';

const router = Router();
const userController = new UserController(); 
const surveyController = new SurveyController();
const sendMailController = new SendMailController();
const answersController = new AnswerController();
const npsController = new NpsController();

router.post("/users", userController.create);
router.get("/surveys", surveyController.show);
router.post("/surveys", surveyController.create);
router.post("/sendmail", sendMailController.execute );
router.get("/answers/:value", answersController.execute);
router.get("/nps/:survey_id", npsController.execute);

export { router };

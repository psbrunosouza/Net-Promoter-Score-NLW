import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveyUsersRepository } from '../repositories/SurveyUsersRepository';
import { AppError } from '../errors/AppError';

class AnswerController {

  //http://localhost:3333/answers/2?u=bb2d08c9-b557-4766-9f2b-bedd9dae79e6
  async execute(request: Request, response: Response){
    const { value } = request.params;
    const { u } = request.query;

    const SurveysUsersRepository = getCustomRepository(SurveyUsersRepository);

    const surveyUser = await SurveysUsersRepository.findOne({
      id: String(u),
    });

    if(!surveyUser){
      throw new AppError("survey user doesn't exists", 400);
    }

    surveyUser.value = Number(value);

    await SurveysUsersRepository.save(surveyUser);

    return response.json(surveyUser);
  }

}

export {AnswerController};
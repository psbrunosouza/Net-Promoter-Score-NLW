import {Request, Response} from 'express';
import { resolve } from 'path';
import { getCustomRepository } from 'typeorm';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { usersRepository } from '../repositories/UsersRepository';
import { SurveyUsersRepository } from '../repositories/SurveyUsersRepository';
import SendMailService from '../services/SendMailService';
import { AppError } from '../errors/AppError';

class SendMailController {
  async execute(request: Request, response: Response){
    const {email, survey_id} = request.body;

    const userRepository = getCustomRepository(usersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveyUserRepository = getCustomRepository(SurveyUsersRepository);

    const user = await userRepository.findOne({email});

    if(!user){
      throw new AppError("user doesn't exists", 400);
    }

    const survey = await surveysRepository.findOne({id: survey_id});

    if(!survey){
      throw new AppError("survey doesn't exists", 400);
    }

    const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

    const variables = {
      name: user.name, 
      title: survey.title,
      description: survey.description,
      user_id: user.id,
      id: "",
      link: process.env.URL_MAIL
    }

    const surveyAlreadyExists = await surveyUserRepository.findOne({
      where: {user_id: user.id, value: null},
      relations: ['user', 'survey']
    });

    if(surveyAlreadyExists){
      variables.id = surveyAlreadyExists.id;
      await SendMailService.execute(email, survey.title, variables, npsPath);
      return response.json(surveyAlreadyExists);
    }

    const surveyUser = surveyUserRepository.create({
      user_id: user.id,
      survey_id
    });

    await surveyUserRepository.save(surveyUser);

    variables.id = surveyUser.id;

    await SendMailService.execute(email, survey.title, variables, npsPath);

    return response.json(surveyUser);
  };

}

export { SendMailController };
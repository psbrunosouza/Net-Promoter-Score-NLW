import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { usersRepository } from '../repositories/UsersRepository';
import * as yup from 'yup';
import { AppError } from '../errors/AppError';


class UserController {

  async create(request: Request, response: Response){
    const { name, email } = request.body;

    const schema = yup.object().shape({
      name: yup.string().required("Nome é obrigatorio"),
      email: yup.string().email().required("Email é obrigatório")
    });

    // if(!(await schema.isValid(request.body))){
    //   return response.status(400).json({error: "validation failed"});
    // }

    try {
      await schema.validate(request.body, {abortEarly: false});
    }catch(err){
      throw new AppError(err.message, 400);
    }

    const userRepository = getCustomRepository(usersRepository);

    const userAlreadyExists = await userRepository.findOne({
      email
    });

    if(userAlreadyExists){
      throw new AppError("user already exists", 400);
    }

    const user = userRepository.create({
      name,
      email,
    });

    await userRepository.save(user);
    response.status(201).json(user);
  }

}

export { UserController };

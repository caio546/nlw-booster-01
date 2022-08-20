import {Request, Response} from 'express';
import knex from '../database/connection';

class UsersController {
  async index(request: Request, response: Response) {
    const users = await knex('users')
      .distinct()
      .select('users.*');

    const serializedUsers = users.map(user => {
      return {
        ...user,
      };
    });

    return response.json(serializedUsers);
  }

  async show(request: Request, response: Response) {
    const {id} = request.params;

    const user = await knex('users').where('id', id).first();
  
    if(!user) {
      return response.status(400).json({message: 'User not found.'});
    }

    const serializedUser = {
      ...user,
    };

    return response.json({user: serializedUser});
  }
  
  async create(request: Request, response: Response) {
    const {
      name,
      cpf_or_cnpj,
      email,
      password,
    } = request.body;

    const trx = await knex.transaction();
  
    const user = {
      name,
      cpf_or_cnpj,
      email,
      password
    };

    const insertedIds = await trx('users').insert(user);
  
    const user_id = insertedIds[0];
    
    await trx.commit();

    return response.json({
      id: user_id,
      ...user,
    });
  }

  async update(request: Request, response: Response) {
    const {
      name,
      cpf_or_cnpj,
      email,
      password,
    } = request.body;

    const {id} = request.params;
  
    const trx = await knex.transaction();
  
    const user = {
      id,
      name,
      cpf_or_cnpj,
      email,
      password
    };

    await trx('users').update(user);
  
    await trx.commit();

    return response.json({
      ...user,
    });
  }

  async delete(request: Request, response: Response) {
    const {id} = request.params;
  
    const user = await knex('users').where('id', id).first().delete();

    return response.json({
      user,
    });
  }
}

export default UsersController;
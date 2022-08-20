import {Request, Response} from 'express';
import knex from '../database/connection';

class PointsController {
  async index(request: Request, response: Response) {
    const {city, uf} = request.query;

    const points = await knex('points')
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*');

    const serializedPoints = points.map(point => {
      return {
        ...point,
        image_url: `http://localhost:3333/uploads/${point.image}`
      };
    });

    return response.json(serializedPoints);
  }

  async specific_index(request: Request, response: Response) {
    const {user_email} = request.query;

    const points = await knex('points')
      .where('user_email', String(user_email))
      .distinct()
      .select('points.*');

    const serializedPoints = points.map(point => {
      return {
        ...point,
        image_url: `http://localhost:3333/uploads/${point.image}`
      };
    });

    return response.json(serializedPoints);
  }

  async show(request: Request, response: Response) {
    const {id} = request.params;

    const point = await knex('points').where('id', id).first();
  
    if(!point) {
      return response.status(400).json({message: 'Point not found.'});
    }

    const serializedPoint = {
      ...point,
      image_url: `http://localhost:3333/uploads/${point.image}`
    };

    return response.json({point: serializedPoint});
  }
  
  async create(request: Request, response: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      offer,
      user_email,
    } = request.body;

    const trx = await knex.transaction();
  
    const point = {
      image: request.file.filename,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      offer,
      user_email,
    };

    const insertedIds = await trx('points').insert(point);
  
    const point_id = insertedIds[0];
    
    await trx.commit();

    return response.json({
      id: point_id,
      ...point,
    });
  }

  async update(request: Request, response: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      offer,
      user_email,
    } = request.body;

    const {id} = request.params;
  
    const trx = await knex.transaction();
  
    const point = {
      id,
      image: request.file.filename,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      offer,
      user_email,
    };

    await trx('points').update(point);
  
    await trx.commit();

    return response.json({
      ...point,
    });
  }

  async delete(request: Request, response: Response) {
    const {id} = request.params;
  
    const point = await knex('points').where('id', id).first().delete();

    return response.json({
      point,
    });
  }
}

export default PointsController;
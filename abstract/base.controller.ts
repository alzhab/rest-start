import {CreateOptions, DestroyOptions, FindOptions, UpdateOptions} from 'sequelize';
import {BaseServiceI} from './base.service';
import {NextFunction, Request, Response} from 'express';
import {catchError, checkErrors, isObjectEmpty, throwError} from '../utils';
import eventEmitter from '../subscribes/eventEmitter';

export interface BaseControllerI<T, C, P> {
  readonly service: BaseServiceI<T, C, P>,

  get(req: Request, res: Response, next: NextFunction): Promise<void>

  getById(req: Request, res: Response, next: NextFunction): Promise<void>

  post(req: Request, res: Response, next: NextFunction): Promise<void>

  createMany(req: Request, res: Response, next: NextFunction): Promise<void>

  delete(req: Request, res: Response, next: NextFunction): Promise<void>

  deleteMany(req: Request, res: Response, next: NextFunction): Promise<void>

  patch(req: Request, res: Response, next: NextFunction): Promise<void>

  emit(event: string): void;
}

export class BaseController<T, C = T, P = T, ServiceMethods extends BaseServiceI<T, C, P> = BaseServiceI<T, C, P>>
  implements BaseControllerI<T, C, P> {

  public service: ServiceMethods;

  constructor(service: ServiceMethods) {
    this.service = service;
  }

  async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Проверка express-validator
      checkErrors(req);

      let options: FindOptions = {};

      if (req.query.options) {
        try {
          options = JSON.parse(req.query.options as string);
        } catch (e) {
          throwError({
            code: 500,
            message: "Cant parse options"
          })
        }
      }

      const result: T[] = await this.service.getAll(options);

      res.status(200).json(result);
    } catch (e) {
      catchError(e, next);
    }
  };

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Проверка express-validator
      checkErrors(req);

      const id: string = req.params.id;
      let options: FindOptions = {};

      if (req.query.options) {
        try {
          options = JSON.parse(req.query.options as string);
        } catch (e) {
          throwError({
            code: 500,
            message: "Cant parse options"
          })
        }
      }

      const result: T = await this.service.getById(id, options);

      res.status(200).json(result);
    } catch (e) {
      catchError(e, next);
    }
  };

  async post(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Проверка express-validator
      checkErrors(req);

      const body: C = req.body;
      let options: CreateOptions = {};

      if (req.query.options) {
        try {
          options = JSON.parse(req.query.options as string);
        } catch (e) {
          throwError({
            code: 500,
            message: "Cant parse options"
          })
        }
      }

      const result: T = await this.service.create(body, options);

      res.status(200).json(result);
    } catch (e) {
      catchError(e, next);
    }
  };

  async createMany(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Проверка express-validator
      checkErrors(req);

      const body: C[] = req.body;
      let options: CreateOptions = {};

      if (req.query.options) {
        try {
          options = JSON.parse(req.query.options as string);
        } catch (e) {
          throwError({
            code: 500,
            message: "Cant parse options"
          })
        }
      }

      const result: T[] = await this.service.createMany(body, options);

      res.status(200).json(result);
    } catch (e) {
      catchError(e, next);
    }
  };

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Проверка express-validator
      checkErrors(req);

      const id: string | string[] = req.params.id;

      const result: T | T[] = await this.service.destroyById(id);

      res.status(200).json(result);
    } catch (e) {
      catchError(e, next);
    }
  };

  async deleteMany(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Проверка express-validator
      checkErrors(req);

      if (!req.query.options) {
        throwError({
          code: 500,
          message: "Options not defined in query params"
        })
      }

      let options: DestroyOptions = {};

      try {
        options = JSON.parse(req.query.options as string);
      } catch (e) {
        throwError({
          code: 500,
          message: "Cant parse options"
        })
      }

      if (isObjectEmpty(options)) {
        throwError({
          code: 500,
          message: "Options cant be empty"
        })
      }

      console.log('deleteMany');
      const result: T | T[] = await this.service.destroyMany(options);

      res.status(200).json(result);
    } catch (e) {
      catchError(e, next);
    }
  };

  async patch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Проверка express-validator
      checkErrors(req);

      const id: string = req.params.id;
      const body: P = req.body;

      const options: UpdateOptions = {where: {id}};

      const result: T = await this.service.update(body, options);

      res.status(200).json(result);
    } catch (e) {
      catchError(e, next);
    }
  }

  emit(event: string): void {
    eventEmitter.emit(event);
  }
}

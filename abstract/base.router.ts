import * as express from 'express';
import {RequestHandler} from 'express';
import {ValidationChain} from 'express-validator';
import {BaseControllerI} from './base.controller';

export interface RouteI {
  route: string,
  request: RequestHandler,
  middlewares?: RequestHandler[],
  validators?: ValidationChain[],
  method: 'get' | 'post' | 'put' | 'delete' | 'patch'
}

export class BaseRouter<C = BaseControllerI<any, any, any>> {
  public readonly name: string = '';
  public readonly controller: C;
  public readonly routers: RouteI[] = [];

  constructor(
    name: string,
    controller: C,
    routers: RouteI[]
  ) {
    this.name = name;
    this.controller = controller;
    this.routers = routers;
  }

  private generateRouter() {
    const router = express.Router();

    this.routers.forEach(route => {
      const request = route.request.bind(this.controller);

      router[route.method](
        route.route,
        [
          ...(route.middlewares || []),
          ...(route.validators || [])
        ],
        request
      );
    });

    return router;
  }

  get router() {
    return {
      name: this.name,
      router: this.generateRouter()
    };
  }
}

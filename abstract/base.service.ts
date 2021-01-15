import {CountOptions, CreateOptions, DestroyOptions, FindOptions, ModelDefined, UpdateOptions, where} from 'sequelize';
import {capitalizeFirstLetter, changeModel, throwError, toJSON} from '../utils';
import {
  AdminModel, CategoryModel, OrderModel, OrderProductModel, ProductCategoryModel,
  ProductImageModel,
  ProductModel,
  ProductReviewModel,
  PromoCodeModel,
  UserFavoritesModel,
  UserModel
} from '../models';

export interface BaseServiceI<T, C = T, P = T> {
  getAll(options?: FindOptions<T>, parse?: boolean): Promise<T[]>;

  getOne(options?: FindOptions<T>, parse?: boolean): Promise<T>;

  getById(id: string, options?: FindOptions<T>, parse?: boolean): Promise<T>;

  create(data: C, options?: CreateOptions<C>, parse?: boolean): Promise<T>;

  createMany(data: C[], options?: CreateOptions<C>, parse?: boolean): Promise<T[]>;

  destroyMany(options: DestroyOptions<T>, parse?: boolean): Promise<T[] | T>;

  destroyById(id: string, parse?: boolean): Promise<T>;

  count(options: CountOptions<T>, parse?: boolean): Promise<number>;

  update(data: P, options: UpdateOptions, parse?: boolean): Promise<T>;

  addRel(id: string, rel: string, relsIds: string[]): Promise<void>

  deleteRel(id: string, rel: string, relsIds: string[]): Promise<void>
}

export class BaseService<T, C = T, P = C> implements BaseServiceI<T, C, P> {
  public model;
  readonly models = {};

  constructor(model: ModelDefined<T, C>) {
    this.model = model;

    // Задача: Вложенный include в options
    // Решение: - нужно явно указать модель
    // Проблема: В query передается string
    // Решение: Заменить этот название модели на модель из этого списка
    // Проблема: При созданий модели нужно перенести ее сюда
    this.models = {
      Product: ProductModel,
      User: UserModel,
      Admin: AdminModel,
      ProductImage: ProductImageModel,
      UserFavorites: UserFavoritesModel,
      Category: CategoryModel,
      ProductCategory: ProductCategoryModel,
      ProductReview: ProductReviewModel,
      Order: OrderModel,
      OrderProduct: OrderProductModel,
      PromoCode: PromoCodeModel,
    }
  }

  async getAll (options: FindOptions<T> = {}, parse: boolean = true): Promise<T[]> {
    changeModel(options, this.models);
    const result: T[] = await this.model.findAll(options);
    return parse ? toJSON(result) : result;
  };

  async getOne (options: FindOptions<T> = {}, parse: boolean = true): Promise<T> {
    changeModel(options, this.models);
    const result: T = await this.model.findOne(options);
    return parse ? toJSON(result) : result;
  };

  async getById (id: string, options: FindOptions<T> = {}, parse: boolean = true): Promise<T> {
    changeModel(options, this.models);
    const result: T = await this.model.findByPk(id, options);
    return parse ? toJSON(result) : result;
  };

  async create (data: C, options: CreateOptions<C> = {}, parse: boolean = true): Promise<T> {
    const result: T = await this.model.create(data, options);

    return parse ? toJSON(result) : result;
  };

  async createMany (data: C[], options: CreateOptions<C> = {}, parse: boolean = true): Promise<T[]> {
    const result: T[] = await this.model.bulkCreate(data, options);

    return parse ? toJSON(result) : result;
  };

  async destroyMany (options: DestroyOptions<T>, parse: boolean = true): Promise<T[] | T> {
    const result = await this.model.destroy(options);

    if (!toJSON(result)) {
      throwError({
        code: 404,
        message: 'Not exist'
      })
    }

    return parse ? toJSON(result) : result;
  };

  async destroyById (id: string, parse: boolean = true): Promise<T> {
    const result = await this.model.destroy({where: {id}});

    if (!toJSON(result)) {
      throwError({
        code: 404,
        message: 'Not exist'
      })
    }

    return parse ? toJSON(result) : result;
  };

  async count (options: CountOptions<T>, parse: boolean = true): Promise<number> {
    const result = await this.model.count(options);

    return parse ? toJSON(result) : result;
  };

  async update (data: P, options: UpdateOptions<T>, parse: boolean = true): Promise<T> {
    const result = await this.model.update(data, options);

    return parse ? toJSON(result) : result;
  }

  async addRel(id: string, rel: string, relsIds: string[]): Promise<void> {
    const row = await this.getById(id, {}, false);
    // const categories = await categoryService.getAll({where: {id: categoriesIds}}, {}, false);

    rel = capitalizeFirstLetter(rel);

    const methodName = `add${rel}`;

    // @ts-ignore
    row[methodName](relsIds)
  }

  async deleteRel(id: string, rel: string, relsIds: string[]): Promise<void> {
    const row = await this.getById(id, {}, false);
    // const categories = await categoryService.getAll({where: {id: categoriesIds}}, {}, false);

    rel = capitalizeFirstLetter(rel);

    const methodName = `remove${rel}`;

    // @ts-ignoree
    row[methodName](relsIds)
  }
}

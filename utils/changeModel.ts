import {FindOptions} from 'sequelize';
import throwError from './throwError';
import isObjectEmpty from './isObjectEmpty';

const changeModel = (options: FindOptions, models) => {
  if (isObjectEmpty(options)) {
    return
  }

  if (!options['include']) {
    return
  }

  const includes = options['include'] as any[];

  if (includes.length) {
    includes.forEach(include => {
      if (include.model) {
        if (typeof include.model === 'string') {
          if (models[include.model]) {
            include.model = models[include.model]
          } else {
            throwError({
              code: 500,
              message: `Model - ${include.model}, does not exist`
            });
            return
          }
        } else {
          return;
        }
      } else {
        return
      }

      if (include['include']) {
        changeModel(include, models)
      } else {
        return
      }
    })
  } else {
    return
  }
};

export default changeModel

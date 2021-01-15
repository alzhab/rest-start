import * as express from 'express';
import * as cors from 'cors';
import * as path from 'path';
import db from './db';
import resources from './api/resources';
import {config} from './utils';
import {errorHandler} from './api/middlewares';
/*SUBSCRIBES
* Подписки - выполняют роль событий, например при созданий пользователя нужно добавить таблицу статистику
* Польза - отделение бизнес логики
* */
import './subscribes';
/*Relations*/
import './models/relations';
// ----------PROCESS
const app = express();

// BODY PARSER
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// CORS
app.use(cors());


/*JOBS
* Cron - периодического выполнения заданий в определённое время.
* */


// STATIC FILES
app.use('/storage', express.static(path.join(__dirname, 'storage')));

// RESOURCES
resources.forEach(({name, router}) => {
  app.use(`/${name}`, router);
});

// ERROR HANDLER
app.use(errorHandler);

// SYNC DATABASE
db
  .sync({ alter: true })
  .then(() => {
    console.log('Server ready');
    app.listen(config.port)
  })
  .catch((e) => {
    console.log(e);
  });


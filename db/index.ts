import {config} from '../utils'
import {Sequelize} from 'sequelize'

const dbConfig = config.database;

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: 'postgres',
  logging: false
});

export default sequelize;

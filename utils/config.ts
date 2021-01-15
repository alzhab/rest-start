import * as config from 'config'
import ConfigType from '../interfaces/conf';

const mode = process.env.NODE_ENV;

const conf: ConfigType = config.get(`${mode}`);

export default conf

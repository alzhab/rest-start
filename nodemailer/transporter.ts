import * as nodemailer from 'nodemailer'
import {config} from '../utils';

const transporter = nodemailer.createTransport(config.email);

export default transporter;

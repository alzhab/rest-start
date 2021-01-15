import * as multer from 'multer';
import {translitirate} from '../utils';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

const filename = (req, file, cb) => {

  const id = uuidv4();
  const newName = id + path.extname(translitirate(file.originalname));

  cb(null, newName);
};

const imagesStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'storage/images');
	},
	filename
});

const imagesFilter = (req, file, cb) => {
	if (
		file.mimetype === 'image/png' ||
		file.mimetype === 'image/jpg' ||
		file.mimetype === 'image/jpeg'
	) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

const filesStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'storages/files');
	},
	filename
});

const uploads = {
  imagesUpload: multer({storage: imagesStorage, fileFilter: imagesFilter}),
  filesUpload: multer({storage: filesStorage}),
};

export default uploads;

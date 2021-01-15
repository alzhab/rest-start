import * as path from 'path';
import * as fs from 'fs';

export default filePath => {
	filePath = path.join(__dirname, '..', filePath);

  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, err => {
      if (err) {
        console.log(err)
      }
    });
	}
};

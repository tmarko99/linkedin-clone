import { switchMap } from 'rxjs/operators';
import { Observable, from, of } from 'rxjs';
import { diskStorage } from 'multer';
import { v4 as uuid4 } from 'uuid';
import * as fileType from 'file-type';
import * as fs from 'fs';
import * as path from 'path';

type validFileExtension = 'png' | 'jpg' | 'jpeg';
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg' | 'image/gif';

const validFileExtensions: validFileExtension[] = ['png', 'jpg', 'jpeg'];
const validMimeTypes: validMimeType[] = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/gif',
];

export const saveImageToStorage = {
  storage: diskStorage({
    destination: './images',
    filename: (req, file, cb) => {
      const fileExtension: string = path.extname(file.originalname);
      const fileName: string = uuid4() + fileExtension;
      cb(null, fileName);
    },
  }),
  fileFilter: (req, file, callback) => {
    const allowedMimeTypes = validMimeTypes;
    allowedMimeTypes.includes(file.mimetype)
      ? callback(null, true)
      : callback(null, false);
  },
};

export const isFileExtensionSafe = (
  fullFilePath: string,
): Observable<boolean> => {
  return from(fileType.fromFile(fullFilePath)).pipe(
    switchMap((fileExtensionAndMimeType: any) => {
      if (!fileExtensionAndMimeType) return of(false);

      const isFileTypeLegit = validFileExtensions.includes(
        fileExtensionAndMimeType.ext,
      );
      const isMimeTypeLegit = validMimeTypes.includes(
        fileExtensionAndMimeType.mime,
      );
      const isFileLegit = isFileTypeLegit && isMimeTypeLegit;
      return of(isFileLegit);
    }),
  );
};

export const removeFile = (filePath: string): void => {
  try {
    fs.unlinkSync(filePath);
  } catch (err) {
    console.log(err);
  }
};

import { switchMap } from 'rxjs/operators';
import { Observable, from, of } from 'rxjs';
import { diskStorage } from 'multer';
import { v4 as uuid4 } from 'uuid';
import * as fileType from 'file-type';
import * as fs from 'fs';
import path from 'path';

// type validFileExtension = 'png' | 'jpg' | 'jpeg';
// type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

const validFileExtensions = ['png', 'jpg', 'jpeg'];
const validMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];

export const saveImageToStorage = {
  storage: diskStorage({
    destination: '/images',
    filename: (req, file, callback) => {
      const fileExtension = path.extname(file.originalname);
      const fileName = uuid4() + fileExtension;

      callback(null, fileName);
    },
  }),
  fileFilter: (req, file, callback) => {
    const allowedMimeTypes = validMimeTypes;
    allowedMimeTypes.includes(file.mimetype)
      ? callback(null, true)
      : callback(null, false);
  },
  limits: {
    files: 1,
  },
};

export const isFileExtensionSafe = (filePath: string): Observable<boolean> => {
  return from(fileType.fileTypeFromFile(filePath)).pipe(
    switchMap((fileExtensionAndMimeType: fileType.FileTypeResult) => {
      if (fileExtensionAndMimeType) {
        return of(false);
      }

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

/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { diskStorage } from 'multer';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const multerConfig: MulterOptions = {
  storage: diskStorage({
    destination: './my-uploads',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const ext = file.originalname.split('.').pop() ?? 'jpg';
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
    },
  }),
};

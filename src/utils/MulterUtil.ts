import { Request } from 'express';
import { extname } from 'path';
import { generateString } from './GenerateUtil';
import { s3 } from './S3Util';
import multer, { Multer } from 'multer';
import MulterS3 from 'multer-s3';

/**
 * The Multer configuration.
 */
const upload: Multer = multer({
    storage: MulterS3({
        s3,
        contentType: MulterS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        bucket: process.env.S3_BUCKET,
        key: (req: Request, file: Express.Multer.File, cb) => {
            if (!req.user) return;

            const { longUrl } = req.user.settings;
            const filename = (longUrl ? generateString(17): generateString(7)) + extname(file.originalname);
            file.filename = filename;

            cb(null, `${req.user._id}/${filename}`);
        },
    }),
    limits: {
        fileSize: 50 * 1e+6,
    },
});

export {
    upload
};
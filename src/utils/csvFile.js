import {appendFileSync} from 'fs';
import { Email } from '../models/emailStructure.js';



const saveAsCSV = (obj,fileName) => {
  const csv = `${obj.email},${obj.isValid}\n`;
  try {
    appendFileSync(fileName, csv);
  } catch (err) {
    console.error(err);
  }
};


export const createFile = async (fileName) => {
  const uploadFilePath = `${process.cwd()}/uploads/download/${fileName || new Date().getMilliseconds()}.csv`;
 let emailData =  await Email.findAll({
    where: {
      isValid: true
    }
  })
  await emailData.map((e) => {
    const validEmail = saveAsCSV(
      { email: e?.email, isValid: e?.isValid, fullMessage: e?.rawInfo },
      uploadFilePath
    );
  });
  return uploadFilePath;
};
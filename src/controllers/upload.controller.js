import { FileStruct } from "../models/uploadStructure.js";
import sendMessage from "../utils/message.js";
export const getFiles = async (req, res) => {
  try {
    const Users = await FileStruct.findAll({
      attributes: ["id", "fileName", "filePath"],
    });
    res.json(Users);
  } catch (error) {}
};

export const createUploadFile = async (req, res) => {
  const fourdigitNumbber = Math.floor(1000 + Math.random() * 9000);

  const {
    filePath,
    fileName,
    phoneNumber,
    mimeType,
    byUser = 10,
    isValid = false,
  } = req.body;
  sendMessage({ code: fourdigitNumbber, userNumber: phoneNumber });
  try {
    const newUsers = await FileStruct.create({
      filePath,
      fileName,
      mimeType,
      byUser,
      isValid,
    });

    res.json(newUsers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const uploadFile = async (fileObj) => {
  const fourdigitNumbber = Math.floor(1000 + Math.random() * 9000);

  const {
    filePath,
    fileName,
    phoneNumber,
    mimeType,
    byUser = 10,
    isValid = false,
  } = fileObj;
  // sendMessage({ code: fourdigitNumbber, userNumber: phoneNumber });
  try {
    const newUsers = await FileStruct.create({
      filePath,
      fileName,
      mimeType,
      byUser,
      isValid,
    });
    console.log(newUsers);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

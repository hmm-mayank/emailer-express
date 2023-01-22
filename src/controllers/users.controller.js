import { Users } from "../models/userStructure.js";
import sendMessage from "../utils/message.js";
export const getUsers = async (req, res) => {
  try {
    const Users = await Users.findAll({
      attributes: ["id", "phone"],
    });
    res.json(Users);
  } catch (error) {}
};



export const createUsers = async (req, res) => {
    const fourdigitNumbber = Math.floor(1000 + Math.random() * 9000);
   
  const {
    phoneNumber,
    countryCode,
    email,
    isActivated = false,
    otp = fourdigitNumbber,
  } = req.body;
  sendMessage({ code: fourdigitNumbber, userNumber: phoneNumber });
  try {
    const newUsers = await Users.create({
      phoneNumber,
      countryCode,
      email,
      isActivated,
    });

    res.json(newUsers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

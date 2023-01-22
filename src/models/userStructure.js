import { DataTypes } from "sequelize";
import { sequelize } from "../db/database.js";

export const Users = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
    },
    countryCode: {
      type: DataTypes.STRING,
    },
    otp: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    isActivated: { type: DataTypes.BOOLEAN },
  },
  {
    timestamps: true,
  }
);

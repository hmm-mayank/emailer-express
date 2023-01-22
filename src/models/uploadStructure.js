import { DataTypes } from "sequelize";
import { sequelize } from "../db/database.js";

export const FileStruct = sequelize.define(
  "files",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    filePath: {
      type: DataTypes.STRING,
    },
    fileName: {
      type: DataTypes.STRING,
    },
    byUser: {
      type: DataTypes.INTEGER,
    },
    isValid: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    timestamps: true,
  }
);

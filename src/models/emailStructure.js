import { DataTypes } from "sequelize";
import { sequelize } from "../db/database.js";

export const Project = sequelize.define(
  "validEmails",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
    },
    isValid: {
      type: DataTypes.BOOLEAN,
    },
    raw: {
      type: DataTypes.JSONB,
    },
    byUser: {
      type: DataTypes.INTEGER,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

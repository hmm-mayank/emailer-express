import { DataTypes } from "sequelize";
import { sequelize } from "../db/database.js";

export const Email = sequelize.define(
  "validEmails",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    rawInfo:{
      type: DataTypes.JSON,
    },
    isValid: {
      type: DataTypes.BOOLEAN,
    },
    raw: {
      type: DataTypes.JSONB,
    },
    byUser: {
      type: DataTypes.INTEGER
    },
  },
  {
    timestamps: true,
  }
);

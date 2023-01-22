import { DataTypes } from "sequelize";
import { sequelize } from "../db/database.js";

export const QueueStatus = sequelize.define(
  "queueStatus",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    isRunning: {
      type: DataTypes.BOOLEAN,
      unique: true,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

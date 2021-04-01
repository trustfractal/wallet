import DataTypes from "@models/Data/DataTypes";

const keys = {
  FIRST_NAME: {
    key: "first_name",
    name: "First Name",
    format: "text",
    type: DataTypes.STRING,
  },
  LAST_NAME: {
    key: "last_name",
    name: "Last Name",
    format: "text",
    type: DataTypes.STRING,
  },
  EMAIL: {
    key: "email",
    name: "Email",
    format: "email",
    type: DataTypes.STRING,
  },
  BIRTH_DATE: {
    key: "birth_date",
    name: "Birth Date",
    format: "date",
    type: DataTypes.STRING,
  },
  AGE: {
    key: "age",
    name: "Age",
    format: "number",
    type: DataTypes.NUMBER,
  },
  IDENTIFICATION_NUMBER: {
    key: "identification_number",
    name: "Identification Number",
    format: "text",
    type: DataTypes.STRING,
  },
};

export default keys;

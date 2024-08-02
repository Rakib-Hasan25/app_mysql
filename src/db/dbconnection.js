import mysql from 'mysql2'
import dotenv from "dotenv";
dotenv.config();

// export const pool = mysql.createPool({
//         host : "127.0.0.1",
//         user: "root",
//         password: "rakib",
//         database: "notes_app", 
//     }).promise()

export const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  }).promise()
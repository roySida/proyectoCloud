const express = require('express')
const jwt = require('jsonwebtoken')
const user = express.Router()
const { sql } = require('../config/database');

user.post("/signin", async (req, res, next) => {
  const { user_nombre, user_correo, user_contraseña } = req.body;
  
  if (user_nombre && user_correo && user_contraseña) {
    try {
      const query = "INSERT INTO administradores (nombre, correo, contraseña) VALUES (@user_nombre, @user_correo, @user_contraseña)";
      const request = new sql.Request();
      request.input("user_nombre", sql.VarChar, user_nombre);
      request.input("user_correo", sql.VarChar, user_correo);
      request.input("user_contraseña", sql.VarChar, user_contraseña);
  
      const result = await request.query(query);
  
      if (result.rowsAffected[0] === 1) {
        return res.status(201).json({ code: 201, message: "Administrador registrado correctamente" });
      } else {
        return res.status(500).json({ code: 500, message: "Ocurrió un error al registrar el administrador" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ code: 500, message: "Error en el servidor" });
    }
  }
  
  return res.status(500).json({ code: 500, message: "Campos incompletos" });
});


user.post("/login", async (req, res, next) => {
    const { user_mail, user_password } = req.body;
  
    if (user_mail && user_password) {
      try {
        const query = "SELECT * FROM administradores WHERE correo = @user_mail AND contraseña = @user_password";
        const request = new sql.Request();
        request.input("user_mail", sql.VarChar, user_mail);
        request.input("user_password", sql.VarChar, user_password);
  
        const result = await request.query(query);
        const rows = result.recordset;
  
        if (rows.length === 1) {
          const token = jwt.sign({
            user_id: rows[0].user_id,
            user_mail: rows[0].user_mail
          }, "debugkey");
  
          return res.status(200).json({ code: 200, message: token });
        } else {
          return res.status(200).json({ code: 401, message: "Usuario y/o contraseña incorrecta" });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({ code: 500, message: "Error en el servidor" });
      }
    }
  
    return res.status(500).json({ code: 500, message: "Campos incompletos" });
});

module.exports = user
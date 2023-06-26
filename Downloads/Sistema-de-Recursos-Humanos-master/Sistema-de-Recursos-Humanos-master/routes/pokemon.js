const express = require('express');
const pokemon = express.Router();
const { sql } = require('../config/database');

pokemon.post("/", async (req, res, next) => {
  const { user_nombre, user_apellido, user_telefono, user_correo, user_direccion } = req.body;

  if (user_nombre && user_apellido && user_telefono && user_correo && user_direccion) {
    try {
      const query = `INSERT INTO empleados (nombre, apellido, telefono, correo, direccion) VALUES (@nombre, @apellido, @telefono, @correo, @direccion)`;
      const request = new sql.Request();
      request.input("nombre", sql.VarChar, user_nombre);
      request.input("apellido", sql.VarChar, user_apellido);
      request.input("telefono", sql.Char, user_telefono);
      request.input("correo", sql.VarChar, user_correo);
      request.input("direccion", sql.VarChar, user_direccion);

      const result = await request.query(query);
      const rowsAffected = result.rowsAffected[0];

      if (rowsAffected === 1) {
        return res.status(201).json({ code: 201, message: "Empleado insertado correctamente" });
      }

      return res.status(500).json({ code: 500, message: "Ocurrió un error" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ code: 500, message: "Error en el servidor" });
    }
  }

  return res.status(500).json({ code: 500, message: "Campos incompletos" });
});


pokemon.delete("/:correo", async (req, res, next) => {
    const correo = req.params.correo;
    const query = "DELETE FROM empleados WHERE correo = @correo";
    const request = new sql.Request();
    request.input("correo", sql.VarChar, correo);
  
    try {
      const result = await request.query(query);
  
      if (result.rowsAffected[0] === 1) {
        return res.status(200).json({ code: 200, message: "Empleado borrado correctamente" });
      }
  
      return res.status(404).json({ code: 404, message: "Empleado no encontrado" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ code: 500, message: "Error en el servidor" });
    }
  });

pokemon.put("/", async (req, res, next) => {
    const { user_nombre, user_apellido, user_telefono, user_correo, user_direccion } = req.body;

    if (user_nombre && user_apellido && user_telefono && user_correo && user_direccion) {
      let query = `UPDATE empleados SET nombre = @user_nombre, apellido = @user_apellido, telefono = @user_telefono, direccion = @user_direccion WHERE correo = @user_correo;`;
      
      try {
        const request = new sql.Request();
        request.input("user_nombre", sql.VarChar, user_nombre);
        request.input("user_apellido", sql.VarChar, user_apellido);
        request.input("user_telefono", sql.Char, user_telefono);
        request.input("user_correo", sql.VarChar, user_correo);
        request.input("user_direccion", sql.VarChar, user_direccion);
        
        const result = await request.query(query);
        
        if (result.rowsAffected[0] === 1) {
          return res.status(200).json({ code: 200, message: "Empleado actualizado correctamente" });
        } else {
          return res.status(404).json({ code: 404, message: "Empleado no encontrado" });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({ code: 500, message: "Ocurrió un error en el servidor" });
      }
    }
    
    return res.status(500).json({ code: 500, message: "Campos incompletos" });
});

pokemon.get("/", async (req, res, next) => {
    try {
      const result = await sql.query("SELECT * FROM empleados");
      const pkmn = result.recordset;
      return res.status(200).json({ code: 200, message: pkmn });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ code: 500, message: "Error en el servidor" });
    }
});
  
pokemon.get("/email/:correo", async (req, res, next) => {
      const correo = req.params.correo;
      const query = `SELECT * FROM empleados WHERE correo = @correo`;
      const request = new sql.Request();
      request.input("correo", sql.VarChar, correo);
  
      try {
          const result = await request.query(query);
          const pkmn = result.recordset;
  
          if (pkmn.length > 0) {
              return res.status(200).json({ code: 200, message: pkmn });
          } else {
              return res.status(404).json({ code: 404, message: "Empleado no encontrado" });
          }
      } catch (error) {
          console.error(error);
          return res.status(500).json({ code: 500, message: "Error en el servidor" });
      }
});
  

pokemon.get("/:name([A-Za-z]+)", async (req, res, next) => {
    const name = req.params.name;
    const query = "SELECT * FROM empleados WHERE nombre = @name";
    const request = new sql.Request();
    request.input("name", sql.VarChar, name);
  
    try {
        const result = await request.query(query);
        const pkmn = result.recordset;
    
        return (pkmn.length > 0) ? res.status(200).json({ code: 200, message: pkmn }) : res.status(404).json({ code: 404, message: "Empleado no encontrado" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ code: 500, message: "Error en el servidor" });
    }
});

module.exports = pokemon


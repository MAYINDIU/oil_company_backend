const shabakaModel = require("./Shabaka.model");

shabakaModel.getAllAsync = () => {
  return new Promise((resolve, reject) => {
    shabakaModel.getAll((err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

exports.createData = (req, res) => {
  const body = req.body;

  const sendData = { ...body };

  shabakaModel.create(sendData, (err, id) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ error: "Failed to create Data", error: err?.sqlMessage });
    }
    res.status(201).json({ id, message: "Shabaka Created successfully" });
  });
};

exports.getAllData = async (req, res) => {
  const { station } = req.query;
  shabakaModel.getAll(station, (err, datas) => {
    if (err) {
      return res.status(500).json({ error: "Failed to get data" });
    }

    res.json({ data: datas });
  });
};

exports.getDataById = (req, res) => {
  const dataId = req.params.id;

  shabakaModel.getById(dataId, (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to get data" });
    }
    if (!data) {
      return res.status(404).json({ error: "Data not found" });
    }
    res.json({ data });
  });
};

exports.updateDataById = (req, res) => {
  const { id } = req.params;
  const body = req.body;

  const updateData = { ...body };

  shabakaModel.update(id, updateData, (err, affectedRows) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Failed to update data", error: err?.sqlMessage });
    }
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Data not found" });
    }
    res.json({ message: "Data updated successfully" });
  });
};

exports.deleteDataById = (req, res) => {
  const { id } = req.params;

  shabakaModel.delete(id, (err, affectedRows) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Failed to delete Data", error: err?.sqlMessage });
    }
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Data not found" });
    }
    res.json({ message: "Data deleted successfully" });
  });
};

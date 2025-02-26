const shabakaDataModel = require("./ShabakaData.model");

shabakaDataModel.getAllAsync = () => {
  return new Promise((resolve, reject) => {
    shabakaDataModel.getAll((err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

exports.createData = (req, res) => {
  const body = req.body;

  const sendData = { ...body };

  shabakaDataModel.create(sendData, (err, id) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ error: "Failed to create Data", error: err?.sqlMessage });
    }
    res.status(201).json({ id, message: "Data Created successfully" });
  });
};

exports.getAllData = async (req, res) => {
  const { station, fromDate, toDate } = req.query;
  shabakaDataModel.getAll(station, fromDate, toDate, (err, datas) => {
    if (err) {
      return res.status(500).json({ error: "Failed to get data" });
    }

    res.json({ data: datas });
  });
};

exports.getDataById = (req, res) => {
  const dataId = req.params.id;

  shabakaDataModel.getById(dataId, (err, data) => {
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

  shabakaDataModel.update(id, updateData, (err, affectedRows) => {
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

  shabakaDataModel.delete(id, (err, affectedRows) => {
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



// Get Shebaka Station Report
exports.getShebakaStationReport = (req, res) => {
  const { fromDate, toDate, station_id } = req.query;

  // Validate required parameters
  if (!fromDate || !toDate || !station_id) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  shabakaDataModel.ShebakaStationReport(fromDate, toDate, station_id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database query error', details: err.message });
    }

    if (results.length === 0) {
      return res.status(204).json({ message: 'No records found' });
    }

    res.status(200).json(results);
  });
};

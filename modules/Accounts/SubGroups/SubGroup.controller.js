const accSubModel = require("./SubGroup.model");
const accMainModel = require("../Groups/Group.model");

accSubModel.getAllAsync = () => {
  return new Promise((resolve, reject) => {
    accSubModel.getAll((err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

exports.createData = (req, res) => {
  const body = req.body;

  const sendData = { ...body };

  accSubModel.create(sendData, (err, id) => {
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
  const [mainGroups] = await Promise.all([accMainModel.getAllAsync()]);

  accSubModel.getAll((err, datas) => {
    if (err) {
      return res.status(500).json({ error: "Failed to get data" });
    }

    const data = datas?.map((item) => {
      const mainGroup = mainGroups?.find(
        (group) => group?.id == item?.group_id
      );
      return {
        ...item,
        mainName: mainGroup ? mainGroup.group_name : "",
      };
    });

    res.json({ data });
  });
};

exports.getDataById = (req, res) => {
  const dataId = req.params.id;

  accSubModel.getById(dataId, (err, data) => {
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
  const { mainName, created_at, updated_at, comp_id, ...updateData } = req.body;

  accSubModel.update(id, updateData, (err, affectedRows) => {
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

  accSubModel.delete(id, (err, affectedRows) => {
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

const subModel = require("../SubGroups/SubGroup.model");
const ledgerModel = require("../Ledger/Ledger.model");
const voucherModel = require("./Voucher.model");

// default fetch all journal start
voucherModel.getAllAsync = () => {
  return new Promise((resolve, reject) => {
    voucherModel.getAll((err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};
// default fetch all journal start

exports.createData = async (req, res) => {
  const body = req.body;

  let sendData;

  if (body?.vc_type == 1 && body?.credit > 0) {
    sendData = { ...body, active: 1 };
  } else {
    sendData = { ...body };
  }

  voucherModel.create(sendData, (err, dataId) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Failed to create data", error: err?.sqlMessage });
    }
    res.status(201).json({ dataId });
  });
};

exports.getAllData = async (req, res) => {
  const allSub = await subModel.getAllAsync();
  const allLedger = await ledgerModel.getAllAsync();

  voucherModel.getAll((err, datas) => {
    if (err) {
      return res.status(500).json({ error: "Failed to get data" });
    }

    const data = datas?.map((d) => {
      const findLedger = allLedger?.find((leg) => leg?.id == d?.ledger_id);
      const findSub = allSub?.find((sub) => sub?.id == findLedger?.sub_id);

      return {
        ...d,
        subName: findSub?.sub_name,
        ledgerName: findLedger?.ledger_name,
        voucherName:
          d?.voucher_type == 1
            ? "JV"
            : d?.voucher_type == 2
            ? "CP"
            : d?.voucher_type == 3
            ? "BP"
            : d?.voucher_type == 4
            ? "CR"
            : d?.voucher_type == 5
            ? "CR"
            : "",
      };
    });
    res.json({ data });
  });
};

exports.getDataById = (req, res) => {
  const catId = req.params.id;

  voucherModel.getById(catId, (err, category) => {
    if (err) {
      return res.status(500).json({ error: "Failed to get data" });
    }
    if (!category) {
      return res.status(404).json({ error: "Data not found" });
    }
    res.json({ category });
  });
};

exports.getDataByVcNo = async (req, res) => {
  // const vc_no = req.params.vc_no;
  const { vcno } = req.query;

  const allLedger = await ledgerModel.getAllAsync();
  const allFarmer = await Farmer.getAllAsync();
  const allClient = await SuppDlr.getAllAsync();

  voucherModel.getByVcNo(vcno, (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to get data" });
    }
    if (!data) {
      return res.status(404).json({ error: "Data not found" });
    }

    const datas = data?.map((d) => {
      const findLedger = allLedger?.find((leg) => leg?.id == d?.ledger_id);
      const findFarmer = allFarmer?.find(
        (leg) => leg?.farmerId == d?.tag_farmer
      );
      const findClient = allClient?.find(
        (leg) => leg?.suppdlrId == d?.tag_client
      );
      const findSupplier = allClient?.find(
        (leg) => leg?.suppdlrId == d?.tag_supp
      );
      return {
        ...d,
        ledgerName: findLedger?.ledger_name,
        farmer: findFarmer?.name,
        client: findClient?.name,
        supplier: findSupplier?.name,
        voucherName:
          d?.voucher_type == "1"
            ? "JV"
            : d?.voucher_type == "2"
            ? "CP"
            : d?.voucher_type == "3"
            ? "BP"
            : d?.voucher_type == "4"
            ? "CR"
            : "BR",
      };
    });

    res.json({ datas });
  });
};

exports.journalByDateRange = async (req, res) => {
  const { startDate, endDate } = req.query;

  const allLedger = await ledgerModel.getAllAsync();

  voucherModel.getByDateRange(startDate, endDate, (err, datas) => {
    if (err) {
      return res.status(500).json({ error: "Failed to get data" });
    }

    const data = datas?.map((d) => {
      const findLedger = allLedger?.find((leg) => leg?.id == d?.ledger_id);
      return {
        ...d,
        ledgerName: findLedger?.ledger_name,
        voucherName:
          d?.vc_type == 1
            ? "JV"
            : d?.vc_type == 2
            ? "CP"
            : d?.vc_type == 3
            ? "BP"
            : d?.vc_type == 4
            ? "CR"
            : d?.vc_type == 5
            ? "BR"
            : "",
      };
    });

    res.json({ data });
  });
};

exports.journalByLedgerDateRange = async (req, res) => {
  const { startDate, endDate, ledgerId } = req.query;

  const allJournal = await voucherModel.getAllAsync();
  const allLedger = await ledgerModel.getAllAsync();
  const allSub = await subModel.getAllAsync();
  const allFarmer = await Farmer.getAllAsync();
  const allClient = await SuppDlr.getAllAsync();
  voucherModel.getOpeningBalance(ledgerId, startDate, (err, openingBalance) => {
    if (err) {
      return res.status(500).json({ error: "Failed to get opening balance" });
    }
    voucherModel.getByLedgerDateRange(
      ledgerId,
      startDate,
      endDate,
      (err, datas) => {
        if (err) {
          return res.status(500).json({ error: "Failed to get data" });
        }

        const getJournalByVcNo = allJournal.filter((item1) =>
          datas.some((item2) => item2.vc_no === item1.vc_no)
        );
        // console.log(getJournalByVcNo);

        const filterGetByVcNo = getJournalByVcNo.filter(
          (j) => j?.post_type !== 1
        );
        const filterPostType = datas.find((j) => j?.post_type == 1);

        const mappingDatas =
          filterPostType?.post_type == 1 ? filterGetByVcNo : datas;

        const data = mappingDatas?.map((d) => {
          const findLedger = allLedger?.find((leg) => leg?.id == d?.ledger_id);
          const findFarmer = allFarmer?.find(
            (leg) => leg?.farmerId == d?.tag_farmer
          );
          const findClient = allClient?.find(
            (leg) => leg?.suppdlrId == d?.tag_client
          );
          const findSupplier = allClient?.find(
            (leg) => leg?.suppdlrId == d?.tag_supp
          );
          return {
            ...d,
            ledgerName: findLedger?.ledger_name,
            farmer: findFarmer?.name,
            client: findClient?.name,
            supplier: findSupplier?.name,
            voucherName:
              d?.voucher_type == "1"
                ? "JV"
                : d?.voucher_type == "2"
                ? "CP"
                : d?.voucher_type == "3"
                ? "BP"
                : d?.voucher_type == "4"
                ? "CR"
                : "BR",
          };
        });

        res.json({ openingBalance, data });
      }
    );
  });
};

exports.partyLedgerController = async (req, res) => {
  const { startDate, endDate, ledgerId } = req.query;

  const allLedger = await ledgerModel.getAllAsync();
  const allFarmer = await Farmer.getAllAsync();
  const allClient = await SuppDlr.getAllAsync();
  voucherModel.getOpeningBalance(ledgerId, startDate, (err, openingBalance) => {
    if (err) {
      return res.status(500).json({ error: "Failed to get opening balance" });
    }
    voucherModel.partyLedgerModel(
      ledgerId,
      startDate,
      endDate,
      (err, datas) => {
        if (err) {
          return res.status(500).json({ error: "Failed to get data" });
        }

        const data = datas?.map((d) => {
          const findLedger = allLedger?.find((leg) => leg?.id == d?.ledger_id);
          const findFarmer = allFarmer?.find(
            (leg) => leg?.farmerId == d?.tag_farmer
          );
          const findClient = allClient?.find(
            (leg) => leg?.suppdlrId == d?.tag_client
          );
          const findSupplier = allClient?.find(
            (leg) => leg?.suppdlrId == d?.tag_supp
          );
          return {
            ...d,
            ledgerName: findLedger?.ledger_name,
            farmer: findFarmer?.name,
            client: findClient?.name,
            supplier: findSupplier?.name,
            voucherName:
              d?.voucher_type == "1"
                ? "JV"
                : d?.voucher_type == "2"
                ? "CP"
                : d?.voucher_type == "3"
                ? "BP"
                : d?.voucher_type == "4"
                ? "CR"
                : "BR",
          };
        });

        res.json({ openingBalance, data });
      }
    );
  });
};

exports.customerOpeningController = async (req, res) => {
  const { startDate, cusId } = req.query;

  if (!cusId || !startDate) {
    return res.status(400).json({
      success: false,
      message: "Customer ID and start date are required.",
    });
  }

  voucherModel.customerOpeningBalance(
    cusId,
    startDate,
    (err, openingBalance) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "An error occurred while fetching the opening balance.",
          error: err?.sqlMessage,
        });
      }

      return res.status(200).json({
        success: true,
        openingBalance: openingBalance,
      });
    }
  );
};

exports.receivedAndPaymentController = async (req, res) => {
  const { startDate, endDate } = req.query;

  const allLedger = await ledgerModel.getAllAsync();
  const allFarmer = await Farmer.getAllAsync();
  const allClient = await SuppDlr.getAllAsync();

  voucherModel.receivedAndPaymentModel(startDate, endDate, (err, datas) => {
    if (err) {
      return res.status(500).json({ error: "Failed to get data" });
    }

    const data = datas?.map((d) => {
      const findLedger = allLedger?.find((leg) => leg?.id == d?.ledger_id);
      const findFarmer = allFarmer?.find(
        (leg) => leg?.farmerId == d?.tag_farmer
      );
      const findClient = allClient?.find(
        (leg) => leg?.suppdlrId == d?.tag_client
      );
      const findSupplier = allClient?.find(
        (leg) => leg?.suppdlrId == d?.tag_supp
      );
      return {
        id: d?.journal_id,
        vc_no: d?.vc_no,
        voucher_type: d?.voucher_type,
        ledger_id: d?.ledger_id,
        tag_supp: d?.tag_supp,
        tag_client: d?.tag_client,
        tag_farmer: d?.tag_farmer,
        transaction_date: d?.transaction_date,
        debit: d?.debit,
        credit: d?.credit,
        ledgerName: findLedger?.ledger_name,
        farmer: findFarmer?.name,
        client: findClient?.name,
        supplier: findSupplier?.name,
      };
    });

    res.json({ data });
  });
};

exports.cashBookController = async (req, res) => {
  const { startDate, endDate, ledgerId } = req.query;

  if (!startDate || !endDate || !ledgerId) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  voucherModel.cashBookModel(startDate, endDate, ledgerId, (err, datas) => {
    if (err) {
      return res.status(500).json({ error: "Failed to get data" });
    }

    if (!datas || datas.length === 0) {
      return res.status(404).json({ error: "No data found" });
    }

    const data = datas?.map((d) => {
      const vc = d?.voucher_type;
      function formatDate(dateString) {
        const date = new Date(dateString);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let getDate = day + "-" + month + "-" + year;
        return getDate;
      }
      return {
        id: d?.journal_id,
        vc_no: d?.vc_no,
        vc_type:
          vc == 2
            ? "CP"
            : vc == 3
            ? "BP"
            : vc == 4
            ? "CR"
            : vc == 5
            ? "BR"
            : "",
        date: formatDate(d?.transaction_date),
        debit: d?.debit,
        credit: d?.credit,
        nar: d?.narration,
        des: d?.description,
      };
    });

    res.json({ data });
  });
};

exports.bankBookController = async (req, res) => {
  const { startDate, endDate, ledgerId } = req.query;

  if (!startDate || !endDate || !ledgerId) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  const allLedger = await ledgerModel.getAllAsync().catch((err) => {
    return res.status(500).json({ error: "Failed to get ledger data" });
  });

  voucherModel.bankBookModel(startDate, endDate, ledgerId, (err, datas) => {
    if (err) {
      return res.status(500).json({ error: "Failed to get data" });
    }

    if (!datas || datas.length === 0) {
      return res.status(404).json({ error: "No data found" });
    }

    const data = datas?.map((d) => {
      const vc = d?.voucher_type;
      function formatDate(dateString) {
        const date = new Date(dateString);
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let getDate = day + "-" + month + "-" + year;
        return getDate;
      }
      return {
        id: d?.journal_id,
        vc_no: d?.vc_no,
        vc_type: vc == 2 ? "CP" : vc == 3 ? "BP" : vc == 4 ? "CR" : "BR",
        date: formatDate(d?.transaction_date),
        debit: d?.debit,
        credit: d?.credit,
        nar: d?.narration,
        des: d?.description,
      };
    });

    res.json({ data });
  });
};

exports.updateDataById = (req, res) => {
  const voucherId = req.params.journal_id;
  const body = req.body;

  const updateVoucherById = {
    ...body,
  };

  voucherModel.updateById(voucherId, updateVoucherById, (err, affectedRows) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Failed to update data", error: err });
    }
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Data not found" });
    }
    res.status(204).end();
  });
};
exports.updateDataByVoucherNo = (req, res) => {
  const updates = req.body;

  const updatePromises = updates?.map((update) => {
    return new Promise((resolve, reject) => {
      voucherModel.updateByVoucherNo(
        update.journal_id,
        update,
        (err, affectedRows) => {
          if (err) {
            return reject(err);
          }
          resolve(affectedRows);
        }
      );
    });
  });

  Promise.all(updatePromises)
    .then((results) => {
      const totalAffectedRows = results.reduce((acc, curr) => acc + curr, 0);
      if (totalAffectedRows === 0) {
        return res.status(404).json({ error: "No records updated" });
      }
      res.status(204).end();
    })
    .catch((err) => {
      res.status(500).json({ error: "Failed to update data", details: err });
    });
};

exports.updatePostedDataByVoucherNo = (req, res) => {
  const voucherId = req.params.vc_no;
  const body = req.body;

  const updateVoucher = {
    ...body,
  };

  voucherModel.updatePostedByVoucherNo(
    voucherId,
    updateVoucher,
    (err, affectedRows) => {
      if (err) {
        return res.status(500).json({ error: "Failed to update data" });
      }
      if (affectedRows === 0) {
        return res.status(404).json({ error: "Data not found" });
      }
      res.status(204).end();
    }
  );
};

exports.deleteDataByVoucherNo = (req, res) => {
  const voucherId = req.params.vc_no;

  voucherModel.deleteByVcNo(voucherId, (err, affectedRows) => {
    if (err) {
      return res.status(500).json({ error: "Failed to delete data" });
    }
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Data not found" });
    }
    res.status(204).end();
  });
};

exports.deleteDataById = (req, res) => {
  const categoryId = req.params.id;

  voucherModel.deleteById(categoryId, (err, affectedRows) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Failed to delete data", error: err?.sqlMessage });
    }
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Data not found" });
    }
    res.status(204).end();
  });
};

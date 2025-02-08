const connection = require("../../../config/db.js");

const AllJournamModel = {
  create: (acc_vouchers, callback) => {
    connection.query(
      "INSERT INTO acc_vouchers SET ?",
      acc_vouchers,
      (err, result) => {
        if (err) {
          callback(err, null);
          return;
        }
        callback(null, result.insertId);
      }
    );
  },

  getAll: (callback) => {
    connection.query("SELECT * FROM acc_vouchers", (err, rows) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, rows);
    });
  },

  getById: (catId, callback) => {
    connection.query(
      "SELECT * FROM acc_vouchers WHERE journal_id  = ?",
      catId,
      (err, rows) => {
        if (err) {
          callback(err, null);
          return;
        }
        callback(null, rows[0]);
      }
    );
  },

  getByVcNo: (vcno, callback) => {
    connection.query(
      "SELECT * FROM acc_vouchers WHERE vc_no = ?",
      vcno,
      (err, rows) => {
        if (err) {
          callback(err, null);
          return;
        }
        callback(null, rows);
      }
    );
  },

  getByDateRange: (startDate, endDate, callback) => {
    connection.query(
      `SELECT * FROM acc_vouchers WHERE vc_date >= ? AND vc_date <= ? AND 
      is_posted =1 ORDER BY STR_TO_DATE(vc_date, '%Y-%m-%d'),vc_type`,
      [startDate, endDate],
      (err, rows) => {
        if (err) {
          callback(err, null);
          return;
        }
        callback(null, rows);
      }
    );
  },

  getByLedgerDateRange: (ledgerId, startDate, endDate, callback) => {
    const query = `SELECT * FROM acc_vouchers WHERE ledger_id = ? AND 
      vc_date >= ? AND vc_date <= ? AND 
      active =1 ORDER BY STR_TO_DATE(vc_date, '%Y-%m-%d')`;
    connection.query(query, [ledgerId, startDate, endDate], (err, rows) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, rows);
    });
  },

  partyLedgerModel: (ledgerId, startDate, endDate, callback) => {
    const query = `SELECT * FROM acc_vouchers WHERE ledger_id = ? AND 
      vc_date >= ? AND vc_date <= ? AND 
      active =1 ORDER BY STR_TO_DATE(vc_date, '%Y-%m-%d')`;
    connection.query(query, [ledgerId, startDate, endDate], (err, rows) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, rows);
    });
  },

  getOpeningBalance: (ledgerId, startDate, callback) => {
    const query = `
      SELECT COALESCE(SUM(COALESCE(debit, 0)), 0) - COALESCE(SUM(COALESCE(credit, 0)), 0) AS opening_balance
      FROM acc_vouchers
      WHERE ledger_id = ? AND vc_date < ? AND active = 1
    `;
    connection.query(query, [ledgerId, startDate], (err, result) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, result[0]?.opening_balance || 0);
    });
  },

  customerOpeningBalance: (cusId, startDate, callback) => {
    const query = `
      SELECT COALESCE(SUM(COALESCE(debit, 0)), 0) - COALESCE(SUM(COALESCE(credit, 0)), 0) AS opening_balance
      FROM acc_vouchers
      WHERE (tag_supp = ? OR tag_client = ? OR tag_farmer = ?)
        AND vc_date < ? 
        AND active = 1
    `;
    connection.query(query, [cusId, cusId, cusId, startDate], (err, result) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, result[0]?.opening_balance || 0);
    });
  },

  // getOpeningBalance: (ledgerId, startDate, callback) => {
  //   const query = `
  //   SELECT SUM(debit) - SUM(credit) AS opening_balance
  //   FROM acc_vouchers
  //   WHERE vc_date < ? AND ledger_id = ? AND active = 1
  // `;
  //   connection.query(query, [startDate, ledgerId], (err, result) => {
  //     if (err) {
  //       callback(err, null);
  //       return;
  //     }
  //     callback(null, result[0]?.opening_balance || 0);
  //   });
  // },

  receivedAndPaymentModel: (startDate, endDate, callback) => {
    connection.query(
      `SELECT * FROM acc_vouchers WHERE vc_date >= ? AND vc_date <= ? AND vc_type !=1
       AND active =1 AND post_type !=1 ORDER BY STR_TO_DATE(vc_date, '%Y-%m-%d')`,
      [startDate, endDate],
      (err, rows) => {
        if (err) {
          callback(err, null);
          return;
        }
        callback(null, rows);
      }
    );
  },

  cashBookModel: (startDate, endDate, ledgerId, callback) => {
    connection.query(
      `SELECT * FROM acc_vouchers WHERE vc_date >= ? AND vc_date <= ? 
      AND ledger_id = ? AND (vc_type = 2 OR vc_type = 4)
       AND active =1 AND post_type =1 ORDER BY STR_TO_DATE(vc_date, '%Y-%m-%d')`,
      [startDate, endDate, ledgerId],
      (err, rows) => {
        if (err) {
          callback(err, null);
          return;
        }
        callback(null, rows);
      }
    );
  },

  bankBookModel: (startDate, endDate, ledgerId, callback) => {
    connection.query(
      `SELECT * FROM acc_vouchers WHERE vc_date >= ? AND vc_date <= ? 
       AND ledger_id = ? AND (vc_type = 3 OR vc_type = 5)
       AND active =1 AND post_type =1 ORDER BY STR_TO_DATE(vc_date, '%Y-%m-%d')`,
      [startDate, endDate, ledgerId],
      (err, rows) => {
        if (err) {
          callback(err, null);
          return;
        }
        callback(null, rows);
      }
    );
  },

  updateById: (voucherId, updateByVoucherId, callback) => {
    connection.query(
      "UPDATE acc_vouchers SET ? WHERE journal_id = ?",
      [updateByVoucherId, voucherId],
      (err, result) => {
        if (err) {
          callback(err, null);
          return;
        }
        callback(null, result.affectedRows);
      }
    );
  },

  updateByVoucherNo: (journalId, update, callback) => {
    const {
      ledger_id,
      narration,
      debit,
      credit,
      vc_date,
      bank_name,
      cheque_date,
      branch_name,
      cheque_no,
    } = update;
    connection.query(
      "UPDATE acc_vouchers SET ledger_id = ?, narration = ?, debit = ?, credit = ?, vc_date = ?, bank_name = ?, cheque_date = ?, branch_name = ?, cheque_no = ? WHERE journal_id = ?",
      [
        ledger_id,
        narration,
        debit,
        credit,
        vc_date,
        bank_name,
        cheque_date,
        branch_name,
        cheque_no,
        journalId,
      ],
      (err, result) => {
        if (err) {
          callback(err, null);
          return;
        }
        callback(null, result.affectedRows);
      }
    );
  },

  updatePostedByVoucherNo: (voucherId, updateVoucher, callback) => {
    connection.query(
      "UPDATE acc_vouchers SET ? WHERE vc_no = ?",
      [updateVoucher, voucherId],
      (err, result) => {
        if (err) {
          callback(err, null);
          return;
        }
        callback(null, result.affectedRows);
      }
    );
  },

  deleteByVcNo: (voucherId, callback) => {
    connection.query(
      "DELETE FROM acc_vouchers WHERE vc_no = ?",
      voucherId,
      (err, result) => {
        if (err) {
          callback(err, null);
          return;
        }
        callback(null, result.affectedRows);
      }
    );
  },

  deleteById: (acc_vouchersId, callback) => {
    connection.query(
      "DELETE FROM acc_vouchers WHERE journal_id = ?",
      acc_vouchersId,
      (err, result) => {
        if (err) {
          callback(err, null);
          return;
        }
        callback(null, result.affectedRows);
      }
    );
  },
};

module.exports = AllJournamModel;

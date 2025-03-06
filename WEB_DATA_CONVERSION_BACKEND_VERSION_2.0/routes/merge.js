const express = require("express");
const { mergeCSV } = require("../controllers/MergeCsv/mergecsv");
const {
  checkTempalte,
  getTableData,
  getTableHeaders,
} = require("../controllers/MergeCsv/checkTemplate");
const { checkDuplicates } = require("../controllers/MergeCsv/checkDuplicate");
const { viewDuplicates, getImageCol } = require("../controllers/MergeCsv/viewDuplicates");
const { deleteDuplicate, updateDuplicate } = require("../controllers/MergeCsv/updateDuplicate");
const router = express.Router();

router.post("/mergecsv", mergeCSV);
router.post("/checkmergecsv", checkTempalte);
router.get("/gettabledata/:templateId", getTableHeaders);

router.post("/checkduplicates",checkDuplicates);
router.post("/viewDuplicates",viewDuplicates);
router.get("/getImageCol",getImageCol);
router.put("/updateRow",updateDuplicate);
router.delete("/deleteRow",deleteDuplicate);

module.exports = router;

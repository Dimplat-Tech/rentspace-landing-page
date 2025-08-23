const express = require("express");
const bodyParser = require("body-parser");
const ExcelJS = require("exceljs");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const FILE_PATH = "waitlist.xlsx";

// Ensure file exists with headers
async function initExcelFile() {
  if (!fs.existsSync(FILE_PATH)) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Waitlist");

    worksheet.columns = [
      { header: "Full Name", key: "name", width: 30 },
      { header: "Email", key: "email", width: 30 },
      { header: "Phone", key: "phone", width: 20 },
    ];

    await workbook.xlsx.writeFile(FILE_PATH);
    console.log("✅ New Excel file created.");
  }
}

// Add new entry into Excel
async function addToExcel(entry) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(FILE_PATH);
  const worksheet = workbook.getWorksheet("Waitlist");

  worksheet.addRow(entry);

  await workbook.xlsx.writeFile(FILE_PATH);
  console.log("✅ New entry added to Excel:", entry);
}

// Endpoint to handle form submissions
app.post("/submit", async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: "All fields required" });
  }

  await addToExcel({ name, email, phone });
  res.json({ message: "✅ Added to waitlist!" });
});

// Endpoint for admin to download Excel
app.get("/download", (req, res) => {
  res.download(FILE_PATH, "waitlist.xlsx");
});

initExcelFile();

app.listen(5000, () =>
  console.log("✅ Server running on http://localhost:5000")
);

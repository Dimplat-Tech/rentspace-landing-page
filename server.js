// server.js
const express = require("express");
const bodyParser = require("body-parser");
const ExcelJS = require("exceljs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Store responses in memory (use a DB for production!)
let responses = [];

// Endpoint to handle form submissions
app.post("/submit", (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: "All fields required" });
  }

  responses.push({ name, email, phone });
  res.json({ message: "✅ Added to waitlist!" });
});

// Endpoint for admin to download Excel
app.get("/download", async (req, res) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Waitlist");

  worksheet.columns = [
    { header: "Full Name", key: "name", width: 30 },
    { header: "Email", key: "email", width: 30 },
    { header: "Phone", key: "phone", width: 20 },
  ];

  worksheet.addRows(responses);

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=waitlist.xlsx"
  );
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  await workbook.xlsx.write(res);
  res.end();
});

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));

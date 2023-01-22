import express from "express";
import morgan from "morgan";
import cors from "cors";

// Import routes
import projectsRoutes from "./routes/projects.routes.js";
import workpackagesRoutes from "./routes/workpackages.routes.js";
import usersRoutes from "./routes/user.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import { readCsv, validateEmailQueue, validateEmails } from "./utils/readCsv.js";
import multer from "multer";
import { uploadFile } from "./controllers/upload.controller.js";
import { createFile } from "./utils/csvFile.js";
const upload = multer({ dest: "uploads/" });
const app = express();

// middleware
app.use(morgan("dev"));
app.use(express.json());

app.use(cors());
app.options('*', cors());
// routes
app.use("/api/projects", projectsRoutes);
app.use("/api/workpackages", workpackagesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/api/download", async (req,res)=> {
  
 let downloadStatus = await createFile(req.query?.name)
 const uploadFilePath = `${process.cwd()}/uploads/download`;
//  res.sendFile(uploadFilePath,`${req.query?.name}.csv`);
var options = {
  root: `${process.cwd()}/uploads/download`,
};

let fileName = `${req.query?.name}.csv`;
res.download(fileName, options, function (err) {
  if (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "internal server error. please try again later" });

  } else {
    console.log("Sent:", fileName, "at", new Date().toString());
  }
});
//  res.status(200).json({ filePath: downloadStatus });
});
app.get("/", (req, res) => {
  const uploadFilePath = `${process.cwd()}/uploads`;
  // readCsv();
});
app.get("/getEamils", (req, res) => {
  validateEmails().then((response) => {
    res.json(response);
  });
});

// UPLOAD FILE START
app.post("/upload_files", upload.single("files"), uploadFiles);
function uploadFiles(req, res) {
//   console.log(req.body);
  const {  phoneNumber } = req.body;
  console.log(req.file)
  uploadFile({
    filePath: req.file.path,
    fileName: req.file.filename,
    mimeType:req.file.mimetype,
    phoneNumber,
  });
  if (req.body.phoneNumber) {
    const uploadFilePath = `${process.cwd()}/uploads/${req.file.filename}`;
    readCsv(uploadFilePath);
    res.json({ message: "Successfully uploaded files" });

  } else {
    res.json({ message: "Failed Successfully uploaded files" });
  }

  console.log(req.file);

  // UPLOAD FILE END
}

app.get("/runQueue", validateEmailQueue);

export default app;

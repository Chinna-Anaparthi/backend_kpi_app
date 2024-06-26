var express = require("express");
const mongoose = require("mongoose");
const serverLogic = require("../controller/kpiService");
require('dotenv').config();

const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(cors());
const ip = "localhost";
// console.log(process.env.DATAURL,"12");


const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT;


mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.get("/api/getCategoryQuestions", (req, res, next) => {
  serverLogic.adminMetricsget(req, res, () => {});
});

app.post("/api/addCategoryQuestions", (req, res, next) => {
  serverLogic.adminMetricspost(req, res, () => {});
});

app.put("/api/updateCategoryQuestions/:id", (req, res, next) => {
  serverLogic.adminMetricsupdate(req, res, () => {});
});

app.delete(
  "/api/removeMetrics/:role?/:categoryName?/:subCategoryName?/:metric?",
  (req, res, next) => {
    console.log(req.params.role, "44");
    serverLogic.adminprocessKpidelete(req, res, () => {});
  }
);

// ProcessKPI Collections-
app.get("/api/getMetrics/:role?", (req, res, next) => {
  serverLogic.adminprocessKpiget(req, res, () => {});
});

app.get("/api/searchMetrics/:role?/:categoryName?", (req, res, next) => {
  serverLogic.searchMetrics(req, res, () => {});
});

app.post("/api/addMetrics", (req, res, next) => {
  serverLogic.adminprocessKpipost(req, res, () => {});
});

app.patch(
  "/api/updateProcessKpi/:id?/:categoryName?/:subCategoryName?/:metric?",
  (req, res, next) => {
    serverLogic.processKpiUpdateByIdForAdmin(req, res, () => {});
  }
);

app.patch(
  "/api/addNewProcessKpiInExisting/:id?/:categoryName?/:subCategoryName?",
  (req, res, next) => {
    serverLogic.processKpiAddNewInExistingByIdForAdmin(req, res, () => {});
  }
);
app.put("/api/updateEmployeeMetrics/:id", (req, res, next) => {
  serverLogic.adminProcessKpiUpdateById(req, res, () => {});
});

// EMPLOYEE LOGIN

// Registration 
app.post("/api/register", (req, res, next) => {
  serverLogic.registration(req, res, () => {});
});
app.post("/api/login", (req, res, next) => {
  serverLogic.appLogin(req, res, () => {});
});
app.get("/api/getEmployee", (req, res, next) => {
  serverLogic.getEmployeeDetails(req, res, () => {});
});
app.get("/api/getEmployeeByRole/:role", (req, res, next) => {
  serverLogic.getManagerList(req, res, () => {});
});
app.get("/api/getEmployee/:empId", (req, res, next) => {
  console.log(req.params,"93");
  serverLogic.getEmployeeByID(req, res, () => {});
});


app.get("/api/getEmployee/:empId/:Quater?", (req, res, next) => {
  serverLogic.employeeCollection_get(req, res, () => {});
});

app.put("/api/updateEmployee", (req, res, next) => {
  serverLogic.employeeCollection_put(req, res, () => {});
});

app.listen(port, ip, () => {
  console.log(`Server listening on port http://${ip}:${port}`);
});

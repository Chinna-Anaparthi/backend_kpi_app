var express = require("express");
const mongoose = require("mongoose");
const serverLogic = require("../controller/kpiService")
const dotenv = require("dotenv").config()
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT || 4000;
// const ip = "172.17.15.150";

mongoose.connect(process.env.Mongoose_Url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("kpi_app dataBase connected.");
    })
    .catch((error) => {
        console.log(error);
    });


////metrics-apis
app.post("/api/addCategoryQuestions", (req, res, next) => {
  serverLogic.adminMetricspost(req, res, () => { });
});

app.get("/api/addCategoryQuestions", (req, res, next) => {
  serverLogic.adminMetricsget(req, res, () => { });
});

app.put("/api/addCategoryQuestions/:id", (req, res, next) => {
  serverLogic.adminMetricsupdate(req, res, () => { });
});

////processKpi-apis
app.post("/api/addMetrics", (req, res, next) => {
  serverLogic.adminprocessKpipost(req, res, () => { });
});
app.get("/api/getMetrics/:role?", (req, res, next) => {
  serverLogic.adminprocessKpiget(req, res, () => { });
});

app.delete("/api/removeMetrics/:role/:categoryName?", (req, res, next) => {
  serverLogic.adminprocessKpidelete(req, res, () => { });
});

app.put("/api/updateEmployeeMetrics", (req, res, next) => {
  serverLogic.adminprocessKpiupdate(req, res, () => { });
});
/////employeeCollection
app.post("/api/registerEmployee", (req, res, next) => {
  serverLogic.employeeCollection_post(req, res, () => { });
});

app.get("/api/getEmployee/:empId/:Quater?", (req, res, next) => {
  serverLogic.employeeCollection_get(req, res, () => { });
});

app.put("/api/updateEmployee", (req, res, next) => {
  serverLogic.employeeCollection_put(req, res, () => { });
});

app.listen(port, () => {
    console.log(`Server listening on port http://localhost:${port}`);
});
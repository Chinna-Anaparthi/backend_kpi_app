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
const ip = "172.17.15.58";
console.log(process.env.DATAURL,"12");
mongoose.connect('mongodb+srv://vandana:IGQelYrm0sl0a4kQ@cluster0.cgjnb8m.mongodb.net/kpi_Models?retryWrites=true&w=majority&appName=Cluster0', {
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

app.get("/api/getCategoryQuestions", (req, res, next) => {
  serverLogic.adminMetricsget(req, res, () => { });
});

app.put("/api/updateCategoryQuestions/:id", (req, res, next) => {
  serverLogic.adminMetricsupdate(req, res, () => { });
});

////processKpi-apis
app.post("/api/addMetrics", (req, res, next) => {
  serverLogic.adminprocessKpipost(req, res, () => { });
});

app.get("/api/getMetrics/:role?", (req, res, next) => {
  serverLogic.adminprocessKpiget(req, res, () => { });
});

app.delete("/api/removeMetrics/:role?/:categoryName?/:subCategoryName?/:metric?", (req, res, next) => {
  serverLogic.adminprocessKpidelete(req, res, () => { });
});
app.patch("/api/updateEmployeeMetrics/:role?/:categoryName?/:subCategoryName?/:metric?", (req, res, next) => {
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




app.listen(port,ip, () => {
    console.log(`Server listening on port http://${ip}:${port}`);
});
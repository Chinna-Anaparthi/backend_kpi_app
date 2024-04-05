var express = require("express");
const mongoose = require("mongoose");
const serverLogic = require("../controller/kpiService")
const dotenv = require("dotenv").config()
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT || 5000;
const ip = "172.17.15.58";
console.log(process.env.DATAURL,"12");
//database connection
mongoose.connect('mongodb+srv://subhamkvgms112:G1mCn9lA2ikBQEO3@cluster0.gy0dwhf.mongodb.net/', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("kpi_app dataBase connected.");
    })
    .catch((error) => {
        console.log(error);
    });



    // Admin
    // Metrics
    

app.get("/api/getCategoryQuestions", (req, res, next) => {
  serverLogic.adminMetricsget(req, res, () => { });
});


app.post("/api/addCategoryQuestions", (req, res, next) => {
  serverLogic.adminMetricspost(req, res, () => { });
});

app.put("/api/updateCategoryQuestions/:id", (req, res, next) => {
  serverLogic.adminMetricsupdate(req, res, () => { });
});

app.delete("/api/removeMetrics/:role?/:categoryName?/:subCategoryName?/:metric?", (req, res, next) => {
  serverLogic.adminprocessKpidelete(req, res, () => { });
});


// ProcessKPI Collections-
app.get("/api/getMetrics/:role?", (req, res, next) => {
  serverLogic.adminprocessKpiget(req, res, () => { });
});

////processKpi-apis
app.post("/api/addMetrics", (req, res, next) => {
  serverLogic.adminprocessKpipost(req, res, () => { });
});

app.patch("/api/updateEmployeeMetrics/:role?/:categoryName?/:subCategoryName?/:metric?", (req, res, next) => {
  serverLogic.adminprocessKpiupdate(req, res, () => { });
});


app.put("/api/updateEmployeeMetrics/:id", (req, res, next) => {
  serverLogic.adminProcessKpiUpdateByRole(req, res, () => { });
});








// Employee Collection



app.get("/api/getEmployee/:empId/:Quater?", (req, res, next) => {
  serverLogic.employeeCollection_get(req, res, () => { });
});

/////employeeCollection
app.post("/api/registerEmployee", (req, res, next) => {
  serverLogic.employeeCollection_post(req, res, () => { });
});



app.put("/api/updateEmployee", (req, res, next) => {
  serverLogic.employeeCollection_put(req, res, () => { });
});




app.listen(port,ip, () => {
    console.log(`Server listening on port http://${ip}:${port}`);
});
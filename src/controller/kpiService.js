const Metrics = require("../databaseModels/metrics");
const ProcessKPI = require("../databaseModels/processKpi");
const Employee = require("../databaseModels/employeeKpi");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

const jwtSecret = "KPI Application";

const registration = (req, res1) => {
  let modelData = [];
  let defaultQuater=[];
  const {
    empId,
    firstName,
    lastName,
    phone,
    email,
    role,
    userName,
    practice,
    password,
    location,
    managerName,
    directorName,
    hrName,
    profileImag,
    team,
    quater,
  } = req.body;
  const findProcessKPI = (role) => {
    return ProcessKPI.find({ role: role === 'Employee' ? 'employee' : role === 'Manager' ? 'manager' : 'director' });
  };
  findProcessKPI(role)
    .then((data) => {
      modelData = data;
      defaultQuater = [
       {
         quater: "Quarter1",
         year: "2024",
         score: "0",
         status: "InCompleted",
         timeLine:['March','April'],
         processKPI: modelData[0].processKpi,
       },
       {
         quater: "Quarter2",
         year: "2024",
         score: "0",
         status: "InCompleted",
         timeLine:['June','July'],
         processKPI: modelData[0].processKpi,
       },
       {
         quater: "Quarter3",
         year: "2024",
         score: "0",
         status: "InCompleted",
         timeLine:['September','October'],
         processKPI:modelData[0].processKpi,
       },
       {
         quater: "Quarter4",
         year: "2024",
         score: "0",
         status: "InCompleted",
         timeLine:['December','January'],
         processKPI:modelData[0].processKpi,
       },
     ];

      if (!firstName || !lastName || !role || !email || !phone || !password) {
        throw new Error("All fields (First_name, Last_name, Role, Email, Phone, and Password) are required.");
      }

      return Promise.all([Employee.findOne({ email }), Employee.findOne({ phone })]);
    })
    .then(([existingUser, existingPhoneNumber]) => {
      if (existingUser) {
        throw new Error("This Email is already registered. Please use a different email.");
      }
      if (existingPhoneNumber) {
        throw new Error("This phone number is already registered. Please use a different phone number.");
      }

      if (quater.length === 0) {
        defaultQuater.forEach((element) => {
          quater.push(element);
        });
      }
      const newUserRegistration = new Employee({
        _id: new mongoose.Types.ObjectId(),
        empId,
        firstName,
        lastName,
        phone,
        email,
        role,
        userName,
        practice,
        password,
        location,
        managerName,
        directorName,
        hrName,
        profileImag,
        team,
        quater,
      });

      return newUserRegistration.save();
    })
    .then((res) => {
      if(res && res._id){
      Employee.find({userName:res.managerName}).then((mData)=>{
      mData[0].team.push(res._id)
            const filter ={userName:res.managerName}
            const update = { $set:mData[0] };
            Employee.updateOne(filter, update).then((result)=>{
             
              if( result.modifiedCount !==0){
                res1.status(201).json({
                  status: 200,
                  success: true,
                  message: "User Successfully Registered...! Now You Can Login",
                });

              }
            });
      })
      }
      

     //console.log(res,"124");
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        success: false,
        message: "Error occurred while registering user",
        error: error.message,
      });
    });
};
const appLogin = async (req, res) => {
  console.log(req.body, "94");
  if (!req.body.password || !req.body.email) {
    return res.status(400).json({ error: "Password and Email are required." });
  }

  try {
    const user = await Employee.findOne({ email: req.body.email });
    console.log(user,"139");
    let tokenData = {
      data:user
    };

   
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    if (user.password !== req.body.password) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = jwt.sign(tokenData, jwtSecret, { expiresIn: "1h" });

    res.status(200).json({ message: "Authentication successful.", token });
  } catch (error) {
    // logger.error('Error checking user:', error);
    res.status(500).json({ error: "An error occurred while checking user." });
  }
};
const getEmployeeDetails= async(req,res)=>{
  try {
    // Fetch all KPI documents from the database
    const empInfo = await Employee.find();

    return res.status(200).json({
      status: 200,
      success: true,
      data: empInfo,
      message: "Logged Employee data retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      error: "An error occurred while fetching data.",
    });
  }
}
const getManagerList = async (req, res) => {
  let managerData =[]
  try {
    // Fetch all KPI documents from the database
    const kpiData = await Employee.find({role:req.params.role});
console.log(kpiData,"189");

kpiData.forEach((element)=>{
  managerData.push({
    empId:element.empId,
    name: element.firstName +' ' +element.lastName,
    userName:element.userName,
    email:element.email,
  })
  
 
})
return res.status(200).json({
  status: 200,
  success: true,
  data: managerData,
  message: "Manager Information data retrieved successfully",
});
   
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      error: "An error occurred while fetching data.",
    });
  }
};
const getEmployeeByID = async (req, res) => {
  try {
    // Fetch all KPI documents from the database
    const kpiData = await Employee.find({empId:req.params.empId});

    return res.status(200).json({
      status: 200,
      success: true,
      data: kpiData,
      message: "metricKpi data retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      error: "An error occurred while fetching data.",
    });
  }
};

const adminMetricsget = async (req, res) => {
  try {
    // Fetch all KPI documents from the database
    const kpiData = await Metrics.find();

    return res.status(200).json({
      status: 200,
      success: true,
      data: kpiData,
      message: "metricKpi data retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      error: "An error occurred while fetching data.",
    });
  }
};
//post api in admin metrics
const adminMetricspost = async (req, res) => {
  try {
    const { category, subCategory, metrics } = req.body;
    const newKpi = new Metrics({
      _id: new mongoose.Types.ObjectId(),
      category,
      subCategory,
      metrics,
    });
    const savedKpi = await newKpi.save();

    return res.status(201).json({
      status: 200,
      success: true,
      data: savedKpi,
      message: "metricsKpidata added successfully",
    });
  } catch (error) {
    console.error("Error adding data:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      error: "An error occurred while adding data.",
    });
  }
};

//updateapi employee screen

const adminMetricsupdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, subCategory, metrics } = req.body;

    // Find the Kpi document by ID and update its fields
    const updatedKpi = await Metrics.find({ _id: id });

    if (updatedKpi[0].category.length > 0) {
      category.forEach((ele) => {
        if (!updatedKpi[0].category.includes(ele)) {
          updatedKpi[0].category.push(ele);
        }
      });
      if (updatedKpi[0].subCategory.length > 0) {
        subCategory.forEach((ele) => {
          if (!updatedKpi[0].subCategory.includes(ele)) {
            updatedKpi[0].subCategory.push(ele);
          }
        });
        if (updatedKpi[0].metrics.length > 0) {
          metrics.forEach((ele) => {
            if (!updatedKpi[0].metrics.includes(ele)) {
              updatedKpi[0].metrics.push(ele);
            }
          });
        }
      }
      if (updatedKpi) {
        const filter = { _id: new ObjectId(updatedKpi[0]._id) };
        await Metrics.findByIdAndUpdate(filter, updatedKpi[0]);
        return res.status(200).json({
          status: 200,
          success: true,
          message: "Metric Added Successfully",
        });
      } else {
        // If no deletion operation was performed
        return res.status(404).json({
          status: 404,
          success: false,
          error: "No data found for deletion",
        });
      }
    }
    // Check if the document was found and updated
  } catch (error) {
    console.error("Error updating data:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      error: "An error occurred while updating data.",
    });
  }
};

//delete api

const adminprocessKpidelete = async (req, res) => {
  var dataInfo = [];
  try {
    const { role } = req.params.role;
    // console.log(req.params.role,"102");
    const queryRole = await ProcessKPI.findOne({
      role: req.params.role,
    });
    dataInfo = queryRole;

    let deletionPerformed = false;
    // console.log(dataInfo,"106");
    dataInfo.processKpi.forEach((element, index) => {
      console.log(element, index);
      if (
        req.params.categoryName &&
        req.params.subCategoryName === undefined &&
        req.params.metric === undefined
      ) {
        if (element.categoryName === req.params.categoryName) {
          queryRole.processKpi.splice(index, 1);
          deletionPerformed = true;
        }
      }
      if (
        req.params.categoryName &&
        req.params.subCategoryName &&
        req.params.metric === undefined
      ) {
        element.subCategory.forEach((subEle, subIndex) => {
          if (element.categoryName === req.params.categoryName) {
            if (subEle.subCategoryName === req.params.subCategoryName) {
              queryRole.processKpi[index].subCategory.splice(subIndex, 1);
              deletionPerformed = true;
            }
          }
        });
      }
      if (
        req.params.categoryName &&
        req.params.subCategoryName &&
        req.params.metric
      ) {
        element.subCategory.forEach((subEle, subIndex) => {
          if (element.categoryName === req.params.categoryName) {
            if (subEle.subCategoryName === req.params.subCategoryName) {
              subEle.queries.forEach((mEle, mIndex) => {
                if (mEle.metric === req.params.metric) {
                  queryRole.processKpi[index].subCategory[
                    subIndex
                  ].queries.splice(mIndex, 1);
                  deletionPerformed = true;
                }
              });
            }
          }
        });
      }
    });
    //console.log(queryRole,"141");
    if (deletionPerformed) {
      const filter = { role: req.params.role };
      const update = { $set: { processKpi: queryRole.processKpi } };
      const result = await ProcessKPI.updateMany(filter, update);
      //  console.log(result,"252",res);

      //await ProcessKPI.updateOne(req.params.role, queryRole);
      return res.status(200).json({
        status: 200,
        success: true,
        message: "processKpiData deleted successfully",
      });
    } else {
      // If no deletion operation was performed
      return res.status(404).json({
        status: 404,
        success: false,
        error: "No data found for deletion",
      });
    }
  } catch (error) {
    console.error("Error deleting data:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      error: "An error occurred while deleting data.",
    });
  }
};

// ProcessKPI Collections-

//get api
const adminprocessKpiget = async (req, res) => {
  try {
    const role = req.params.role;
    const query = role ? { role } : {};
    const kpiData = await ProcessKPI.find(query);
    if (!kpiData) {
      return res.status(404).json({
        status: 404,
        success: false,
        error: "No processKpi data found",
      });
    }

    return res
      .status(200)
      .json({ status: 200, success: true, response: kpiData });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      error: "An error occurred while fetching data.",
    });
  }
};

//Serach Api For Finding CategoryName
const searchMetrics = async (req, res) => {
  try {
    console.log(req.query, "260");
    const kpiData = await ProcessKPI.find({ role: req.query.role });
    if (kpiData[0].processKpi.length > 0) {
      kpiData[0].processKpi.forEach((element) => {
        if (element.categoryName === req.query.categoryName) {
          console.log(element, "265");
          return res
            .status(200)
            .json({ status: 200, success: true, response: element });
        } else {
          return res.status(404).json({
            status: 404,
            success: false,
            error: "No Matched Record Found",
          });
        }
      });
    } else {
      return res.status(404).json({
        status: 404,
        success: false,
        error: "No processKpi data found",
      });
    }

    //   if (!kpiData) {
    //     return res
    //       .status(404)
    //       .json({
    //         status: 404,
    //         success: false,
    //         error: "No processKpi data found",
    //       });
    //   }

    //   return res
    //     .status(200)
    //     .json({ status: 200, success: true, response: kpiData });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      error: "An error occurred while fetching data.",
    });
  }
};

//post api
const adminprocessKpipost = async (req, res) => {
  try {
    // Extract data from request body
    const { role, processKpi } = req.body;

    // Create a new Kpi document
    const newKpi = new ProcessKPI({
      _id: new mongoose.Types.ObjectId(),
      role,
      processKpi,
    });

    // Save the new Kpi document to the database
    const savedKpi = await newKpi.save();

    return res.status(201).json({
      status: 200,
      success: true,
      data: savedKpi,
      message: "processKpidata added successfully",
    });
  } catch (error) {
    console.error("Error adding data:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      error: "An error occurred while adding data.",
    });
  }
};
//patch api

const processKpiUpdateByIdForAdmin = async (req, res) => {
  const { id } = req.params;
  let errorResResult = "";
  try {
    let modelData = await ProcessKPI.find({ _id: id });
    if (
      modelData !== undefined ||
      (modelData.length !== 0 && modelData[0].role === "employee")
    ) {
      modelData[0].processKpi.forEach((element, index) => {
        if (
          req.params.categoryName &&
          req.params.subCategoryName === undefined &&
          req.params.metric === undefined
        ) {
          if (element.categoryName === req.params.categoryName) {
            //element.categoryName = req.body.categoryName
            element.subCategory.push(req.body);
          }
        }
        if (
          req.params.categoryName &&
          req.params.subCategoryName &&
          req.params.metric === undefined
        ) {
          element.subCategory.forEach((subEle, subIndex) => {
            if (element.categoryName === req.params.categoryName) {
              if (subEle.subCategoryName === req.params.subCategoryName) {
                //subEle.subCategoryName = req.body.subCategoryName
                if (req.params.metric === undefined) {
                  subEle.queries.forEach((mEle, mIndex) => {
                    console.log(mEle, "246");
                    if (mEle.metric !== req.body.metric) {
                      subEle.queries.push(req.body);
                      console.log(
                        JSON.stringify(modelData),
                        "253",
                        errorResResult
                      );
                    } else {
                      errorResResult = req.body.metric + " is already exist.";
                      console.log("Error In 250");
                    }
                  });
                }
              }
            }
          });
        }
        if (
          req.params.categoryName &&
          req.params.subCategoryName &&
          req.params.metric
        ) {
          element.subCategory.forEach((subEle, subIndex) => {
            if (element.categoryName === req.params.categoryName) {
              if (subEle.subCategoryName === req.params.subCategoryName) {
                subEle.queries.forEach((mEle, mIndex) => {
                  if (mEle.metric === req.params.metric) {
                    mEle.metric =
                      req.body.metric === undefined
                        ? mEle.metric
                        : req.body.metric;
                    mEle.quantityTarget =
                      req.body.quantityTarget === undefined
                        ? mEle.quantityTarget
                        : req.body.quantityTarget;
                  }
                });
              }
            }
          });
        }
      });
      console.log(JSON.stringify(modelData), "253", errorResResult);
      const filter = { _id: new ObjectId(id) };
      const update = { $set: { processKpi: modelData[0].processKpi } };
      const result = await ProcessKPI.updateMany(filter, update);
      console.log(result.modifiedCount, "252");
      if (result.modifiedCount !== 0) {
        return res.status(200).json({
          status: 200,
          success: true,
          message: "KPI Is Updated Successfully",
        });
      } else {
        return res.json({
          status: 200,
          success: true,
          message: errorResResult,
        });
      }
    }
  } catch (error) {
    console.error("Error updating KPI Data:", error);
    return res.status(500).json({ status: 500, success: false, error: error });
  }
};

// Add New SubCategory or Metrics in Existing
const processKpiAddNewInExistingByIdForAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    let modelData = await ProcessKPI.find({ _id: id });
    if (
      modelData !== undefined ||
      (modelData.length !== 0 && modelData[0].role === "employee")
    ) {
      modelData[0].processKpi.forEach((element, index) => {
        if (
          req.params.categoryName &&
          req.params.subCategoryName === undefined
        ) {
          if (element.categoryName === req.params.categoryName) {
            element.subCategory.push(req.body);
          }
        }
        if (req.params.categoryName && req.params.subCategoryName) {
          element.subCategory.forEach((subEle, subIndex) => {
            if (element.categoryName === req.params.categoryName) {
              if (subEle.subCategoryName === req.params.subCategoryName) {
                subEle.queries.push(req.body);
              }
            }
          });
        }
      });
      //console.log(JSON.stringify(modelData),"253");
      const filter = { _id: new ObjectId(id) };
      const update = { $set: { processKpi: modelData[0].processKpi } };
      const result = await ProcessKPI.updateMany(filter, update);
      if (result.modifiedCount !== 0) {
        return res.status(200).json({
          status: 200,
          success: true,
          message: "New KPI Type is added Successfully",
        });
      } else {
        return res.status({
          success: false,
          message: "Error in Payload",
        });
      }
    }
  } catch (error) {
    console.error("Error updating KPI Data:", error);
    return res.status(500).json({ status: 500, success: false, error: error });
  }
};

//put api

const adminProcessKpiUpdateById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id, "sssssssssssss");
    let updatedEmployeeKpi = await ProcessKPI.find({ _id: id });

    if (req.body) {
      req.body.processKpi.forEach((element) => {
        // console.log(element,"Req Body");
        // console.log(updatedEmployeeKpi,"DB Res");

        updatedEmployeeKpi[0].processKpi.push(element);
      });
      const filter = { _id: new ObjectId(id) };
      const update = { $set: { processKpi: updatedEmployeeKpi[0].processKpi } };
      await ProcessKPI.updateMany(filter, update);
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Metric Added Successfully",
      });
    }
  } catch (error) {
    console.error("Error updating data:", error);
    return res.status(500).json({ status: 500, success: false, error: error });
  }
};

// Employee Collection controller service file

const employeeCollection_get = async (req, res) => {
  try {
    // Extract empId and Quater from the request parameters
    const { empId, Quater } = req.params;

    // Retrieve the employee with the specified empId from the database
    const employee = await Employee.findOne({ empId });

    // If the employee is found
    if (employee) {
      // If Quater is provided, find the specific Quater within the employee's Quater array
      if (Quater) {
        const selectedQuater = employee.Quater.find((q) => q.Quater === Quater);

        // If the Quater is found within the employee's Quater array, respond with it
        if (selectedQuater) {
          res
            .status(200)
            .json({ status: 200, success: true, response: selectedQuater });
        } else {
          // If the Quater is not found, respond with a 404 status
          res
            .status(404)
            .json({ message: "Quater not found for the specified empId" });
        }
      } else {
        // If Quater is not provided, respond with the entire employee data
        res
          .status(200)
          .json({ status: 200, success: true, response: employee });
      }
    } else {
      // If no employee is found with the specified empId, respond with a 404 status
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const employeeCollection_post = async (req, res) => {
  try {
    const {
      empId,
      firstName,
      lastName,
      email,
      role,
      practice,
      password,
      location,
      managerName,
      directorName,
      hrName,
      profileImag,
      Quater,
      totalKPI,
    } = req.body;

    const newEmployee = new Employee({
      _id: new mongoose.Types.ObjectId(),
      empId,
      firstName,
      lastName,
      email,
      role,
      practice,
      password,
      location,
      managerName,
      directorName,
      hrName,
      profileImag,
      Quater,
      totalKPI,
    });

    const savedEmployee = await newEmployee.save();

    return res.status(201).json({
      status: 200,
      success: true,
      data: savedEmployee,
      message: "employeeCollectionkpidata added successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const employeeCollection_put = async (req, res) => {
  try {
    const {
      empId,
      firstName,
      lastName,
      email,
      role,
      practice,
      password,
      location,
      managerName,
      directorName,
      hrName,
      profileImag,
      Quater,
      totalKPI,
    } = req.body;

    // Check if empId is present in the request body
    if (!empId) {
      return res
        .status(400)
        .json({ message: "empId is required in the request body" });
    }

    // Update the employee record
    const updatedEmployee = await Employee.findOneAndUpdate(
      { empId: empId }, // Filter based on empId
      {
        firstName,
        lastName,
        email,
        role,
        practice,
        password,
        location,
        managerName,
        directorName,
        hrName,
        profileImag,
        Quater,
        totalKPI,
      },
      { new: true } // To return the updated document
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      response: updatedEmployee,
      message: "employeeCollectionKpidata updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  registration,
  appLogin,
  adminMetricspost,
  adminMetricsget,
  adminMetricsupdate,
  adminprocessKpipost,
  adminprocessKpiget,
  employeeCollection_put,
  processKpiUpdateByIdForAdmin,
  adminprocessKpidelete,
  getEmployeeDetails,
  getManagerList,
  getEmployeeByID,
  employeeCollection_post,
  employeeCollection_get,
  employeeCollection_put,
  adminProcessKpiUpdateById,
  processKpiAddNewInExistingByIdForAdmin,
  searchMetrics,
};

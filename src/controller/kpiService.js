const databaseMetricsmodel = require("../databaseModels/metrics")
const databaseprocessKpimodel = require("../databaseModels/processKpi")
const databaseemployeeCoolection = require("../databaseModels/employeeKpi")
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

/////metrics
const adminMetricspost = async (req, res) => {
    try {
        // Extract data from request body
        const { category, subCategory, metrics } = req.body;

        // Create a new Kpi document
        const newKpi = new databaseMetricsmodel({
            _id: new mongoose.Types.ObjectId(),
            category,
            subCategory,
            metrics
        });

        // Save the new Kpi document to the database
        const savedKpi = await newKpi.save();

        return res.status(201).json({ status: 200, success: true, data: savedKpi, message: "metricsKpidata added successfully" });
    } catch (error) {
        console.error("Error adding data:", error);
        return res.status(500).json({ status: 500, success: false, error: "An error occurred while adding data." });
    }
}

const adminMetricsget = async (req, res) => {
    try {
        // Fetch all KPI documents from the database
        const kpiData = await databaseMetricsmodel.find();

        return res.status(200).json({ status: 200, success: true, data: kpiData, message: "metricKpi data retrieved successfully" });
    } catch (error) {
        console.error("Error fetching data:", error);
        return res.status(500).json({ status: 500, success: false, error: "An error occurred while fetching data." });
    }
}

const adminMetricsupdate = async (req, res) => {
    try {
        const { id } = req.params;
        const { category, subCategory, metrics } = req.body;

        // Find the Kpi document by ID and update its fields
        const updatedKpi = await databaseMetricsmodel.find({_id:id});

if(updatedKpi[0].category.length>0){
    category.forEach((ele)=>{
        if(!updatedKpi[0].category.includes(ele)){
            updatedKpi[0].category.push(ele)
        }
    })
    if(updatedKpi[0].subCategory.length>0){
        subCategory.forEach((ele)=>{
            if(!updatedKpi[0].subCategory.includes(ele)){
                updatedKpi[0].subCategory.push(ele)
            }
        })
        if(updatedKpi[0].metrics.length>0){
            metrics.forEach((ele)=>{
                if(!updatedKpi[0].metrics.includes(ele)){
                    updatedKpi[0].metrics.push(ele)
                }
            })
     
}
    }
    if (updatedKpi) {
        const filter = { _id: new ObjectId(updatedKpi[0]._id) };
        await databaseMetricsmodel.findByIdAndUpdate(filter, updatedKpi[0])
        return res.status(200).json({ status: 200, success: true, message: "Metric Added Successfully" });
    } else {
        // If no deletion operation was performed
        return res.status(404).json({ status: 404, success: false, error: "No data found for deletion" });
    }
}
        // Check if the document was found and updated
      
    } catch (error) {
        console.error("Error updating data:", error);
        return res.status(500).json({ status: 500, success: false, error: "An error occurred while updating data." });
    }
}
/////processKpi
const adminprocessKpipost = async (req, res) => {
    try {
        // Extract data from request body
        const { role, processKpi } = req.body;

        // Create a new Kpi document
        const newKpi = new databaseprocessKpimodel({
            _id: new mongoose.Types.ObjectId(),
            role,
            processKpi
        });

        // Save the new Kpi document to the database
        const savedKpi = await newKpi.save();

        return res.status(201).json({ status: 200, success: true, data: savedKpi, message: "processKpidata added successfully" });
    } catch (error) {
        console.error("Error adding data:", error);
        return res.status(500).json({ status: 500, success: false, error: "An error occurred while adding data." });
    }
};
const adminProcessKpiUpdateByRole = async (req, res) => {
    try {
        const { id } = req.params;
        

        // Find the Kpi document by ID and update its fields
        let updatedEmployeeKpi = await databaseprocessKpimodel.find({_id:id});
        
        if(req.body){
            req.body.processKpi.forEach((element)=>{
                console.log(element,"Req Body");
                console.log(updatedEmployeeKpi,"DB Res");

                updatedEmployeeKpi[0].processKpi.push(element)  
            })
            const filter = {'_id':new ObjectId(id) };
            const update = {$set: {processKpi:updatedEmployeeKpi[0].processKpi  }};
            await databaseprocessKpimodel.updateMany(filter,update)
            return res.status(200).json({ status: 200, success: true, message: "Metric Added Successfully" });
        }
       
}catch (error) {
    console.error("Error updating data:", error);
    return res.status(500).json({ status: 500, success: false, error: error });
}
}

const adminprocessKpiget = async (req, res) => {
    try {
        // Extract the role from the request parameters
        const role = req.params.role;

        // Define the query object based on whether a role is provided
        const query = role ? { role } : {};

        // Fetch KPI documents from the database based on the query
        const kpiData = await databaseprocessKpimodel.find(query);

        if (!kpiData) {
            return res.status(404).json({ status: 404, success: false, error: "No processKpi data found" });
        }

        return res.status(200).json({ status: 200, success: true, response: kpiData });
    } catch (error) {
        console.error("Error fetching data:", error);
        return res.status(500).json({ status: 500, success: false, error: "An error occurred while fetching data." });
    }
}












const processKpiUpdate =async(req,res)=>{

    //console.log(req.params.id,"110",updates);
    try {

        const employeeInfo = await databaseemployeeCoolection.find({ empId: req.params.empId })
        console.log(employeeInfo[1]);

        // await databaseemployeeCoolection.findByIdAndUpdate(employeeInfo, req.body, { useFindAndModify: false }).then(data => {
        //     if (!data) {
        //         res.status(404).send({
        //             message: `User not found.`
        //         });
        //     } else {
        //         console.log(req.body, employeeInfo);

        //         res.send({ message: "User updated successfully." })

        //         // return res.status(200).json({ message: 'Employee data updated successfully', employeeInfo: updateEMPLOYEE  });
        //     }
        // }).catch(err => {
        //     res.status(500).send({
        //         message: err.message
        //     });
        // });


        // if (!updatedEmployee) {
        //             return res.status(404).json({ error: 'Employee not found' });
        //         }

        // 
    } catch (error) {
            console.error('Error updating employee:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
 
}


const adminprocessKpiupdate = async (req, res) => {
    var dataInfo = []
    try {
        const { role } = req.params.role;
        const queryRole = await databaseprocessKpimodel.findOne(role);
        dataInfo = queryRole
        let UpdatationPerformed = false; // Flag to track if any deletion operation was performed
        console.log(dataInfo,"146");
        if (req.body.categoryName && req.body.subCategoryName && req.body.metric ) {
            // Construct the new data object
            const newData = {
                subCategoryName: req.body.subCategoryName,
                metric: req.body.metric
            };
        console.log(newData,"154");
            // Push the new data object into processKpi array
            queryRole.processKpi.push(newData);
            console.log(queryRole.processKpi,"157");
        
            // Set the flag to true since an update was performed
            UpdatationPerformed = true;
        }
            if (req.params.categoryName && req.params.subCategoryName && req.params.metric === undefined) {
                element.subCategory.forEach((subEle, subIndex) => {
                    if (element.categoryName === req.params.categoryName) {
                        if (subEle.subCategoryName === req.params.subCategoryName) {
                            queryRole.processKpi[index].subCategory.push(subIndex, 1);
                            UpdatationPerformed = true;
                        }
                    }
                })
            }
            if (req.params.categoryName && req.params.subCategoryName && req.params.metric) {
                element.subCategory.forEach((subEle, subIndex) => {
                    if (element.categoryName === req.params.categoryName) {
                        if (subEle.subCategoryName === req.params.subCategoryName) {
                            subEle.queries.forEach((mEle, mIndex) => {
                                if (mEle.metric === req.params.metric) {
                                    queryRole.processKpi[index].subCategory[subIndex].queries.push(mIndex, 1);
                                    UpdatationPerformed = true;
                                }
                            })
                        }
                    }
                })
            }
    

        if (UpdatationPerformed) {
            await databaseprocessKpimodel.updateOne(role, queryRole);
            return res.status(200).json({ status: 200, success: true, message: "processKpiData updated successfully" });
        } else {
            // If no deletion operation was performed
            return res.status(404).json({ status: 404, success: false, error: "No data found for updation" });
        }
    } catch (error) {
        console.error("Error deleting data:", error);
        return res.status(500).json({ status: 500, success: false, error: "An error occurred while deleting data." });
    }
};

const adminprocessKpidelete = async (req, res) => {
    var dataInfo = []
    try {
        const { role } = req.params.role;
        const queryRole = await databaseprocessKpimodel.findOne(role);
        dataInfo = queryRole
        let deletionPerformed = false; 

        dataInfo.processKpi.forEach((element, index) => {
            if (req.params.categoryName && req.params.subCategoryName === undefined && req.params.metric === undefined) {
                if (element.categoryName === req.params.categoryName) {
                    queryRole.processKpi.splice(index, 1);
                    deletionPerformed = true;
                }
            }
            if (req.params.categoryName && req.params.subCategoryName && req.params.metric === undefined) {
                element.subCategory.forEach((subEle, subIndex) => {
                    if (element.categoryName === req.params.categoryName) {
                        if (subEle.subCategoryName === req.params.subCategoryName) {
                            queryRole.processKpi[index].subCategory.splice(subIndex, 1);
                            deletionPerformed = true;
                        }
                    }
                })
            }
            if (req.params.categoryName && req.params.subCategoryName && req.params.metric) {
                element.subCategory.forEach((subEle, subIndex) => {
                    if (element.categoryName === req.params.categoryName) {
                        if (subEle.subCategoryName === req.params.subCategoryName) {
                            subEle.queries.forEach((mEle, mIndex) => {
                                if (mEle.metric === req.params.metric) {
                                    queryRole.processKpi[index].subCategory[subIndex].queries.splice(mIndex, 1);
                                    deletionPerformed = true;
                                }
                            })
                        }
                    }
                })
            }
        });

        if (deletionPerformed) {
            await databaseprocessKpimodel.updateOne(role, queryRole);
            return res.status(200).json({ status: 200, success: true, message: "processKpiData deleted successfully" });
        } else {
            // If no deletion operation was performed
            return res.status(404).json({ status: 404, success: false, error: "No data found for deletion" });
        }
    } catch (error) {
        console.error("Error deleting data:", error);
        return res.status(500).json({ status: 500, success: false, error: "An error occurred while deleting data." });
    }
};






/////employeeCollection
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
            totalKPI
        } = req.body;

        const newEmployee = new databaseemployeeCoolection({
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
            totalKPI
        });

        const savedEmployee = await newEmployee.save();

        return res.status(201).json({ status: 200, success: true, data: savedEmployee, message: "employeeCollectionkpidata added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const employeeCollection_get = async (req, res) => {
    try {
        // Extract empId and Quater from the request parameters
        const { empId, Quater } = req.params;

        // Retrieve the employee with the specified empId from the database
        const employee = await databaseemployeeCoolection.findOne({ empId });

        // If the employee is found
        if (employee) {
            // If Quater is provided, find the specific Quater within the employee's Quater array
            if (Quater) {
                const selectedQuater = employee.Quater.find(q => q.Quater === Quater);

                // If the Quater is found within the employee's Quater array, respond with it
                if (selectedQuater) {
                    res.status(200).json({ status: 200, success: true, response: selectedQuater });
                } else {
                    // If the Quater is not found, respond with a 404 status
                    res.status(404).json({ message: 'Quater not found for the specified empId' });
                }
            } else {
                // If Quater is not provided, respond with the entire employee data
                res.status(200).json({ status: 200, success: true, response: employee });
            }
        } else {
            // If no employee is found with the specified empId, respond with a 404 status
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

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
            totalKPI
        } = req.body;

        // Check if empId is present in the request body
        if (!empId) {
            return res.status(400).json({ message: "empId is required in the request body" });
        }

        // Update the employee record
        const updatedEmployee = await databaseemployeeCoolection.findOneAndUpdate(
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
                totalKPI
            },
            { new: true } // To return the updated document
        );

        if (!updatedEmployee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        return res.status(200).json({ status: 200, success: true, response: updatedEmployee, message: "employeeCollectionKpidata updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


module.exports = {
    adminMetricspost,
    adminMetricsget,
    adminMetricsupdate,
    adminprocessKpipost,
    adminprocessKpiget,
    processKpiUpdate,
    employeeCollection_put,
    adminprocessKpiupdate,
    adminprocessKpidelete,
    employeeCollection_post,
    employeeCollection_get,
    employeeCollection_put,
    adminProcessKpiUpdateByRole
};
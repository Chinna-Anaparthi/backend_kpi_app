const databaseMetricsmodel = require("../databaseModels/metrics")
const databaseprocessKpimodel = require("../databaseModels/processKpi")
const databaseemployeeCoolection = require("../databaseModels/employeeKpi")
const mongoose = require('mongoose');


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
        const updatedKpi = await databaseMetricsmodel.findByIdAndUpdate(id, { category, subCategory, metrics }, { new: true });

        // Check if the document was found and updated
        if (!updatedKpi) {
            return res.status(404).json({ status: 404, success: false, error: "KPI data not found" });
        }

        return res.status(200).json({ status: 200, success: true, data: updatedKpi, message: "metricsKpi data updated successfully" });
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

// const adminprocessKpiupdate = async (req, res) => {

//     const data = req.body;
//     if (!data || !data.role || !data.processKpi || !Array.isArray(data.processKpi)) {
//         return res.status(400).json({ error: "Invalid request body" });
//     }

//     try {
//         // Construct the update object with the new data
//         const updateObject = {
//             role:data.role,
//             processKpi: data.processKpi
//         };

//         // Update documents with the given role
//         const updatedKpi = await databaseprocessKpimodel.updateMany(
//             { role: data.role },
//             updateObject,
//             { new: true } // Return the updated documents
//         );

//         if (!updatedKpi) {
//             return res.status(404).json({ status: 404, success: false, error: "No KPI found for the provided role" });
//         }

//         return res.status(200).json({ status: 200, success: true, message: "processKpidata updated successfully" });
//     } catch (error) {
//         console.error("Error updating data:", error);
//         return res.status(500).json({ status: 500, success: false, error: "An error occurred while updating data." });
//     }
// };

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
        let deletionPerformed = false; // Flag to track if any deletion operation was performed

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
    adminprocessKpiupdate,
    adminprocessKpidelete,
    employeeCollection_post,
    employeeCollection_get,
    employeeCollection_put
};
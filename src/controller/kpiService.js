const databaseMetricsmodel = require("../databaseModels/metrics")
const databaseprocessKpimodel = require("../databaseModels/processKpi")
const databaseemployeeCoolection = require("../databaseModels/employeeKpi")
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

/////metrics

 // Admin
    // Metrics
//get api
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
    //post api in admin metrics
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
    
    //updateapi employee screen

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

    
    //delete api

    const adminprocessKpidelete = async (req, res) => {
        var dataInfo = []
        try {
            const { role } = req.params.role;
           // console.log(req.params.role,"102");
            const queryRole = await databaseprocessKpimodel.findOne({role:req.params.role});
            dataInfo = queryRole
            
            let deletionPerformed = false; 
   // console.log(dataInfo,"106");
            dataInfo.processKpi.forEach((element, index) => {
                console.log(element,index)
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
    //console.log(queryRole,"141");
            if (deletionPerformed) {

                const filter = {'role':req.params.role };
            const update = {$set: {processKpi:queryRole.processKpi  }};
            const result = await databaseprocessKpimodel.updateMany(filter,update)
          //  console.log(result,"252",res);




                //await databaseprocessKpimodel.updateOne(req.params.role, queryRole);
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












// ProcessKPI Collections-

//get api 
const adminprocessKpiget = async (req, res) => {
    try {
        // Extract the role from the request parameters
        const role = req.params.role;

        // Define the query object based on whether a role is provided
        const query = role ? { role } : {};
       // console.log(query,'175')

        // Fetch KPI documents from the database based on the query
        const kpiData = await databaseprocessKpimodel.find(query);
     //console.log(kpiData,'178');
        if (!kpiData) {
            return res.status(404).json({ status: 404, success: false, error: "No processKpi data found" });
        }

        return res.status(200).json({ status: 200, success: true, response: kpiData });
    } catch (error) {
        console.error("Error fetching data:", error);
        return res.status(500).json({ status: 500, success: false, error: "An error occurred while fetching data." });
    }
}

//post api
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
//patch api

const processKpiUpdateByIdForAdmin = async (req, res) => {
    const { id } = req.params;
    let errorResResult ='';
    try{
        let modelData = await databaseprocessKpimodel.find({_id:id});
        console.log(req.body,"241",modelData,"PARAMS",req.params);
        if(modelData !== undefined || modelData.length !== 0 && modelData[0].role === 'employee'){
            
            modelData[0].processKpi.forEach((element, index) => {
                if (req.params.categoryName && req.params.subCategoryName === undefined && req.params.metric === undefined) {
                    if (element.categoryName === req.params.categoryName) {
                      //element.categoryName = req.body.categoryName
                      element.subCategory.push(req.body)
                    }
                }
                if (req.params.categoryName && req.params.subCategoryName && req.params.metric === undefined) {
                    element.subCategory.forEach((subEle, subIndex) => {
                        if (element.categoryName === req.params.categoryName) {
                            if (subEle.subCategoryName === req.params.subCategoryName) {
                                //subEle.subCategoryName = req.body.subCategoryName
                                if(req.params.metric === undefined){
                                    subEle.queries.forEach((mEle, mIndex) => {
                                        console.log(mEle,"246");
                                        if(mEle.metric !== req.body.metric){
                                            subEle.queries.push(req.body)
                                            console.log(JSON.stringify(modelData),"253", errorResResult);
                                        }else{
                                            errorResResult = req.body.metric+' is already exist.'
                                            console.log("Error In 250");
                                        }
                                    })
                                }
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
                                            mEle.metric = req.body.metric === undefined? mEle.metric: req.body.metric
                                            mEle.quantityTarget = req.body.quantityTarget === undefined? mEle.quantityTarget:req.body.quantityTarget
                                    }
                                })
                            }
                        }
                    })
                }
            });
            console.log(JSON.stringify(modelData),"253", errorResResult);
            const filter = {'_id':new ObjectId(id) };
            const update = {$set: {processKpi:modelData[0].processKpi  }};
           const result = await databaseprocessKpimodel.updateMany(filter,update)
            console.log(result.modifiedCount,"252");
            if(result.modifiedCount !== 0){
                return res.status(200).json({ status: 200, success: true, message: "KPI Is Updated Successfully" });
            }else{
                return res.json({ status: 200, success: true, message: errorResResult });
            } 
        }

    }catch (error) {
        console.error("Error updating KPI Data:", error);
        return res.status(500).json({ status: 500, success: false, error: error });
    }
    
};

// Add New SubCategory or Metrics in Existing
const processKpiAddNewInExistingByIdForAdmin = async (req, res) => {
    const { id } = req.params;
    try{
        let modelData = await databaseprocessKpimodel.find({_id:id});
        if(modelData !== undefined || modelData.length !== 0 && modelData[0].role === 'employee'){
            modelData[0].processKpi.forEach((element, index) => {
                if (req.params.categoryName && req.params.subCategoryName === undefined) {
                    if (element.categoryName === req.params.categoryName) {
                      element.subCategory.push(req.body)
                    }
                }
                if (req.params.categoryName && req.params.subCategoryName) {
                    element.subCategory.forEach((subEle, subIndex) => {
                        if (element.categoryName === req.params.categoryName) {
                            if (subEle.subCategoryName === req.params.subCategoryName) {
                                subEle.queries.push(req.body)
                            }
                        }
                    })
                }
                
            });
            //console.log(JSON.stringify(modelData),"253");
            const filter = {'_id':new ObjectId(id) };
            const update = {$set: {processKpi:modelData[0].processKpi  }};
            const result = await databaseprocessKpimodel.updateMany(filter,update)
            if(result.modifiedCount !== 0){
                return res.status(200).json({ status: 200, success: true, message: "New KPI Type is added Successfully" });
            } else{
                return res.status({
                    success: false, message: "Error in Payload"
                })
            }   
        }

    }catch (error) {
        console.error("Error updating KPI Data:", error);
        return res.status(500).json({ status: 500, success: false, error: error });
    }
    
};

//put api

const adminProcessKpiUpdateById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id,'sssssssssssss');
        let updatedEmployeeKpi = await databaseprocessKpimodel.find({_id:id});
        
        if(req.body){
            req.body.processKpi.forEach((element)=>{
               // console.log(element,"Req Body");
               // console.log(updatedEmployeeKpi,"DB Res");

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







// Employee Collection controller service file

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
    employeeCollection_put,
    processKpiUpdateByIdForAdmin,
    adminprocessKpidelete,
    employeeCollection_post,
    employeeCollection_get,
    employeeCollection_put,
    adminProcessKpiUpdateById,
    processKpiAddNewInExistingByIdForAdmin
};
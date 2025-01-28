using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using backend.Models;
using System.Reflection.PortableExecutable;
using System.Linq;
using backend.Services;
using System.Security.Claims;
using System.Net.WebSockets;
using Microsoft.AspNetCore.Authentication;
using System.Configuration;
using System.Xml.Linq;
using Microsoft.AspNetCore.Identity;

namespace backend.Controllers
{
    [ApiController]
    [Route("api")]
    public class WorkOrderController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IJwtService _jwtService;
        private readonly Dictionary<string, List<string>> DepartmentSubDepartmentMap;
        private Dictionary<string, List<string>> ProcessingSequence = NextLocation.ProcessingSequence;


        public WorkOrderController(IConfiguration configuration,JwtService jwtService)
        {
            _configuration = configuration;
            _jwtService = jwtService;
            DepartmentSubDepartmentMap = DefineDepartment.DepartmentSubDepartmentMap;
            ProcessingSequence = NextLocation.ProcessingSequence;
        }

        private MySqlConnection GetConnection() => new MySqlConnection(_configuration.GetConnectionString("DefaultConnection"));

 

        // ENTRY WO ENDPOINT
        [EnableCors("AllowAll")]
        [HttpPost("entry-WO")]
        public IActionResult SubmitWorkOrder([FromBody] EntryWorkOrderData entryworkOrder)
        {
            try
            {
                using (var connection = GetConnection())
                {
                    connection.Open();

                    var checkQuery = @"
                    SELECT COUNT(*) FROM test_batch_data WHERE wo_number = @WONumber
                    UNION ALL
                    SELECT COUNT(*) FROM production_data WHERE wo_number = @WONumber
                    UNION ALL
                    SELECT COUNT(*) FROM warehouse_data WHERE wo_number = @WONumber";

                    // Check if the WO Number is already exist
                    using (var checkCmd = new MySqlCommand(checkQuery, connection))
                    {
                        checkCmd.Parameters.AddWithValue("@WONumber", entryworkOrder.WONumber);
                        using (var reader = checkCmd.ExecuteReader())
                        {
                            int totalCount = 0;
                            while (reader.Read())
                            {
                                totalCount += reader.GetInt32(0);
                            }

                            if (totalCount > 0)
                            {
                                return BadRequest("Work order already exists");
                            }
                        }
                    }

                    // Query to store the inpuuted value to db
                    //Get the claims
                    try
                    {
                        // Obtain the JWT token from the Authorization header
                        var authHeader = HttpContext.Request.Headers["Authorization"].FirstOrDefault();

                        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                        {
                            return Unauthorized("Authorization header is missing or invalid.");
                        }

                        var token = authHeader.Substring("Bearer ".Length);

                        try
                        {
                              // Injected in real scenarios
                            
                            var claims = _jwtService.ExtractClaims(token);  // Get all claims

                            // Find the claim with the "username" key
                            var rawUsername = claims.FirstOrDefault(c => c.Type == "username").Value;
                            var username = rawUsername.Replace("username:", ""); // This will give "adminwarehouse"
                            

                            if (rawUsername == null)
                            {
                                return BadRequest("Username claim not found.");
                            }
                            var insertQuery = "INSERT INTO test_batch_data (product_type, wo_number, batch_number, item_code, processing_department, sub_department, step_1,step_1_sender) VALUES (@ProductType, @WONumber, @BatchNumber, @ItemCode, @ProcessingDepartment, @SubDepartment, NOW(), @step_1_sender);"+
                                              "INSERT INTO audit_trail (user,action,timestamp,request_data) VALUES (@username, @action,NOW(),'Work Order')";
                                      
                            using (var cmd = new MySqlCommand(insertQuery, connection))
                            {
                                cmd.Parameters.AddWithValue("@username", username);
                                cmd.Parameters.AddWithValue("@step_1_sender", username);
                                cmd.Parameters.AddWithValue("@ProductType", entryworkOrder.ProductType);
                                cmd.Parameters.AddWithValue("@WONumber", entryworkOrder.WONumber);
                                cmd.Parameters.AddWithValue("@BatchNumber", entryworkOrder.BatchNumber);
                                cmd.Parameters.AddWithValue("@ItemCode", entryworkOrder.ItemCode);
                                cmd.Parameters.AddWithValue("@ProcessingDepartment", "ppic");
                                cmd.Parameters.AddWithValue("@SubDepartment", "ppic");
                                cmd.Parameters.AddWithValue("@action", $"Entry WO : {entryworkOrder.WONumber}");

                                int rowsAffected = cmd.ExecuteNonQuery();
                                if (rowsAffected > 0)
                                {
                                    return Ok("Work order submitted successfully");
                                }
                                else
                                {
                                    return BadRequest("Failed to submit work order");
                                }
                            }

                            return Ok(rawUsername);  // Return the username
                        }
                        catch (Exception ex)
                        {
                            return StatusCode(500, $"An error occurred: {ex.Message}");
                        }
                        
                    }
                    catch(Exception ex) { 
                        return BadRequest(ex.Message);
                    }
                   
                    
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while processing the request: {ex.Message}");
            }
        }



        // DASHBOARD ENDPOINT (VIEW ENTRY WO)
        [EnableCors("AllowAll")]
        [HttpGet("dashboard")]
        public IActionResult GetWorkOrders()
        {
            try
            {
                using (var connection = GetConnection())
                {
                    connection.Open();

                    var query = @"
                    SELECT *, 'test_batch_data' AS table_origin FROM test_batch_data
                    UNION ALL
                    SELECT *, 'warehouse_data' AS table_origin FROM warehouse_data
                    UNION ALL
                    SELECT *, 'production_data' AS table_origin FROM production_data";

                    using (var cmd = new MySqlCommand(query, connection))
                    {
                        using (var reader = cmd.ExecuteReader())
                        {
                            var ppicWorkOrders = new List<WorkOrderData>();
                            var warehouseWorkOrders = new List<WorkOrderData>();
                            var produksiWorkOrders = new List<WorkOrderData>();

                            while (reader.Read())
                            {
                                var workOrder = new WorkOrderData
                                {
                                    UniqueNumber = reader.GetInt32("unique_number"),
                                    ProductType = reader.GetString("product_type"),
                                    WONumber = reader.GetInt32("wo_number"),
                                    BatchNumber = reader.GetString("batch_number"),
                                    ItemCode = reader.GetString("item_code"),
                                    ProcessingDepartment = reader.GetString("processing_department"),
                                    SubDepartment = reader.GetString("sub_department"),
                                    Step1 = !reader.IsDBNull(reader.GetOrdinal("step_1")) ? reader.GetDateTime("step_1") : (DateTime?)null,
                                    step_1_sender = !reader.IsDBNull(reader.GetOrdinal("step_1_sender")) ? reader.GetString("step_1_sender") : null,
                                    Step2 = !reader.IsDBNull(reader.GetOrdinal("step_2")) ? reader.GetDateTime("step_2") : (DateTime?)null,
                                    step_2_sender = !reader.IsDBNull(reader.GetOrdinal("step_2_sender")) ? reader.GetString("step_2_sender") : null,
                                    Step3 = !reader.IsDBNull(reader.GetOrdinal("step_3")) ? reader.GetDateTime("step_3") : (DateTime?)null,
                                    step_3_sender = !reader.IsDBNull(reader.GetOrdinal("step_3_sender")) ? reader.GetString("step_3_sender") : null,
                                    Step4 = !reader.IsDBNull(reader.GetOrdinal("step_4")) ? reader.GetDateTime("step_4") : (DateTime?)null,
                                    step_4_sender = !reader.IsDBNull(reader.GetOrdinal("step_4_sender")) ? reader.GetString("step_4_sender") : null,
                                    Step5 = !reader.IsDBNull(reader.GetOrdinal("step_5")) ? reader.GetDateTime("step_5") : (DateTime?)null,
                                    step_5_sender = !reader.IsDBNull(reader.GetOrdinal("step_5_sender")) ? reader.GetString("step_5_sender") : null,
                                    Step6 = !reader.IsDBNull(reader.GetOrdinal("step_6")) ? reader.GetDateTime("step_6") : (DateTime?)null,
                                    step_6_sender = !reader.IsDBNull(reader.GetOrdinal("step_6_sender")) ? reader.GetString("step_6_sender") : null,
                                    CompletionTime = !reader.IsDBNull(reader.GetOrdinal("completion_time")) ? reader.GetDateTime("completion_time") : (DateTime?)null

                                };

                                // Classifying the WO by its processing department
                                switch (workOrder.ProcessingDepartment)
                                {
                                    case "ppic":
                                        ppicWorkOrders.Add(workOrder);
                                        break;
                                    case "warehouse":
                                        warehouseWorkOrders.Add(workOrder);
                                        break;
                                    case "produksi":
                                        produksiWorkOrders.Add(workOrder);
                                        break;
                                }
                            }

                            // Assigning <WorkOrderData> dictionary to departmentWorkOrders
                            var departmentWorkOrders = new Dictionary<string, List<WorkOrderData>>
                            {
                                { "ppic", ppicWorkOrders },
                                { "warehouse", warehouseWorkOrders },
                                { "produksi", produksiWorkOrders }
                            };

                            return Ok(departmentWorkOrders);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while fetching work orders: {ex.Message}");
            }
        }

        
        // HELPER CODE TO MIGRATE DATA
       private void MigrateWorkOrder(int uniqueNumber, string productType, string processingDepartment)
        {
            try
            {
                using (var connection = GetConnection())
                {
                    connection.Open();
                    string query = "";

                    // Determine the query based on the processing department
                    if (processingDepartment == "produksi")
                    {
                        query = "INSERT INTO production_data SELECT * FROM test_batch_data WHERE unique_number = @UniqueNumber AND product_type = @ProductType; " +
                                "INSERT INTO production_data SELECT * FROM warehouse_data WHERE unique_number = @UniqueNumber AND product_type = @ProductType; " +
                                "DELETE FROM test_batch_data WHERE unique_number = @UniqueNumber AND product_type = @ProductType; " +
                                "DELETE FROM warehouse_data WHERE unique_number = @UniqueNumber AND product_type = @ProductType;";
                    }
                    else if (processingDepartment == "warehouse")
                    {
                        query = "INSERT INTO warehouse_data SELECT * FROM test_batch_data WHERE unique_number = @UniqueNumber AND product_type = @ProductType; " +
                                "INSERT INTO warehouse_data SELECT * FROM production_data WHERE unique_number = @UniqueNumber AND product_type = @ProductType; " +
                                "DELETE FROM test_batch_data WHERE unique_number = @UniqueNumber AND product_type = @ProductType; " +
                                "DELETE FROM production_data WHERE unique_number = @UniqueNumber AND product_type = @ProductType;";
                    }

                    if (!string.IsNullOrEmpty(query))
                    {
                        using (var cmd = new MySqlCommand(query, connection))
                        {
                            cmd.Parameters.AddWithValue("@UniqueNumber", uniqueNumber);
                            cmd.Parameters.AddWithValue("@ProductType", productType);
                            cmd.ExecuteNonQuery();
                        }
                    }
                    else
                    {
                        Console.WriteLine("No query found for the processing department: " + processingDepartment);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred while migrating work order: {ex.Message}");
            }
        }

        // HELPER CODE TO MIGRATE COMPLETED DATA
        private void MigrateCompletedWorkOrder(int uniqueNumber, string productType, string username)
        {
            
            try
            {
                using (var connection = GetConnection())
                {
                    connection.Open();
                    string query = "INSERT INTO completed_batch_data (unique_number,product_type,wo_number,batch_number,item_code,processing_department,sub_department,line_selection,step_1,step_1_sender,step_2,step_2_sender,step_3,step_3_sender,step_4,step_4_sender,step_5,step_5_sender,step_6,step_6_sender,completion_time) SELECT unique_number,product_type,wo_number,batch_number,item_code,processing_department,sub_department,line_selection,step_1,step_1_sender,step_2,step_2_sender,step_3,step_3_sender,step_4,step_4_sender,step_5,step_5_sender,step_6,step_6_sender,completion_time FROM production_data WHERE unique_number = @UniqueNumber AND product_type = @ProductType; " +
                                   "UPDATE completed_batch_data SET completion_time = NOW() WHERE unique_number = @UniqueNumber AND product_type = @ProductType; " +
                                   "DELETE FROM production_data WHERE unique_number = @UniqueNumber AND product_type = @ProductType;";

                    using (var cmd = new MySqlCommand(query, connection))
                    {
                        cmd.Parameters.AddWithValue("@UniqueNumber", uniqueNumber);
                        cmd.Parameters.AddWithValue("@ProductType", productType);
                        cmd.ExecuteNonQuery();
                    }
                }
                Console.WriteLine($"Migrating completed work order - UniqueNumber: {uniqueNumber}, ProductType: {productType}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred while migrating completed work order: {ex.Message}");
            }
        }

        // HELPER CODE TO UPDATE THE LINE SELECTION IN DB
        private string UpdateLineSelection(int uniqueNumber, string productType, string lineSelection, string nextSubDepartment)
        {
            try
            {
                using (var connection = GetConnection())
                {
                    connection.Open();
                    bool lineOccupied = CheckLineOccupancy(lineSelection);
                    if (lineOccupied)
                    {
                        return "Failed to update line selection: Work already in progress in the selected line.";
                    }

                    var updateLineQuery = "UPDATE production_data SET line_selection = @LineSelection WHERE unique_number = @UniqueNumber AND product_type = @ProductType";
                    using (var cmd = new MySqlCommand(updateLineQuery, connection))
                    {
                        cmd.Parameters.AddWithValue("@UniqueNumber", uniqueNumber);
                        cmd.Parameters.AddWithValue("@LineSelection", lineSelection);
                        cmd.Parameters.AddWithValue("@ProductType", productType);
                        cmd.ExecuteNonQuery();
                    }

                    if (nextSubDepartment == "discharging" || nextSubDepartment == "filling")
                    {
                        var updateSubDepartQuery = "UPDATE production_data SET sub_department = @SubDepartment WHERE unique_number = @UniqueNumber AND product_type = @ProductType";
                        using (var cmd = new MySqlCommand(updateSubDepartQuery, connection))
                        {
                            cmd.Parameters.AddWithValue("@UniqueNumber", uniqueNumber);
                            cmd.Parameters.AddWithValue("@ProductType", productType);
                            cmd.Parameters.AddWithValue("@SubDepartment", nextSubDepartment);
                            cmd.ExecuteNonQuery();
                        }
                    }

                    return "Line selection updated successfully";
                }
            }
            catch (Exception ex)
            {
                return $"An error occurred while updating line selection: {ex.Message}";
            }
        }

        // HELPER CODE TO CHECK LINE OCCUPANCY
        private bool CheckLineOccupancy(string lineSelection)
        {
            try
            {
                using (var connection = GetConnection())
                {
                    connection.Open();
                    var query = "SELECT COUNT(*) FROM production_data WHERE line_selection = @LineSelection";
                    using (var cmd = new MySqlCommand(query, connection))
                    {
                        cmd.Parameters.AddWithValue("@LineSelection", lineSelection);
                        int count = Convert.ToInt32(cmd.ExecuteScalar());
                        return count > 0;
                    }
                }
            }
            catch (Exception ex)
            {
                return true;
            }
        }



        // HELPER CODE TO DEFINE PROCESSING DEPARTMENT
        private string? DefineProcessingDepartment(string subDepartment)
        {
            // Access the department-subdepartment mapping
            var departmentSubDepartmentMap = DefineDepartment.DepartmentSubDepartmentMap;

            // Find the department containing the sub-department
            var departmentContainingSubDepartment = departmentSubDepartmentMap.FirstOrDefault(x => x.Value.Contains(subDepartment)).Key;

            return departmentContainingSubDepartment;
        }


        // HELPER CODE TO GET THE NEXT PROCESSING STEP
        private string? GetNextProcessingStep(string currentSubDepartment, string productType)
        {
            // Access the processing sequence based on the product type
            var processingSequence = NextLocation.ProcessingSequence;

            // Find the index of the current location (sub-department) in the processing sequence
            var currentSequence = processingSequence.FirstOrDefault(x => x.Key == productType).Value;
            if (currentSequence != null)
            {
                int currentIndex = currentSequence.IndexOf(currentSubDepartment);
                if (currentIndex != -1 && currentIndex < currentSequence.Count - 1)
                {
                    // Determine the next sub-department
                    return currentSequence[currentIndex + 1];
                }
            }
            return null;
        }

        // HELPER CODE TO UPDATE SUB DEPARTMENT IN DB
        private void UpdateSubDepartment(MySqlConnection connection, int uniqueNumber, string nextSubDepartment, string productType, string username)
        {
            var updateSubDepartmentQuery = "UPDATE test_batch_data SET sub_department = @NextSubDepartment WHERE unique_number = @UniqueNumber AND product_type = @ProductType;" +
                                            "UPDATE warehouse_data SET sub_department = @NextSubDepartment WHERE unique_number = @UniqueNumber AND product_type = @ProductType;" +
                                            "UPDATE production_data SET sub_department = @NextSubDepartment WHERE unique_number = @UniqueNumber AND product_type = @ProductType;";


            using (var cmd = new MySqlCommand(updateSubDepartmentQuery, connection))
            {
                
                cmd.Parameters.AddWithValue("@UniqueNumber", uniqueNumber);
                cmd.Parameters.AddWithValue("@NextSubDepartment", nextSubDepartment);
                cmd.Parameters.AddWithValue("@ProductType", productType);
                cmd.ExecuteNonQuery();
            }
        }

        // HELPER CODE TO UPDATE PROCESSING DEPARTMENT IN DB
        private void UpdateProcessingDepartment(MySqlConnection connection, int uniqueNumber, string productType, string nextSubDepartment)
        {
            var nextProcessingDepartment = DefineProcessingDepartment(nextSubDepartment);
            var updateProcessingDepartmentQuery = "UPDATE test_batch_data SET processing_department = @NextProcessingDepartment WHERE unique_number = @UniqueNumber AND product_type = @ProductType;" +
                                                "UPDATE warehouse_data SET processing_department = @NextProcessingDepartment WHERE unique_number = @UniqueNumber AND product_type = @ProductType;" +
                                                "UPDATE production_data SET processing_department = @NextProcessingDepartment WHERE unique_number = @UniqueNumber AND product_type = @ProductType;";

            using (var processingCmd = new MySqlCommand(updateProcessingDepartmentQuery, connection))
            {
            
                processingCmd.Parameters.AddWithValue("@UniqueNumber", uniqueNumber);
                processingCmd.Parameters.AddWithValue("@NextProcessingDepartment", nextProcessingDepartment);
                processingCmd.Parameters.AddWithValue("@ProductType", productType);
                processingCmd.ExecuteNonQuery();
            }
        }


        private void UpdateStepTimestamp(MySqlConnection connection, int uniqueNumber, string productType, string nextSubDepartment)
        {
            string stepColumn = GetStepColumn(productType, nextSubDepartment);
            if (stepColumn != null)
            {
                var updateStepQuery = $"UPDATE production_data SET {stepColumn} = NOW() WHERE unique_number = @UniqueNumber;" +
                                      $"UPDATE warehouse_data SET {stepColumn} = NOW() WHERE unique_number = @UniqueNumber";

                using (var cmd = new MySqlCommand(updateStepQuery, connection))
                {
                    cmd.Parameters.AddWithValue("@UniqueNumber", uniqueNumber);
                    cmd.ExecuteNonQuery();
                }
            }
        }

        private void UpdateStepSender(MySqlConnection connection, int uniqueNumber, string productType, string nextSubDepartment,string username)
        {
            string stepColumn = GetStepSenderColumn(productType, nextSubDepartment);
            if (stepColumn != null)
            {
                var updateStepQuery = $"UPDATE production_data SET {stepColumn} = @step_sender WHERE unique_number = @UniqueNumber;" +
                                      $"UPDATE warehouse_data SET {stepColumn} = @step_sender WHERE unique_number = @UniqueNumber";

                using (var cmd = new MySqlCommand(updateStepQuery, connection))
                {
                    cmd.Parameters.AddWithValue("@step_sender", username);
                    cmd.Parameters.AddWithValue("@UniqueNumber", uniqueNumber);
                    cmd.ExecuteNonQuery();
                }
            }
        }



        private string GetStepColumn(string productType, string nextSubDepartment)
        {
            List<string> productSteps;
            if (NextLocation.ProcessingSequence.TryGetValue(productType, out productSteps))
            {
                int stepIndex = productSteps.IndexOf(nextSubDepartment);
                if (stepIndex != -1)
                {
                    return $"step_{Math.Min(stepIndex + 1, productSteps.Count)}";
                }
            }
            return null;
        }

        private string GetStepSenderColumn(string productType, string nextSubDepartment)
        {
            List<string> productSteps;
            if (NextLocation.ProcessingSequence.TryGetValue(productType, out productSteps))
            {
                int stepIndex = productSteps.IndexOf(nextSubDepartment);
                if (stepIndex != -1)
                {
                    return $"step_{Math.Min(stepIndex + 1, productSteps.Count)}_sender";
                }
            }
            return null;
        }



    [EnableCors("AllowAll")]
[HttpPut("send")]
public IActionResult SendButtonClicked([FromBody] UpdateLocationRequest request)
{
    try
    {
        var authHeader = HttpContext.Request.Headers["Authorization"].FirstOrDefault();
        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
        {
            authHeader = "None";
        }
        var token = authHeader.Substring("Bearer ".Length);

        try
        {
            var claims = _jwtService.ExtractClaims(token);  // Get all claims

            // Find the claim with the "username" key
            var rawUsername = claims.FirstOrDefault(c => c.Type == "username").Value;
            string username = rawUsername.Replace("username:", ""); // This will give "adminwarehouse"
            int uniqueNumber = request.UniqueNumber;
            string productType = request.ProductType;
            string currentSubDepartment = request.SubDepartment;

            using (var connection = GetConnection())
            {
                connection.Open();

                string nextSubDepartment = GetNextProcessingStep(currentSubDepartment, productType);
                string nextProcessingDepartment = DefineProcessingDepartment(nextSubDepartment);

                if (nextSubDepartment == null)
                {
                    MigrateCompletedWorkOrder(uniqueNumber, productType, username);

                    // Audit Trail
                    LogAuditTrail(connection, username, "Send Button Clicked", "Work order processing completed");

                    return Ok("Work order processing completed.");
                }

                if (nextSubDepartment == "discharging" || nextSubDepartment == "filling")
                {
                    if (string.IsNullOrEmpty(request.LineSelection))
                    {
                        return BadRequest("Line selection is required for discharging or filling.");
                    }

                    string lineSelection = request.LineSelection;
                    string lineSelectionResponse = UpdateLineSelection(uniqueNumber, productType, lineSelection, nextSubDepartment);

                    if (lineSelectionResponse != "Line selection updated successfully")
                    {
                        Console.WriteLine("Gagal, WLEEEEE!");
                    }
                }

                // Update sub-department
                UpdateSubDepartment(connection, uniqueNumber, nextSubDepartment, productType, username);

                // Update processing department
                UpdateProcessingDepartment(connection, uniqueNumber, productType, nextSubDepartment);

                MigrateWorkOrder(uniqueNumber, productType, nextProcessingDepartment);

                // Update step timestamp
                UpdateStepTimestamp(connection, uniqueNumber, productType, nextSubDepartment);

                UpdateStepSender(connection, uniqueNumber, productType, nextSubDepartment, username);

  // Construct the message indicating the transition between departments
                             string successMessage = $"Location updated from {currentSubDepartment} department to {nextSubDepartment} department";

                // Audit Trail
                LogAuditTrail(connection, username, "Send", successMessage);

                return Ok("Location updated successfully");
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred while updating location: {ex.Message}");
        }

    }
    catch (Exception e)
    {
        return StatusCode(500, e.Message);
    }

}

private void LogAuditTrail(MySqlConnection connection, string username, string action, string requestData)
{
    string insertQuery = "INSERT INTO audit_trail (user, action, timestamp, request_data) VALUES (@username, @action, NOW(), @requestData)";
    using (var cmd = new MySqlCommand(insertQuery, connection))
    {
        cmd.Parameters.AddWithValue("@username", username);
        cmd.Parameters.AddWithValue("@action", action);
        cmd.Parameters.AddWithValue("@requestData", requestData);
        cmd.ExecuteNonQuery();
    }
}


        // RUAH LIVE TRACK ENDPOINT
        [EnableCors("AllowAll")]
        [HttpGet("ruah")]
        public IActionResult GetRuahData()
        {
            try
            {
                using (var connection = GetConnection())
                {
                    connection.Open();

                    var query = @"
                    
                    SELECT *
                    FROM (
                      SELECT *, 'warehouse_data' AS table_origin FROM warehouse_data
                      WHERE product_type = 'ruah'
                    ) AS warehouse_data_filtered

                    UNION


                    SELECT *, 'production_data' AS table_origin FROM production_data
                    WHERE product_type = 'ruah'

                    UNION

                    SELECT *, 'test_batch_data' AS table_origin FROM test_batch_data
                    WHERE product_type = 'ruah';";


                    using (var cmd = new MySqlCommand(query, connection))
                    {
                        using (var reader = cmd.ExecuteReader())
                        {
                            var ruahData = new Dictionary<string, Dictionary<string, List<RuahData>>>();

                            while (reader.Read())
                            {
                                var workOrder = new RuahData
                                {
                                    UniqueNumber = reader.GetInt32("unique_number"),
                                    ProductType = reader.GetString("product_type"),
                                    WONumber = reader.GetInt32("wo_number"),
                                    BatchNumber = reader.GetString("batch_number"),
                                    ItemCode = reader.GetString("item_code"),
                                    ProcessingDepartment = reader.GetString("processing_department"),
                                    SubDepartment = reader.GetString("sub_department"),
                                    LineSelection = null,
                                    Step1 = !reader.IsDBNull(reader.GetOrdinal("step_1")) ? reader.GetDateTime("step_1") : (DateTime?)null,
                                    step_1_sender = !reader.IsDBNull(reader.GetOrdinal("step_1_sender")) ? reader.GetString("step_1_sender") : null,
                                    Step2 = !reader.IsDBNull(reader.GetOrdinal("step_2")) ? reader.GetDateTime("step_2") : (DateTime?)null,
                                    step_2_sender = !reader.IsDBNull(reader.GetOrdinal("step_2_sender")) ? reader.GetString("step_2_sender") : null,
                                    Step3 = !reader.IsDBNull(reader.GetOrdinal("step_3")) ? reader.GetDateTime("step_3") : (DateTime?)null,
                                    step_3_sender = !reader.IsDBNull(reader.GetOrdinal("step_3_sender")) ? reader.GetString("step_3_sender") : null,
                                    Step4 = !reader.IsDBNull(reader.GetOrdinal("step_4")) ? reader.GetDateTime("step_4") : (DateTime?)null,
                                    step_4_sender = !reader.IsDBNull(reader.GetOrdinal("step_4_sender")) ? reader.GetString("step_4_sender") : null,
                                    Step5 = !reader.IsDBNull(reader.GetOrdinal("step_5")) ? reader.GetDateTime("step_5") : (DateTime?)null,
                                    step_5_sender = !reader.IsDBNull(reader.GetOrdinal("step_5_sender")) ? reader.GetString("step_5_sender") : null,
                                    Step6 = !reader.IsDBNull(reader.GetOrdinal("step_6")) ? reader.GetDateTime("step_6") : (DateTime?)null,
                                    step_6_sender = !reader.IsDBNull(reader.GetOrdinal("step_6_sender")) ? reader.GetString("step_6_sender") : null,
                                    CompletionTime = !reader.IsDBNull(reader.GetOrdinal("completion_time")) ? reader.GetDateTime("completion_time") : (DateTime?)null
                                };
                                

                                if (workOrder.SubDepartment == "discharging")
                                {

                                    workOrder.LineSelection = !reader.IsDBNull(reader.GetOrdinal("line_selection")) ? reader.GetString("line_selection") : null;
                                }

                                string key;
                                if (workOrder.LineSelection != null)
                                {
                                    key = $"{workOrder.SubDepartment}{workOrder.LineSelection}";
                                }
                                else
                                {
                                    key = $"{workOrder.SubDepartment}";
                                }


                                if (!ruahData.ContainsKey(key))
                                {
                                    ruahData[key] = new Dictionary<string, List<RuahData>>();
                                }

                                if (!ruahData[key].ContainsKey(workOrder.SubDepartment))
                                {
                                    ruahData[key][workOrder.SubDepartment] = new List<RuahData>();
                                }

                                ruahData[key][workOrder.SubDepartment].Add(workOrder);
                                
                            }

                            return Ok(ruahData);
                        }

                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while fetching Ruah data: {ex.Message}");
            }
        }


        // KEMAS LIVE TRACK ENDPOINT
        [EnableCors("AllowAll")]
        [HttpGet("kemas")]
        public IActionResult GetKemasData()
        {
            try
            {
                using (var connection = GetConnection())
                {
                    connection.Open();

                    var query = @"
                    
                    SELECT *
                    FROM (
                      SELECT *, 'warehouse_data' AS table_origin FROM warehouse_data
                      WHERE product_type = 'kemas'
                    ) AS warehouse_data_filtered

                    UNION

                    SELECT *, 'production_data' AS table_origin FROM production_data
                    WHERE product_type = 'kemas'

                    UNION

                    SELECT *, 'test_batch_data' AS table_origin FROM test_batch_data
                    WHERE product_type = 'kemas';";

                    using (var cmd = new MySqlCommand(query, connection))
                    {
                        using (var reader = cmd.ExecuteReader())
                        {
                            var kemasData = new Dictionary<string, Dictionary<string, List<KemasData>>>();

                            while (reader.Read())
                            {
                                var workOrder = new KemasData
                                {
                                    
                                    UniqueNumber = reader.GetInt32("unique_number"),
                                    ProductType = reader.GetString("product_type"),
                                    WONumber = reader.GetInt32("wo_number"),
                                    BatchNumber = reader.GetString("batch_number"),
                                    ItemCode = reader.GetString("item_code"),
                                    ProcessingDepartment = reader.GetString("processing_department"),
                                    SubDepartment = reader.GetString("sub_department"),
                                    LineSelection = null,
                                    Step1 = !reader.IsDBNull(reader.GetOrdinal("step_1")) ? reader.GetDateTime("step_1") : (DateTime?)null,
                                    step_1_sender = !reader.IsDBNull(reader.GetOrdinal("step_1_sender")) ? reader.GetString("step_1_sender") : null,
                                    Step2 = !reader.IsDBNull(reader.GetOrdinal("step_2")) ? reader.GetDateTime("step_2") : (DateTime?)null,
                                    step_2_sender = !reader.IsDBNull(reader.GetOrdinal("step_2_sender")) ? reader.GetString("step_2_sender") : null,
                                    Step3 = !reader.IsDBNull(reader.GetOrdinal("step_3")) ? reader.GetDateTime("step_3") : (DateTime?)null,
                                    step_3_sender = !reader.IsDBNull(reader.GetOrdinal("step_3_sender")) ? reader.GetString("step_3_sender") : null,
                                    Step4 = !reader.IsDBNull(reader.GetOrdinal("step_4")) ? reader.GetDateTime("step_4") : (DateTime?)null,
                                    step_4_sender = !reader.IsDBNull(reader.GetOrdinal("step_4_sender")) ? reader.GetString("step_4_sender") : null,
                                    Step5 = !reader.IsDBNull(reader.GetOrdinal("step_5")) ? reader.GetDateTime("step_5") : (DateTime?)null,
                                    step_5_sender = !reader.IsDBNull(reader.GetOrdinal("step_5_sender")) ? reader.GetString("step_5_sender") : null,
                                    CompletionTime = !reader.IsDBNull(reader.GetOrdinal("completion_time")) ? reader.GetDateTime("completion_time") : (DateTime?)null
                                };

                                if (workOrder.SubDepartment == "filling")
                                {

                                    workOrder.LineSelection = !reader.IsDBNull(reader.GetOrdinal("line_selection")) ? reader.GetString("line_selection") : null;
                                }

                                string key = $"{workOrder.SubDepartment}{workOrder.LineSelection}";

                                if (!kemasData.ContainsKey(key))
                                {
                                    kemasData[key] = new Dictionary<string, List<KemasData>>();
                                }

                                if (!kemasData[key].ContainsKey(workOrder.SubDepartment))
                                {
                                    kemasData[key][workOrder.SubDepartment] = new List<KemasData>();
                                }

                                kemasData[key][workOrder.SubDepartment].Add(workOrder);
                            }

                            return Ok(kemasData);
                        }

                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while fetching Ruah data: {ex.Message}");
            }
        }

        // MINOR LIVE TRACK ENDPOINT
        [EnableCors("AllowAll")]
        [HttpGet("minor")]
        public IActionResult GetMinorData()
        {
            try
            {
                using (var connection = GetConnection())
                {
                    connection.Open();

                    var query = @"
                    
                    SELECT *
                    FROM (
                      SELECT *, 'warehouse_data' AS table_origin FROM warehouse_data
                      WHERE product_type = 'minor'
                    ) AS warehouse_data_filtered

                    UNION

                    SELECT *, 'production_data' AS table_origin FROM production_data
                    WHERE product_type = 'minor'

                    UNION

                    SELECT *, 'test_batch_data' AS table_origin FROM test_batch_data
                    WHERE product_type = 'minor';";

                    // Execute the query and fetch the results
                    using (var cmd = new MySqlCommand(query, connection))
                    {
                        using (var reader = cmd.ExecuteReader())
                        {
                            var minorData = new Dictionary<string, List<MinorData>>();

                            while (reader.Read())
                            {
                                // Read the data from the reader and create WorkOrderData objects
                                var workOrder = new MinorData
                                {
                                    
                                    UniqueNumber = reader.GetInt32("unique_number"),
                                    ProductType = reader.GetString("product_type"),
                                    WONumber = reader.GetInt32("wo_number"),
                                    BatchNumber = reader.GetString("batch_number"),
                                    ItemCode = reader.GetString("item_code"),
                                    ProcessingDepartment = reader.GetString("processing_department"),
                                    SubDepartment = reader.GetString("sub_department"),
                                    Step1 = !reader.IsDBNull(reader.GetOrdinal("step_1")) ? reader.GetDateTime("step_1") : (DateTime?)null,
                                    step_1_sender = !reader.IsDBNull(reader.GetOrdinal("step_1_sender")) ? reader.GetString("step_1_sender") : null,
                                    Step2 = !reader.IsDBNull(reader.GetOrdinal("step_2")) ? reader.GetDateTime("step_2") : (DateTime?)null,
                                    step_2_sender = !reader.IsDBNull(reader.GetOrdinal("step_2_sender")) ? reader.GetString("step_2_sender") : null,
                                    Step3 = !reader.IsDBNull(reader.GetOrdinal("step_3")) ? reader.GetDateTime("step_3") : (DateTime?)null,
                                    step_3_sender = !reader.IsDBNull(reader.GetOrdinal("step_3_sender")) ? reader.GetString("step_3_sender") : null,
                                    Step4 = !reader.IsDBNull(reader.GetOrdinal("step_4")) ? reader.GetDateTime("step_4") : (DateTime?)null,
                                    step_4_sender = !reader.IsDBNull(reader.GetOrdinal("step_4_sender")) ? reader.GetString("step_4_sender") : null,
                                    Step5 = !reader.IsDBNull(reader.GetOrdinal("step_5")) ? reader.GetDateTime("step_5") : (DateTime?)null,
                                    step_5_sender = !reader.IsDBNull(reader.GetOrdinal("step_5_sender")) ? reader.GetString("step_5_sender") : null,
                                    Step6 = !reader.IsDBNull(reader.GetOrdinal("step_6")) ? reader.GetDateTime("step_6") : (DateTime?)null,
                                    step_6_sender = !reader.IsDBNull(reader.GetOrdinal("step_6_sender")) ? reader.GetString("step_6_sender") : null,
                                    CompletionTime = !reader.IsDBNull(reader.GetOrdinal("completion_time")) ? reader.GetDateTime("completion_time") : (DateTime?)null
                                };

                                // Determine the sub-department and add the work order data to the corresponding list
                                string subDepartment = reader.GetString("sub_department");
                                if (!minorData.ContainsKey(subDepartment))
                                {
                                    minorData[subDepartment] = new List<MinorData>();
                                }
                                minorData[subDepartment].Add(workOrder);
                            }

                            return Ok(minorData);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while fetching Ruah data: {ex.Message}");
            }
        }
    
        // ENDPOINT FOR DELETE BUTTON IN BATCH TRACKER
[EnableCors("AllowAll")]
[HttpDelete("delete-work-order")]
public IActionResult DeleteWorkOrder([FromBody] DeleteWorkOrderRequest request)
{
    int uniqueNumber = request.UniqueNumber;

    try
    {
        using (var connection = GetConnection())
        {
            connection.Open();

            string query = @"
            DELETE FROM test_batch_data WHERE unique_number = @UniqueNumber;
            DELETE FROM production_data WHERE unique_number = @UniqueNumber;
            DELETE FROM warehouse_data WHERE unique_number = @UniqueNumber;";

            // Retrieve username from JWT token
            var authHeader = HttpContext.Request.Headers["Authorization"].FirstOrDefault();
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            {
                return Unauthorized("Authorization header is missing or invalid.");
            }
            var token = authHeader.Substring("Bearer ".Length);

            var claims = _jwtService.ExtractClaims(token);  // Get all claims
            var rawUsername = claims.FirstOrDefault(c => c.Type == "username").Value;
            var username = rawUsername.Replace("username:", "");

            // Audit Trail
            string action = $"Delete Work Order";
            string requestData = $"Unique Number: {uniqueNumber}";

            LogAuditTrail(connection, username, action, requestData);

            using (var cmd = new MySqlCommand(query, connection))
            {
                cmd.Parameters.AddWithValue("@UniqueNumber", uniqueNumber);
                int rowsAffected = cmd.ExecuteNonQuery();
                if (rowsAffected > 0)
                {
                    return Ok(new { message = $"Work order with Unique Number {uniqueNumber} deleted successfully." });
                }
                else
                {
                    return NotFound(new { message = $"Work order with Unique Number {uniqueNumber} not found." });
                }
            }
        }
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { message = $"An error occurred while deleting the work order: {ex.Message}" });
    }
}


        // ENDPOINT FOR REPORT OVERALL
        [EnableCors("AllowAll")]
        [HttpGet("report-overall")]
        public IActionResult ReportOverall(DateTime startDate, DateTime endDate)
        {
            try
            {
                // Define the target timezone (UTC+7)
                TimeZoneInfo targetTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");

                // Convert the received dates to UTC+7 timezone
                startDate = TimeZoneInfo.ConvertTime(startDate, targetTimeZone);
                endDate = TimeZoneInfo.ConvertTime(endDate, targetTimeZone);

                using (var connection = GetConnection())
                {
                    connection.Open();

                    var query = @"
            SELECT *, 'warehouse_data' AS table_origin FROM warehouse_data 
            WHERE (DATE(completion_time) BETWEEN @StartDate AND @EndDate)
            OR (DATE(step_1) BETWEEN @StartDate AND @EndDate OR DATE(step_2) BETWEEN @StartDate AND @EndDate OR DATE(step_3) BETWEEN @StartDate AND @EndDate OR DATE(step_4) BETWEEN @StartDate AND @EndDate OR DATE(step_5) BETWEEN @StartDate AND @EndDate OR DATE(step_6) BETWEEN @StartDate AND @EndDate)
            UNION
            SELECT *, 'production_data' AS table_origin FROM production_data 
            WHERE (DATE(completion_time) BETWEEN @StartDate AND @EndDate)
            OR (DATE(step_1) BETWEEN @StartDate AND @EndDate OR DATE(step_2) BETWEEN @StartDate AND @EndDate OR DATE(step_3) BETWEEN @StartDate AND @EndDate OR DATE(step_4) BETWEEN @StartDate AND @EndDate OR DATE(step_5) BETWEEN @StartDate AND @EndDate OR DATE(step_6) BETWEEN @StartDate AND @EndDate)
            UNION
            SELECT *, 'test_batch_data' AS table_origin FROM test_batch_data 
            WHERE (DATE(completion_time) BETWEEN @StartDate AND @EndDate)
            OR (DATE(step_1) BETWEEN @StartDate AND @EndDate OR DATE(step_2) BETWEEN @StartDate AND @EndDate OR DATE(step_3) BETWEEN @StartDate AND @EndDate OR DATE(step_4) BETWEEN @StartDate AND @EndDate OR DATE(step_5) BETWEEN @StartDate AND @EndDate OR DATE(step_6) BETWEEN @StartDate AND @EndDate)
            UNION
            SELECT *, 'completed_batch_data' AS table_origin FROM completed_batch_data 
            WHERE (DATE(completion_time) BETWEEN @StartDate AND @EndDate);";

                    using (var cmd = new MySqlCommand(query, connection))
                    {
                        cmd.Parameters.AddWithValue("@StartDate", startDate.Date);
                        cmd.Parameters.AddWithValue("@EndDate", endDate.Date);

                        Console.WriteLine(startDate);
                        Console.WriteLine(endDate);

                        using (var reader = cmd.ExecuteReader())
                        {
                            if (!reader.HasRows)
                            {
                                return NotFound("No data available for the selected date range");
                            }

                            var data = new List<object>();
                            while (reader.Read())
                            {
                                var reportData = new Dictionary<string, object>();
                                for (int i = 0; i < reader.FieldCount; i++)
                                {
                                    reportData[reader.GetName(i)] = reader.GetValue(i);
                                }
                                data.Add(reportData);
                            }

                            return Ok(data);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while fetching data by date range: {ex.Message}");
            }
        }

        // ENDPOINT FOR REPORT MINOR
        [EnableCors("AllowAll")]
        [HttpGet("report-minor")]
        public IActionResult ReportMinor(DateTime startDate, DateTime endDate)
        {
            try
            {
                // Define the target timezone (UTC+7)
                TimeZoneInfo targetTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");

                // Convert the received dates to UTC+7 timezone
                startDate = TimeZoneInfo.ConvertTime(startDate, targetTimeZone);
                endDate = TimeZoneInfo.ConvertTime(endDate, targetTimeZone);
                using (var connection = GetConnection())
                {
                    connection.Open();

                    var query = @"
            SELECT *, 'warehouse_data' AS table_origin FROM warehouse_data 
            WHERE ((DATE(completion_time) BETWEEN @StartDate AND @EndDate)
            OR (DATE(step_1) BETWEEN @StartDate AND @EndDate OR DATE(step_2) BETWEEN @StartDate AND @EndDate OR DATE(step_3) BETWEEN @StartDate AND @EndDate OR DATE(step_4) BETWEEN @StartDate AND @EndDate OR DATE(step_5) BETWEEN @StartDate AND @EndDate OR DATE(step_6) BETWEEN @StartDate AND @EndDate))
            AND product_type = 'minor'
            UNION
            SELECT *, 'production_data' AS table_origin FROM production_data 
            WHERE ((DATE(completion_time) BETWEEN @StartDate AND @EndDate)
            OR (DATE(step_1) BETWEEN @StartDate AND @EndDate OR DATE(step_2) BETWEEN @StartDate AND @EndDate OR DATE(step_3) BETWEEN @StartDate AND @EndDate OR DATE(step_4) BETWEEN @StartDate AND @EndDate OR DATE(step_5) BETWEEN @StartDate AND @EndDate OR DATE(step_6) BETWEEN @StartDate AND @EndDate))
            AND product_type = 'minor'
            UNION
            SELECT *, 'test_batch_data' AS table_origin FROM test_batch_data 
            WHERE ((DATE(completion_time) BETWEEN @StartDate AND @EndDate)
            OR (DATE(step_1) BETWEEN @StartDate AND @EndDate OR DATE(step_2) BETWEEN @StartDate AND @EndDate OR DATE(step_3) BETWEEN @StartDate AND @EndDate OR DATE(step_4) BETWEEN @StartDate AND @EndDate OR DATE(step_5) BETWEEN @StartDate AND @EndDate OR DATE(step_6) BETWEEN @StartDate AND @EndDate))
            AND product_type = 'minor'
            UNION
            SELECT *, 'completed_batch_data' AS table_origin FROM completed_batch_data 
            WHERE ((DATE(completion_time) BETWEEN @StartDate AND @EndDate)
            OR (DATE(step_1) BETWEEN @StartDate AND @EndDate OR DATE(step_2) BETWEEN @StartDate AND @EndDate OR DATE(step_3) BETWEEN @StartDate AND @EndDate OR DATE(step_4) BETWEEN @StartDate AND @EndDate OR DATE(step_5) BETWEEN @StartDate AND @EndDate OR DATE(step_6) BETWEEN @StartDate AND @EndDate))
            AND product_type = 'minor';";

                    using (var cmd = new MySqlCommand(query, connection))
                    {
                        cmd.Parameters.AddWithValue("@StartDate", startDate.Date);
                        cmd.Parameters.AddWithValue("@EndDate", endDate.Date);

                        using (var reader = cmd.ExecuteReader())
                        {
                            if (!reader.HasRows)
                            {
                                return NotFound("No data available for the selected date range");
                            }

                            var data = new List<object>();
                            while (reader.Read())
                            {
                                var reportData = new Dictionary<string, object>();
                                for (int i = 0; i < reader.FieldCount; i++)
                                {
                                    reportData[reader.GetName(i)] = reader.GetValue(i);
                                }
                                data.Add(reportData);
                            }

                            return Ok(data);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while fetching data by date range: {ex.Message}");
            }
        }
        // ENDPOINT FOR REPORT RUAH
        [EnableCors("AllowAll")]
        [HttpGet("report-ruah")]
        public IActionResult ReportRuah(DateTime startDate, DateTime endDate)
        {
            try
            {
                // Define the target timezone (UTC+7)
                TimeZoneInfo targetTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");

                // Convert the received dates to UTC+7 timezone
                startDate = TimeZoneInfo.ConvertTime(startDate, targetTimeZone);
                endDate = TimeZoneInfo.ConvertTime(endDate, targetTimeZone);
                using (var connection = GetConnection())
                {
                    connection.Open();

                    var query = @"
            SELECT *, 'warehouse_data' AS table_origin FROM warehouse_data 
            WHERE ((DATE(completion_time) BETWEEN @StartDate AND @EndDate)
            OR (DATE(step_1) BETWEEN @StartDate AND @EndDate OR DATE(step_2) BETWEEN @StartDate AND @EndDate OR DATE(step_3) BETWEEN @StartDate AND @EndDate OR DATE(step_4) BETWEEN @StartDate AND @EndDate OR DATE(step_5) BETWEEN @StartDate AND @EndDate OR DATE(step_6) BETWEEN @StartDate AND @EndDate))
            AND product_type = 'ruah'
            UNION
            SELECT *, 'production_data' AS table_origin FROM production_data 
            WHERE ((DATE(completion_time) BETWEEN @StartDate AND @EndDate)
            OR (DATE(step_1) BETWEEN @StartDate AND @EndDate OR DATE(step_2) BETWEEN @StartDate AND @EndDate OR DATE(step_3) BETWEEN @StartDate AND @EndDate OR DATE(step_4) BETWEEN @StartDate AND @EndDate OR DATE(step_5) BETWEEN @StartDate AND @EndDate OR DATE(step_6) BETWEEN @StartDate AND @EndDate))
            AND product_type = 'ruah'
            UNION
            SELECT *, 'test_batch_data' AS table_origin FROM test_batch_data 
            WHERE ((DATE(completion_time) BETWEEN @StartDate AND @EndDate)
            OR (DATE(step_1) BETWEEN @StartDate AND @EndDate OR DATE(step_2) BETWEEN @StartDate AND @EndDate OR DATE(step_3) BETWEEN @StartDate AND @EndDate OR DATE(step_4) BETWEEN @StartDate AND @EndDate OR DATE(step_5) BETWEEN @StartDate AND @EndDate OR DATE(step_6) BETWEEN @StartDate AND @EndDate))
            AND product_type = 'ruah'
            UNION
            SELECT *, 'completed_batch_data' AS table_origin FROM completed_batch_data 
            WHERE ((DATE(completion_time) BETWEEN @StartDate AND @EndDate)
            OR (DATE(step_1) BETWEEN @StartDate AND @EndDate OR DATE(step_2) BETWEEN @StartDate AND @EndDate OR DATE(step_3) BETWEEN @StartDate AND @EndDate OR DATE(step_4) BETWEEN @StartDate AND @EndDate OR DATE(step_5) BETWEEN @StartDate AND @EndDate OR DATE(step_6) BETWEEN @StartDate AND @EndDate))
            AND product_type = 'ruah';";

                    using (var cmd = new MySqlCommand(query, connection))
                    {
                        cmd.Parameters.AddWithValue("@StartDate", startDate.Date);
                        cmd.Parameters.AddWithValue("@EndDate", endDate.Date);

                        using (var reader = cmd.ExecuteReader())
                        {
                            if (!reader.HasRows)
                            {
                                return NotFound("No data available for the selected date range");
                            }

                            var data = new List<object>();
                            while (reader.Read())
                            {
                                var reportData = new Dictionary<string, object>();
                                for (int i = 0; i < reader.FieldCount; i++)
                                {
                                    reportData[reader.GetName(i)] = reader.GetValue(i);
                                }
                                data.Add(reportData);
                            }

                            return Ok(data);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while fetching data by date range: {ex.Message}");
            }
        }

        // ENDPOINT FOR REPORT KEMAS
        [EnableCors("AllowAll")]
        [HttpGet("report-kemas")]
        public IActionResult ReportKemas(DateTime startDate, DateTime endDate)
        {
            try
            {
                // Define the target timezone (UTC+7)
                TimeZoneInfo targetTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");

                // Convert the received dates to UTC+7 timezone
                startDate = TimeZoneInfo.ConvertTime(startDate, targetTimeZone);
                endDate = TimeZoneInfo.ConvertTime(endDate, targetTimeZone);
                using (var connection = GetConnection())
                {
                    connection.Open();

                    var query = @"
            SELECT *, 'warehouse_data' AS table_origin FROM warehouse_data 
            WHERE ((DATE(completion_time) BETWEEN @StartDate AND @EndDate)
            OR (DATE(step_1) BETWEEN @StartDate AND @EndDate OR DATE(step_2) BETWEEN @StartDate AND @EndDate OR DATE(step_3) BETWEEN @StartDate AND @EndDate OR DATE(step_4) BETWEEN @StartDate AND @EndDate OR DATE(step_5) BETWEEN @StartDate AND @EndDate))
            AND product_type = 'kemas'
            UNION
            SELECT *, 'production_data' AS table_origin FROM production_data 
            WHERE ((DATE(completion_time) BETWEEN @StartDate AND @EndDate)
            OR (DATE(step_1) BETWEEN @StartDate AND @EndDate OR DATE(step_2) BETWEEN @StartDate AND @EndDate OR DATE(step_3) BETWEEN @StartDate AND @EndDate OR DATE(step_4) BETWEEN @StartDate AND @EndDate OR DATE(step_5) BETWEEN @StartDate AND @EndDate))
            AND product_type = 'kemas'
            UNION
            SELECT *, 'test_batch_data' AS table_origin FROM test_batch_data 
            WHERE ((DATE(completion_time) BETWEEN @StartDate AND @EndDate)
            OR (DATE(step_1) BETWEEN @StartDate AND @EndDate OR DATE(step_2) BETWEEN @StartDate AND @EndDate OR DATE(step_3) BETWEEN @StartDate AND @EndDate OR DATE(step_4) BETWEEN @StartDate AND @EndDate OR DATE(step_5) BETWEEN @StartDate AND @EndDate))
            AND product_type = 'kemas'
            UNION
            SELECT *, 'completed_batch_data' AS table_origin FROM completed_batch_data 
            WHERE ((DATE(completion_time) BETWEEN @StartDate AND @EndDate)
            OR (DATE(step_1) BETWEEN @StartDate AND @EndDate OR DATE(step_2) BETWEEN @StartDate AND @EndDate OR DATE(step_3) BETWEEN @StartDate AND @EndDate OR DATE(step_4) BETWEEN @StartDate AND @EndDate OR DATE(step_5) BETWEEN @StartDate AND @EndDate))
            AND product_type = 'kemas';";

                    using (var cmd = new MySqlCommand(query, connection))
                    {
                        cmd.Parameters.AddWithValue("@StartDate", startDate.Date);
                        cmd.Parameters.AddWithValue("@EndDate", endDate.Date);

                        using (var reader = cmd.ExecuteReader())
                        {
                            if (!reader.HasRows)
                            {
                                return NotFound("No data available for the selected date range");
                            }

                            var data = new List<object>();
                            while (reader.Read())
                            {
                                var reportData = new Dictionary<string, object>();
                                for (int i = 0; i < reader.FieldCount; i++)
                                {
                                    reportData[reader.GetName(i)] = reader.GetValue(i);
                                }
                                data.Add(reportData);
                            }

                            return Ok(data);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while fetching data by date range: {ex.Message}");
            }
        }

        //Audit_trail endpoint
[EnableCors("AllowAll")]
[HttpGet("audit-trail")]
public IActionResult getAudit(DateTime startDate, DateTime endDate)
{
    try
    {
        using(var connection = GetConnection())
        {
            connection.Open();
            var query = "SELECT user, action, timestamp, request_data FROM audit_trail";

            using(var cmd = new MySqlCommand(query, connection))
            {
                using(var reader = cmd.ExecuteReader())
                {
                    cmd.Parameters.AddWithValue("@StartDate", startDate.Date);
                    cmd.Parameters.AddWithValue("@EndDate", endDate.Date);
                    var auditData = new List<Dictionary<string, string>>();

                    while (reader.Read())
                    {
                        var auditEntry = new Dictionary<string, string>();

                        // Mendapatkan nilai dari setiap kolom dan menambahkannya ke dictionary
                        var user = reader.GetString("user");
                        var action = reader.GetString("action");
                        var timestamp = reader.GetDateTime("timestamp").ToString();
                        var requestData = reader.GetString("request_data");

                        auditEntry["user"] = user;
                        auditEntry["action"] = action;
                        auditEntry["timestamp"] = timestamp;
                        auditEntry["request data"] = requestData;

                        auditData.Add(auditEntry);
                    }

                    return Ok(auditData);
                }
            }
        }
    }
    catch (Exception ex)
    {
        return BadRequest(ex.Message);
    }
}




    }

}
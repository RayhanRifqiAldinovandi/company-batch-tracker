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
using Mysqlx;
using System;
using Mysqlx.Crud;
using System.Data;
using Microsoft.IdentityModel.Tokens;
using System.Diagnostics;
using Org.BouncyCastle.Asn1.Ocsp;
using System.Linq.Expressions;

namespace backend.Controllers
{
    [ApiController]
    [Route("api")]
    public class WorkOrderController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IJwtService _jwtService;
        private readonly Dictionary<string, List<string>> DepartmentSubDepartmentMap;
        private Dictionary<string, List<string>> ProcessingSequence = DefineDepartment.NextLocation.ProcessingSequence;


        public WorkOrderController(IConfiguration configuration, JwtService jwtService)
        {
            _configuration = configuration;
            _jwtService = jwtService;
            DepartmentSubDepartmentMap = DefineDepartment.DepartmentSubDepartmentMap;
            ProcessingSequence = DefineDepartment.NextLocation.ProcessingSequence;
        }

        private MySqlConnection GetConnection() => new MySqlConnection(_configuration.GetConnectionString("DefaultConnection"));

        [EnableCors("AllowAll")]
        [HttpGet("prod-keys")]
        public IActionResult getProdKeys(string product_type)
        {
            try
            {
 
                using(var connection = GetConnection())
                {
                    connection.Open();
                    string query = @"SELECT * FROM product_keys WHERE product_type = @ProductType";
                    using (var cmd = new MySqlCommand(query, connection))
                    {
                        cmd.Parameters.AddWithValue("@ProductType", product_type);
                        using(var reader = cmd.ExecuteReader())
                        {
                            var productKey = new List<productKeys>();
                            while (reader.Read())
                            {
                                var key_list = new productKeys
                                {
                                    product_type = reader.GetString("product_type"),
                                    product_key = reader.GetString("product_key")
                                };
 
                                productKey.Add(key_list);
                            }
 
                            return Ok(productKey);
                        }
                    }
 
 
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }
 

        // ENTRY WO ENDPOINT
        [EnableCors("AllowAll")]
        [HttpPost("entry-WO")]
        public IActionResult SubmitWorkOrder([FromBody] EntryWorkOrderData entryworkOrder)
        {
            try
            {
                int woNumber = entryworkOrder.WONumber;
                using(var connection = GetConnection())
                {
                    connection.Open();

                    var checkQuery = @"
                    SELECT COUNT(*) FROM ppic_data WHERE wo_number = @WONumber
                    UNION ALL
                    SELECT COUNT(*) FROM production_data WHERE wo_number = @WONumber
                    UNION ALL
                    SELECT COUNT(*) FROM warehouse_data WHERE wo_number = @WONumber";

                    // Check if the WO Number is already exist
                    using (var checkCmd = new MySqlCommand(checkQuery, connection))
                    {
                        checkCmd.Parameters.AddWithValue("@WONumber", woNumber);
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
                            var insertQuery = "INSERT INTO ppic_data (product_type, wo_number, batch_number, item_code, processing_department, sub_department, step_1,step_1_sender,movable) VALUES (@ProductType, @WONumber, @BatchNumber, @ItemCode, @ProcessingDepartment, @SubDepartment, NOW(), @step_1_sender,true);" +
                                              "INSERT INTO audit_trail (user,action,timestamp,request_data) VALUES (@username, 'Entry Work Order',NOW(),@action)";

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
                    catch (Exception ex)
                    {
                        return BadRequest(ex.Message);
                    }


                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while processing the request: {ex.Message}");
            }
        }

        // [EnableCors("AllowAll")]
        // [HttpGet("total-completed")]
        // public IActionResult GetCompleted(string month)
        // {
        //     try
        //     {
        //         using(var connection = GetConnection())
        //         {
        //             connection.Open();
        //             var query = "SELECT COUNT(unique_number) FROM completed_batch_data WHERE MONTHNAME(completion_time) = @month";

        //             var query2 = "SELECT COUNT(unique_number) FROM ppic_data WHERE MONTHNAME(step_1) = @month";

        //             using (var cmd = new MySqlCommand(query, connection))
        //             {
        //                 cmd.Parameters.AddWithValue("@month", month);
        //                 int result1 = Convert.ToInt32(cmd.ExecuteScalar());

        //                 cmd.CommandText = query2;
        //                 int result2 = Convert.ToInt32(cmd.ExecuteScalar());

        //                 return Ok(new { CompletedBatchData = result1, PpicData = result2 });
        //             }
        //         }
        //     }
        //     catch(Exception ex)
        //     {
        //         return BadRequest(BadRequest(ex.Message));  
        //     }
        // }

        // [EnableCors("AllowAll")]
        // [HttpGet("total-completed-percentage")]
        // public IActionResult GetCompletedPercentage()
        // {
        //     try
        //     {
        //         using (var connection = GetConnection())
        //         {
        //             connection.Open();
        //             var query = "SELECT("+
        //                             "(SELECT COUNT(unique_number) FROM completed_batch_data)/("+
		//                                 "(SELECT COUNT(unique_number) FROM production_data)+" +
    	//                                 "(SELECT COUNT(unique_number) FROM warehouse_data)+" +
    	//                                 "(SELECT COUNT(unique_number) FROM ppic_data)+" +
    	//                                 "(SELECT COUNT(unique_number) FROM completed_batch_data)) ) * 100"; 
                                
        //             using (var cmd = new MySqlCommand(query, connection))
        //             {
        //                 int result = Convert.ToInt32(cmd.ExecuteScalar());
        //                 return Ok(result);
        //             }
        //         }
        //     }
        //     catch (Exception ex)
        //     {
        //         return BadRequest(BadRequest(ex.Message));
        //     }
        // }

        //Untuk batch kemas dengan kode selain PEBJF
        [EnableCors("AllowAll")]
        [HttpGet("total-completed-variance-percentage")]
        public IActionResult GetCompletedVariantPercentage(string month, int targetYear)
        {
            try
            {
                using (var connection = GetConnection())
                {
                    connection.Open();
                    var query = "SELECT LEAST("+
                                    "(SELECT COUNT(unique_number) " +
                                    "FROM completed_batch_data " +
                                    "WHERE product_type = 'kemas' " +
                                    "AND item_code != 'PEBJF' AND MONTHNAME(completion_time) IN (SELECT month FROM target WHERE month = @month)" +
                                    ") / CAST((SELECT SUM(target_value) FROM target WHERE target_year = @targetYear AND target_for != 'PEBJF' AND month = @month) AS DECIMAL) * 100," +
                                    "100) AS variance_percentage";

                    using (var cmd = new MySqlCommand(query, connection))
                    {
                        cmd.Parameters.AddWithValue("@month", month);
                        cmd.Parameters.AddWithValue("@targetYear", targetYear);
                        using(var reader = cmd.ExecuteReader())
                        {
                            double data = 0.0;
                            if (reader.Read())
                            {
                                data = reader.IsDBNull("variance_percentage") ? 0.0 : reader.GetDouble("variance_percentage");
                            }
                            return Ok(Math.Round(data, 2));
                        }
                        
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest(BadRequest(ex.Message));
            }
        }


        //Untuk batch kemas dengan kode PEBJF
        [EnableCors("AllowAll")]
        [HttpGet("total-completed-PEBJF-percentage")]
        public IActionResult GetCompletedPEBJFPercentage(string month, int targetYear)
        {
            try
            {
                using (var connection = GetConnection())
                {
                    connection.Open();
                    var query = "SELECT LEAST(" +
                                    "(SELECT COUNT(unique_number) " +
                                    "FROM completed_batch_data " +
                                    "WHERE product_type = 'kemas' " +
                                    "AND item_code = 'PEBJF' AND MONTHNAME(completion_time) IN (SELECT month FROM target WHERE month = @month)" +
                                    ") / CAST((SELECT target_value FROM target WHERE target_year = @targetYear AND target_for = 'PEBJF'  AND month = @month) AS DECIMAL) * 100," +
                                    "100) AS PEBJF_percentage";

                    using (var cmd = new MySqlCommand(query, connection))
                    {
                        cmd.Parameters.AddWithValue("@month", month);
                        cmd.Parameters.AddWithValue("@targetYear", targetYear);
                        using (var reader = cmd.ExecuteReader())
                        {
                            double data = 0.0;
                            if (reader.Read())
                            {
                                data = reader.IsDBNull("PEBJF_percentage") ? 0.0 : reader.GetDouble("PEBJF_percentage");
                            }
                            return Ok(Math.Round(data, 2));
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                
                return BadRequest(BadRequest(ex.Message));
            }
        }

        [EnableCors("AllowAll")]
        [HttpPost("upload-target")]
        public IActionResult StoreTarget([FromBody] Target target)
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
                    var username = rawUsername.Replace("username:", ""); // This will give "adminwarehouse"

                    using (var connection = GetConnection())
                        {
                            connection.Open();

                            int woNumber = target.UniqueNumber;

                            var checkQuery = @"SELECT COUNT(*) FROM target WHERE month = @month AND target_year = @targetYear AND target_for = @targetFor";



                            using (var checkCmd = new MySqlCommand(checkQuery, connection))
                            {
                                checkCmd.Parameters.AddWithValue("@month", target.month);
                                checkCmd.Parameters.AddWithValue("@targetYear", target.target_year);
                                checkCmd.Parameters.AddWithValue("@targetFor", target.target_for);
                                using (var reader = checkCmd.ExecuteReader())
                                {
                                    int totalCount = 0;
                                    while (reader.Read())
                                    {
                                        totalCount += reader.GetInt32(0);
                                    }

                                    if (totalCount > 0)
                                    {
                                        return BadRequest("Target sudah ada");
                                    }
                                }
                            }

                            var query = "INSERT INTO target(month,target_value,target_year,target_for) VALUES(@month,@target,@targetYear,@targetFor)";
                            using (var cmd = new MySqlCommand(query, connection))
                            {
                                cmd.Parameters.AddWithValue("@month", target.month);
                                cmd.Parameters.AddWithValue("@target", target.target_value);
                                cmd.Parameters.AddWithValue("@targetYear", target.target_year);
                                cmd.Parameters.AddWithValue("@targetFor", target.target_for);
                                cmd.ExecuteNonQuery();
                            }
                            LogAuditTrail(connection, username,$"{username} Menambahkan Target",$"Menambahkan Target {target.target_value} untuk kode produk {target.target_for} untuk {target.month} {target.target_year}");
                            return Ok("Target sukses dimasukkan");
                        }
                    }
                    catch (Exception ex)
                    {
                       
                        return BadRequest($"Error lagi {ex}");
                    }
            }
            catch(Exception ex)
            {
                return BadRequest($"{ex.Message}");
            }
            
        }

        [EnableCors("AllowAll")]
        [HttpPut("update-target")]
        public IActionResult UpdateTarget([FromBody] Target target)
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
                    var username = rawUsername.Replace("username:", ""); // This will give "adminwarehouse"
                    using (var connection = GetConnection())
                    {
                        connection.Open();

                        var query = "UPDATE target SET target_value = @target, target_year = @targetYear, target_for = @targetFor WHERE unique_number = @uniqueNumber";
                        using (var cmd = new MySqlCommand(query, connection))
                        {
                            cmd.Parameters.AddWithValue("@uniqueNumber", target.UniqueNumber);
                            cmd.Parameters.AddWithValue("@month", target.month);
                            cmd.Parameters.AddWithValue("@target", target.target_value);
                            cmd.Parameters.AddWithValue("@targetYear", target.target_year);
                            cmd.Parameters.AddWithValue("@targetFor", target.target_for);
                            cmd.ExecuteNonQuery();

                        }
                        LogAuditTrail(connection, "username", $"{"username"} Mengupdate Target", $"Mengupdate Target menjadi {target.target_value} untuk kode produk {target.target_for} untuk {target.month} {target.target_year}");
                        return Ok("Target sukses diupdate");
                    }
                }
                catch (Exception ex)
                {
                    return BadRequest($"{ex}");
                }
            }
            catch(Exception ex)
            {
                return BadRequest();
            }
        }

        [EnableCors("AllowAll")]
        [HttpGet("total-completed-month")]
        public IActionResult GetFinsihedMonth()
        {
            try
            {
                using(var connection = GetConnection())
                {
                    connection.Open();
                    var query = "SELECT COUNT(unique_number) FROM completed_batch_data WHERE DATE(completion_time) = CURDATE()";
                    using(var cmd = new MySqlCommand(query,connection))
                    {
                        int count = Convert.ToInt32(cmd.ExecuteScalar());
                        return Ok(count);
                    }
                }
            }
            catch(Exception ex)
            {
                return BadRequest($"{ex}");
            }
        }

        [EnableCors("AllowAll")]
        [HttpGet("get-targets")]
        public IActionResult getTarget()
        {
            try
            {
                using(var connection = GetConnection())
                {
                    connection.Open();
                    var query = "SELECT * FROM target";
                    using( var cmd = new MySqlCommand(query,connection))
                    {
                        using(var reader = cmd.ExecuteReader())
                        {
                            var targetList = new List<Target>();

                            while (reader.Read())
                            {
                                var targetData = new Target
                                {
                                    UniqueNumber = reader.GetInt32("unique_number"),
                                    month = reader.GetString("month"),
                                    target_value = reader.GetInt32("target_value"),
                                    target_year = reader.GetInt32("target_year"),
                                    target_for = reader.GetString("target_for")

                                };
                                targetList.Add(targetData);
                            }
                            return Ok(targetList);

                        }
                    }
                }
            }catch(Exception ex)
            {
                return BadRequest(ex.Message);
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
                    SELECT *, 'ppic_data' AS table_origin FROM ppic_data
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
                                    Step7 = !reader.IsDBNull(reader.GetOrdinal("step_7")) ? reader.GetDateTime("step_7") : (DateTime?)null,
                                    step_7_sender = !reader.IsDBNull(reader.GetOrdinal("step_7_sender")) ? reader.GetString("step_7_sender") : null,
                                    movable = reader.GetBoolean("movable"),
                                    difference_in_days = null,
                                    moved_to_line = null,
                                    line_location = null,
                                    line_record = null,
                                    step_moveline_sender = reader.IsDBNull(reader.GetOrdinal("step_moveline_sender")) ? null : reader.GetString("step_moveline_sender"),
                                    moveline_step = reader.IsDBNull(reader.GetOrdinal("moveline_step")) ? (DateTime?)null : reader.GetDateTime("moveline_step"),
                                    CompletionTime = !reader.IsDBNull(reader.GetOrdinal("completion_time")) ? reader.GetDateTime("completion_time") : (DateTime?)null

                                };

                                if (workOrder.SubDepartment == "discharging" || workOrder.SubDepartment == "filling")
                                {
                                    workOrder.LineSelection = reader.IsDBNull(reader.GetOrdinal("line_selection")) ? null : reader.GetString("line_selection");
                                    workOrder.moved_to_line = reader.IsDBNull(reader.GetOrdinal("moved_to_line")) ? null : reader.GetString("moved_to_line");
                                    workOrder.line_location = workOrder.LineSelection;

                                    if (!workOrder.moved_to_line.IsNullOrEmpty())
                                    {
                                        workOrder.line_record = reader.IsDBNull(reader.GetOrdinal("line_record")) ? null : reader.GetString("line_record");
                                        workOrder.line_location = workOrder.moved_to_line;
                                    }
                                }

                                string key;
                                if (workOrder.LineSelection != null)
                                {
                                    key = $"{workOrder.SubDepartment}{workOrder.line_location}";
                                }
                                else
                                {
                                    key = $"{workOrder.SubDepartment}";
                                }

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
                        query = "INSERT INTO production_data SELECT * FROM ppic_data WHERE unique_number = @UniqueNumber AND product_type = @ProductType; " +
                                "INSERT INTO production_data SELECT * FROM warehouse_data WHERE unique_number = @UniqueNumber AND product_type = @ProductType; " +
                                "DELETE FROM ppic_data WHERE unique_number = @UniqueNumber AND product_type = @ProductType; " +
                                "DELETE FROM warehouse_data WHERE unique_number = @UniqueNumber AND product_type = @ProductType;";
                    }
                    else if (processingDepartment == "warehouse")
                    {
                        query = "INSERT INTO warehouse_data SELECT * FROM ppic_data WHERE unique_number = @UniqueNumber AND product_type = @ProductType; " +
                                "INSERT INTO warehouse_data SELECT * FROM production_data WHERE unique_number = @UniqueNumber AND product_type = @ProductType; " +
                                "DELETE FROM ppic_data WHERE unique_number = @UniqueNumber AND product_type = @ProductType; " +
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

        //Helper code to migrate a kemas batch to queue
        private IActionResult MigrateToQueue(string lineSelection, int uniqueNumber, string productType)
        {
          
            try
            {
                using(var connection = GetConnection())
                {
                    connection.Open();
                    bool queueOccupancy = CheckQueueOccupancy(productType,lineSelection);
                    if(queueOccupancy)
                    {
                        return BadRequest(new { message = "Antrian Penuh" });
                    }
                    var query = "UPDATE production_data SET queue = @lineSelection WHERE unique_number = @uniqueNumber";
                    using(var cmd = new MySqlCommand(query, connection))
                    {
                        cmd.Parameters.AddWithValue("@lineSelection",lineSelection);
                        cmd.Parameters.AddWithValue("@uniqueNumber", uniqueNumber);
                        cmd.ExecuteNonQuery();
                    }

                }
                return Ok("Sukses masuk antrian");
            }catch(Exception ex)
            {
                return BadRequest($"Exception {ex}");
               
            }
        }

        private int DifferenceInDays(DateTime? step_1, int? unique_number,string? processing_department)
        {
            try
            {
                
                using(var connection = GetConnection())
                {
                    
                    connection.Open();

                    string query = "";

                    
                    if (processing_department == "ppic"){
                        query = @"SELECT DATEDIFF(NOW(),@step_1) FROM ppic_data WHERE unique_number = @UniqueNumber";
                    }
                    else if(processing_department == "produksi")
                    {
                        query = @"SELECT DATEDIFF(NOW(),@step_1) FROM production_data WHERE unique_number = @UniqueNumber";
                    }
                    else if(processing_department == "warehouse"){
                        query = @"SELECT DATEDIFF(NOW(),@step_1) FROM warehouse_data WHERE unique_number = @UniqueNumber";
                    }
                    if (!string.IsNullOrEmpty(query))
                    {
                        using (var cmd = new MySqlCommand(query,connection))
                        {
                            cmd.Parameters.AddWithValue("@step_1",step_1);
                            cmd.Parameters.AddWithValue("@UniqueNumber",unique_number);
                            int result = Convert.ToInt32(cmd.ExecuteScalar());
                            return result;
                        }
                    }
                    else
                    {
                        throw new ArgumentException("Invalid processing department", processing_department);
                    }
                }
            }
            catch(Exception ex)
            {
                throw;
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
       

                    string query = "INSERT INTO completed_batch_data (unique_number,product_type,wo_number,batch_number,item_code,processing_department,sub_department,line_selection,step_1,step_1_sender,step_2,step_2_sender,step_3,step_3_sender,step_4,step_4_sender,step_5,step_5_sender,step_6,step_6_sender,completion_time,movable,moved_to_line,step_moveline_sender,moveline_step,line_record,pause_detail,pause_sender,pause_timestamp,return_sender,return_timestamp) SELECT unique_number,product_type,wo_number,batch_number,item_code,processing_department,sub_department,line_selection,step_1,step_1_sender,step_2,step_2_sender,step_3,step_3_sender,step_4,step_4_sender,step_5,step_5_sender,step_6,step_6_sender,completion_time,movable,moved_to_line,step_moveline_sender,moveline_step,line_record,pause_detail,pause_sender,pause_timestamp,return_sender,return_timestamp FROM production_data WHERE unique_number = @UniqueNumber AND product_type = @ProductType; " +
                                   "UPDATE completed_batch_data SET completion_time = NOW() WHERE unique_number = @UniqueNumber AND product_type = @ProductType; " +
                                   "DELETE FROM production_data WHERE unique_number = @UniqueNumber AND product_type = @ProductType;";

                    using (var cmd = new MySqlCommand(query, connection))
                    {
                        cmd.Parameters.AddWithValue("@UniqueNumber", uniqueNumber);
                        cmd.Parameters.AddWithValue("@ProductType", productType);
                        cmd.ExecuteNonQuery();
                    }
                }

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
                    bool lineOccupied = CheckLineOccupancy(lineSelection, productType);

                    if (!lineOccupied)
                    {
                        var updateLineQuery = "UPDATE production_data SET line_selection = @LineSelection WHERE unique_number = @UniqueNumber AND product_type = @ProductType";
                        using (var cmd = new MySqlCommand(updateLineQuery, connection))
                        {
                            cmd.Parameters.AddWithValue("@UniqueNumber", uniqueNumber);
                            cmd.Parameters.AddWithValue("@LineSelection", lineSelection);
                            cmd.Parameters.AddWithValue("@ProductType", productType);
                            cmd.ExecuteNonQuery();
                        }

                        if (nextSubDepartment == "discharging" || nextSubDepartment == "filling" && !lineOccupied)
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
                    Console.WriteLine("Penuh anying");
                    return "ERROR LINE IS FULL";
                }
            }
            catch (Exception ex)
            {
                return $"An error occurred while updating line selection: {ex.Message}";
            }
        }


        private bool CheckReadyForBatching()
        {
            try
            {
                using(var connection = GetConnection())
                {
                    connection.Open();
                    var query = "SELECT COUNT(*) FROM production_data WHERE sub_department = @subDepartment";
                    using (var cmd = new MySqlCommand(query, connection))
                    {
                        cmd.Parameters.AddWithValue("@subDepartment", "batching");
                        int count = Convert.ToInt32(cmd.ExecuteScalar());
                        return count > 0;
                    }
                }
            }catch(Exception ex)
            {

                throw;
            }
        }

        // HELPER CODE TO CHECK LINE OCCUPANCY
        private bool CheckLineOccupancy(string lineSelection,string productType)
        {
            try
            {
                using (var connection = GetConnection())
                {
                    connection.Open();
                    var query = "SELECT COUNT(*) FROM production_data WHERE (line_selection = @LineSelection OR moved_to_line = @lineSelection) AND product_type = @productType";
                    using (var cmd = new MySqlCommand(query, connection))
                    {
                        cmd.Parameters.AddWithValue("@LineSelection", lineSelection);
                        cmd.Parameters.AddWithValue("@productType", productType);
                        int count = Convert.ToInt32(cmd.ExecuteScalar());
                        return count > 0;
                    }
                }
            }
            catch (Exception ex)
            {
               
                throw; // Rethrow the exception
            }
        }

        private bool CheckQueueOccupancy(string productType, string lineSelection){
            try
            {
                using(var connection = GetConnection())
                {
                    connection.Open();
                    var query = "SELECT COUNT(*) FROM production_data WHERE queue = @LineSelection AND product_type = @productType";
                    using (var cmd  = new MySqlCommand(query, connection))
                    {
                        cmd.Parameters.AddWithValue("@LineSelection", lineSelection);
                        cmd.Parameters.AddWithValue("@productType", productType);
                        int count = Convert.ToInt32(cmd.ExecuteScalar());
                        return count > 0;
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        //Use this if a batch is going from queue to discharging
        private void ClearQueue(int uniqueNumber)
        {
            using (var connection = GetConnection())
            {
                connection.Open();
                var query = "UPDATE production_data SET queue = @null WHERE unique_number = @uniqueNumber";
                using(var cmd = new MySqlCommand(query,connection))
                {
                    cmd.Parameters.AddWithValue("@uniqueNumber", uniqueNumber);
                    cmd.Parameters.AddWithValue("@null", null);
                    cmd.ExecuteNonQuery();
                }
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
            var processingSequence = DefineDepartment.NextLocation.ProcessingSequence;

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

        private string? GetPrevProcessingStep(string currentSubDepartment, string productType)
        {
            // Access the processing sequence based on the product type
            var processingSequence = DefineDepartment.NextLocation.ProcessingSequence;

            // Find the index of the current location (sub-department) in the processing sequence
            var currentSequence = processingSequence.FirstOrDefault(x => x.Key == productType).Value;
            if (currentSequence != null)
            {
                int currentIndex = currentSequence.IndexOf(currentSubDepartment);
                if (currentIndex != -1 && currentIndex < currentSequence.Count)
                {
                    // Determine the previous sub-department
                    return currentSequence[currentIndex - 1];
                }
            }
            return null;
        }

        // HELPER CODE TO UPDATE SUB DEPARTMENT IN DB
        private void UpdateSubDepartment(MySqlConnection connection, int uniqueNumber, string nextSubDepartment, string productType, string username)
        {
            var updateSubDepartmentQuery = "UPDATE ppic_data SET sub_department = @NextSubDepartment WHERE unique_number = @UniqueNumber AND product_type = @ProductType;" +
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
            var updateProcessingDepartmentQuery = "UPDATE ppic_data SET processing_department = @NextProcessingDepartment WHERE unique_number = @UniqueNumber AND product_type = @ProductType;" +
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

        private void UpdateStepSender(MySqlConnection connection, int uniqueNumber, string productType, string nextSubDepartment, string username)
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
            if (DefineDepartment.NextLocation.ProcessingSequence.TryGetValue(productType, out productSteps))
            {
                int stepIndex = productSteps.IndexOf(nextSubDepartment);
                if (stepIndex != -1)
                {
                    return $"step_{Math.Min(stepIndex + 1, productSteps.Count)}";
                }
            }
            return null;
        }

        private string CurrentStepColumn(string productType, string currentSubDepartment)
        {
            List<string> productSteps;
            if (DefineDepartment.NextLocation.ProcessingSequence.TryGetValue(productType, out productSteps))
            {
                int stepIndex = productSteps.IndexOf(currentSubDepartment);
                if (stepIndex != -1)
                {
                    return $"step_{Math.Min(stepIndex +1, productSteps.Count)}";
                }
            }
            return null;
        }

        private string GetStepSenderColumn(string productType, string nextSubDepartment)
        {
            List<string> productSteps;
            if (DefineDepartment.NextLocation.ProcessingSequence.TryGetValue(productType, out productSteps))
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
        [HttpPut("reverse-wo")]
        public IActionResult check([FromBody] UpdateLocationRequest request)
        {
            
            try
            {
                int uniqueNumber = request.UniqueNumber;
                int woNumber = request.WONumber;
                string batchNumber = request.BatchNumber;
                string productType = request.ProductType;
                string currentSubDepartment = request.SubDepartment;
                string currentProcessing = DefineProcessingDepartment(currentSubDepartment);
                string step_column = CurrentStepColumn(productType, currentSubDepartment);
                string previous_subDepartment = GetPrevProcessingStep(currentSubDepartment, productType);
                string previous_processing = DefineProcessingDepartment(previous_subDepartment);
                string previous_sender = GetStepSenderColumn(productType,currentSubDepartment);
                string query = "";
               

                using (var connection = GetConnection())
                {
                    connection.Open();
                    if (currentProcessing == "produksi")
                    {
                        //Kalau subDepartement masih bagian dari produksi hapus dari tabel produksi dan masukkan ke warehouse
                        if (!DefineDepartment.DepartmentSubDepartmentMap["produksi"].Contains(previous_subDepartment))
                        {
                            query = $@"UPDATE warehouse_data SET {step_column} = null,{previous_sender} = null, sub_department = @previousSubDepartment, processing_department = @previousProcessing WHERE unique_number = @UniqueNumber;" +
                               $@"UPDATE production_data SET {step_column} = null,{previous_sender} = null, sub_department = @previousSubDepartment, processing_department = @previousProcessing WHERE unique_number = @UniqueNumber;"+
                               $@"INSERT INTO warehouse_data SELECT * FROM production_data WHERE unique_number = @UniqueNumber;" +
                               $@"DELETE FROM production_data WHERE unique_number = @UniqueNumber";
                        }
                        else
                        {
                            query = $@"UPDATE warehouse_data SET {step_column} = null,{previous_sender} = null, sub_department = @previousSubDepartment, processing_department = @previousProcessing WHERE unique_number = @UniqueNumber;" +
                                $@"UPDATE production_data SET {step_column} = null,{previous_sender} = null, sub_department = @previousSubDepartment, processing_department = @previousProcessing WHERE unique_number = @UniqueNumber";
                                
                              
                        }
                    }

                    if (previous_subDepartment == "batching")
                    {
                        if (CheckReadyForBatching())
                        {
                            return BadRequest("Batching sedang terisi");
                        }
                    }

                    if(currentProcessing == "warehouse" )
                    {
                        //Kalau subDepartement masih bagian dari warehouse hapus dari tabel warehouse dan masukkan ke ppic_data
                        if (!DefineDepartment.DepartmentSubDepartmentMap["warehouse"].Contains(previous_subDepartment))
                        {
                            query = $@"UPDATE warehouse_data SET {step_column} = null,{previous_sender} = null, sub_department = @previousSubDepartment, processing_department = @previousProcessing WHERE unique_number = @UniqueNumber;" +
                                    $@"UPDATE production_data SET {step_column} = null,{previous_sender} = null, sub_department = @previousSubDepartment, processing_department = @previousProcessing WHERE unique_number = @UniqueNumber;" +
                                    $@"INSERT INTO ppic_data SELECT * FROM warehouse_data WHERE unique_number = @UniqueNumber;" +
                                    $@"DELETE FROM warehouse_data WHERE unique_number = @UniqueNumber";
                        }
                        else
                        {
                            query = $@"UPDATE warehouse_data SET {step_column} = null,{previous_sender} = null, sub_department = @previousSubDepartment, processing_department = @previousProcessing WHERE unique_number = @UniqueNumber;" +
                                    $@"UPDATE production_data SET {step_column} = null,{previous_sender} = null, sub_department = @previousSubDepartment, processing_department = @previousProcessing WHERE unique_number = @UniqueNumber"; 
   
                        }
                    }
                    
                    using (var cmd = new MySqlCommand(query, connection))
                    {
                        cmd.Parameters.AddWithValue("@step_column", step_column);
                        cmd.Parameters.AddWithValue("@UniqueNumber", uniqueNumber);
                        cmd.Parameters.AddWithValue("@previousSubDepartment", previous_subDepartment);
                        cmd.Parameters.AddWithValue("@previousProcessing", previous_processing);
                        cmd.ExecuteNonQuery();
                 
                        
                    }

                }

                return Ok(new {message = "WO Reversed"});
            }

            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"{ex.Message}" });

            }
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
                    int woNumber = request.WONumber;
                    string batchNumber = request.BatchNumber;
                    string productType = request.ProductType;
                    string currentSubDepartment = request.SubDepartment;
                    string? queue = request.queue;
                    string lineSelection = request.LineSelection;
                    bool checkLine = CheckLineOccupancy(lineSelection, productType);

                    using (var connection = GetConnection())
                    {
                        connection.Open();

                        string nextSubDepartment = GetNextProcessingStep(currentSubDepartment, productType);
                        string nextProcessingDepartment = DefineProcessingDepartment(nextSubDepartment);

                        if (nextSubDepartment == null)
                        {
                            MigrateCompletedWorkOrder(uniqueNumber, productType, username);

                            // Audit Trail
                            LogAuditTrail(connection, username, "Tombol send diklik", $"proses WO {woNumber} selesai ");

                            return Ok("Work order processing completed.");
                        }

                        if(CheckQueueOccupancy(productType,lineSelection))
                        {
                            Console.WriteLine($"Kok penuh sih {lineSelection}");
                            return BadRequest($"Antrian dengan line {lineSelection} sudah terisi" );
                        }

                        if (nextSubDepartment == "discharging" || nextSubDepartment == "filling")
                        {
                            //Collection of decision trees as batch is going to discharging

                            

                            //if both lineSelection is null
                            if (string.IsNullOrEmpty(request.LineSelection))
                            {
                           
                                //Jika queue sedang kosong  (berarti diasumsikan batch sedang ada di queue)
                                if (string.IsNullOrEmpty(request.queue))
                                {
                                    
                                    
                                    return BadRequest("Pemilihan line diperlukan untuk discharging atau filling");
                                }

                                //Coba berikan value di kolom queue ke kolom lineSelection
                                lineSelection = request.queue;
                                //Cek terlebih dahulu apakah line sedang penuh jika iya return BadRequest jika tidak lanjutkan kode
                                if (CheckLineOccupancy(lineSelection, productType))
                                {
                                    return BadRequest($"{lineSelection} masih penuh");
                                }

                                
                            }

                            //get the response for UpdateLineSelection
                            string lineSelectionResponse = UpdateLineSelection(uniqueNumber, productType, lineSelection, nextSubDepartment);

                            if(lineSelectionResponse != "Line selection updated successfully")
                            {
                                
                                //Jika line sudah penuh tapi queue belum penuh
                                if (queue == null){
                                    MigrateToQueue(lineSelection,uniqueNumber,productType);
                                    return Ok($"Batch dikirim ke queue karena {lineSelection} penuh");
                                }

                            }

                        
                        }
                       


                       if (nextSubDepartment == "batching")
                        {
                            if (CheckReadyForBatching())
                            {
                                return BadRequest("Batching sedang terisi");
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
                        string successMessage = $"Lokasi WO {batchNumber} berpindah dari departemen {currentSubDepartment} ke departemen {nextSubDepartment}";

                        // Audit Trail
                        LogAuditTrail(connection, username, "kirim", successMessage);

                        return Ok("Lokasi sukses berpindah");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"{ex.Message}");
                    return StatusCode(500, $"An error occurred while updating location: {ex.Message}");
                }

            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }

        }

        [EnableCors("AllowAll")]
        [HttpPut("send-multiple")]
        public IActionResult SendMultipleButtonClicked([FromBody] List<UpdateLocationRequest> requests)
        {
            try
            {
                var authHeader = HttpContext.Request.Headers["Authorization"].FirstOrDefault();
                if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                {
                    authHeader = "None";
                }
                var token = authHeader.Substring("Bearer ".Length);

                var claims = _jwtService.ExtractClaims(token);  // Get all claims

                // Find the claim with the "username" key
                var rawUsername = claims.FirstOrDefault(c => c.Type == "username").Value;
                string username = rawUsername.Replace("username:", ""); // This will give "adminwarehouse"

                using (var connection = GetConnection())
                {
                    connection.Open();

                    foreach (var request in requests)
                    {
                        int uniqueNumber = request.UniqueNumber;
                        int woNumber = request.WONumber;
                        string batchNumber = request.BatchNumber;
                        string productType = request.ProductType;
                        string currentSubDepartment = request.SubDepartment;

                        string nextSubDepartment = GetNextProcessingStep(currentSubDepartment, productType);
                        string nextProcessingDepartment = DefineProcessingDepartment(nextSubDepartment);

                        if (nextSubDepartment == null)
                        {
                            MigrateCompletedWorkOrder(uniqueNumber, productType, username);

                            // Audit Trail
                            LogAuditTrail(connection, username, "Tombol send diklik", $"proses WO {woNumber} selesai ");
                            continue;
                        }

                        if (nextSubDepartment == "discharging" || nextSubDepartment == "filling")
                        {
                            if (string.IsNullOrEmpty(request.LineSelection))
                            {
                                return BadRequest("Pemilihan line diperlukan untuk discharging atau filling");
                            }

                            string lineSelection = request.LineSelection;
                            string lineSelectionResponse = UpdateLineSelection(uniqueNumber, productType, lineSelection, nextSubDepartment);

                            if (lineSelectionResponse != "Line selection updated successfully")
                            {
                                return BadRequest("Line is Occupied");
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
                        string successMessage = $"Lokasi WO {batchNumber} berpindah dari departemen {currentSubDepartment} ke departemen {nextSubDepartment}";

                        // Audit Trail
                        LogAuditTrail(connection, username, "kirim", successMessage);
                    }
                }

                return Ok("Batch yang dipilih berhasil dikirim.");
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error {e.Message}");
                return StatusCode(500, e.Message);
            }
        }

        [EnableCors("AllowAll")]
        [HttpPut("pause")]
        public IActionResult pause([FromBody] UpdateLocationRequest request)
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
                    int woNumber = request.WONumber;
                    string batchNumber = request.BatchNumber;
                    string productType = request.ProductType;
                    string pauseDetails = request.PauseDetail;


                    using (var connection = GetConnection())
                    {
                        connection.Open();
                        string query = @"UPDATE production_data SET sub_department = @pause, pause_detail = @detail, pause_sender = @username, pause_timestamp = NOW()  WHERE unique_number = @UniqueNumber";
                        using (var cmd = new MySqlCommand(query, connection))
                        {
                            cmd.Parameters.AddWithValue("@pause", "pause");
                            cmd.Parameters.AddWithValue("@detail", pauseDetails);
                            cmd.Parameters.AddWithValue("@username", username);
                            cmd.Parameters.AddWithValue("@UniqueNumber", uniqueNumber);
                            cmd.ExecuteNonQuery();
                        }
                        LogAuditTrail(connection, username, "Pause WO", $"WO {woNumber} dihentikan untuk sementara");
                    }

                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = ex.Message });
                }
                return Ok(new { message = "WO Berhasil di hentikan sementara" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [EnableCors("AllowAll")]
        [HttpPut("return-pause")]
        public IActionResult return_pause([FromBody] UpdateLocationRequest request)
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
                    int woNumber = request.WONumber;
                    string batchNumber = request.BatchNumber;
                    string productType = request.ProductType;


                    using (var connection = GetConnection())
                    {
                        connection.Open();
                        string query = @"UPDATE production_data SET sub_department = @return, return_sender = @username, return_timestamp = NOW() WHERE unique_number = @UniqueNumber";
                        using (var cmd = new MySqlCommand(query, connection))
                        {
                            cmd.Parameters.AddWithValue("@return", "penimbangan");
                            cmd.Parameters.AddWithValue("@username", username);
                            cmd.Parameters.AddWithValue("@UniqueNumber", uniqueNumber);
                            cmd.ExecuteNonQuery();
                        }
                        LogAuditTrail(connection, username, "Continue WO", $"WO {woNumber} dikembalikan ke proses penimbangan");
                    }

                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = ex.Message });
                }
                return Ok(new { message = "WO Berhasil dikembalikan ke proses penimbangan" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [EnableCors("AllowAll")]
        [HttpPut("return-staging")]
        public IActionResult return_staging([FromBody] UpdateLocationRequest request)
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
                    int woNumber = request.WONumber;
                    string batchNumber = request.BatchNumber;
                    string productType = request.ProductType;


                    using (var connection = GetConnection())
                    {
                        connection.Open();
                        string query = @"UPDATE production_data SET sub_department = @return, queue = @queue WHERE unique_number = @UniqueNumber";
                        using (var cmd = new MySqlCommand(query, connection))
                        {
                            cmd.Parameters.AddWithValue("@return", "staging");
                            cmd.Parameters.AddWithValue("@queue", null);
                            cmd.Parameters.AddWithValue("@UniqueNumber", uniqueNumber);
                            cmd.ExecuteNonQuery();
                        }
                        LogAuditTrail(connection, username, "Continue WO", $"WO {woNumber} dikembalikan ke proses staging");
                    }

                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = ex.Message });
                }
                return Ok(new { message = "WO Berhasil dikembalikan ke proses staging" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
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

        [EnableCors("AllowAll")]
        [HttpPost("move-line")]
        public IActionResult move_line_clicked([FromBody] UpdateLineRequest request)
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
                    int unique_number = request.UniqueNumber;
                    string? new_line = request.LineSelection;
                    string? currentLine = request.currentLine;
                    string productType = request.ProductType;
                    bool lineOccupied = CheckLineOccupancy(new_line, productType);

                    if (lineOccupied)
                    {
                        return Ok("Line sedang digunakan");
                    }
                    else
                    {
                        using (var connection = GetConnection())
                        {
                            connection.Open();
                            string query = "UPDATE production_data " +
                                           "SET moved_to_line = @newLine, " +
                                           "    moveline_step = NOW(), " +
                                           "    step_moveline_sender = @username, " +
                                           "    movable = false, " +
                                           "    line_record = @currentLine, " +
                                           "    line_selection = 'none' " +
                                           "WHERE unique_number = @UniqueNumber;";

                            using (var cmd = new MySqlCommand(query, connection))
                            {
                                cmd.Parameters.AddWithValue("@UniqueNumber", unique_number);
                                cmd.Parameters.AddWithValue("@newLine", new_line);
                                cmd.Parameters.AddWithValue("@username", username);
                                cmd.Parameters.AddWithValue("@currentLine", currentLine);

                                cmd.ExecuteNonQuery();
                            }
                        }
                        return Ok(new { message = $"Berhasil pindah line" });
                    }

                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.ToString());
                    return StatusCode(500, $"{ex.Message}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return StatusCode(500, $"Error saat pindah line: {ex.Message}");
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
 
                    SELECT *, 'ppic_data' AS table_origin FROM ppic_data
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
                                    Step1 = reader.IsDBNull(reader.GetOrdinal("step_1")) ? (DateTime?)null : reader.GetDateTime("step_1"),
                                    step_1_sender = reader.IsDBNull(reader.GetOrdinal("step_1_sender")) ? null : reader.GetString("step_1_sender"),
                                    Step2 = reader.IsDBNull(reader.GetOrdinal("step_2")) ? (DateTime?)null : reader.GetDateTime("step_2"),
                                    step_2_sender = reader.IsDBNull(reader.GetOrdinal("step_2_sender")) ? null : reader.GetString("step_2_sender"),
                                    Step3 = reader.IsDBNull(reader.GetOrdinal("step_3")) ? (DateTime?)null : reader.GetDateTime("step_3"),
                                    step_3_sender = reader.IsDBNull(reader.GetOrdinal("step_3_sender")) ? null : reader.GetString("step_3_sender"),
                                    Step4 = reader.IsDBNull(reader.GetOrdinal("step_4")) ? (DateTime?)null : reader.GetDateTime("step_4"),
                                    step_4_sender = reader.IsDBNull(reader.GetOrdinal("step_4_sender")) ? null : reader.GetString("step_4_sender"),
                                    Step5 = reader.IsDBNull(reader.GetOrdinal("step_5")) ? (DateTime?)null : reader.GetDateTime("step_5"),
                                    step_5_sender = reader.IsDBNull(reader.GetOrdinal("step_5_sender")) ? null : reader.GetString("step_5_sender"),
                                    Step6 = reader.IsDBNull(reader.GetOrdinal("step_6")) ? (DateTime?)null : reader.GetDateTime("step_6"),
                                    step_6_sender = reader.IsDBNull(reader.GetOrdinal("step_6_sender")) ? null : reader.GetString("step_6_sender"),
                                    difference_in_days = null,
                                    CompletionTime = reader.IsDBNull(reader.GetOrdinal("completion_time")) ? (DateTime?)null : reader.GetDateTime("completion_time"),
                                    PauseDetail = reader.IsDBNull(reader.GetOrdinal("pause_detail")) ? null : reader.GetString("pause_detail"),
                                    pause_sender = reader.IsDBNull(reader.GetOrdinal("pause_sender")) ? null : reader.GetString("pause_sender"),
                                    pause_timestamp = reader.IsDBNull(reader.GetOrdinal("pause_timestamp")) ? (DateTime?)null : reader.GetDateTime("pause_timestamp"),
                                    return_sender = reader.IsDBNull(reader.GetOrdinal("return_sender")) ? null : reader.GetString("return_sender"),
                                    return_timestamp = reader.IsDBNull(reader.GetOrdinal("return_timestamp")) ? (DateTime?)null : reader.GetDateTime("return_timestamp"),
                                };

                                workOrder.difference_in_days = DifferenceInDays(workOrder.Step1, workOrder.UniqueNumber, workOrder.ProcessingDepartment);
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
                return StatusCode(500, $"An error occurred while fetching Minor data: {ex.Message}");
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
 
                    SELECT *, 'ppic_data' AS table_origin FROM ppic_data
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

                                    Step7 = !reader.IsDBNull(reader.GetOrdinal("step_7")) ? reader.GetDateTime("step_7") : (DateTime?)null,
                                    step_7_sender = !reader.IsDBNull(reader.GetOrdinal("step_7_sender")) ? reader.GetString("step_7_sender") : null,

                                    difference_in_days = null,
                                    movable = reader.GetBoolean("movable"),
                                    moved_to_line = null,
                                    line_location = null,
                                    line_record = null,
                                    queue = !reader.IsDBNull(reader.GetOrdinal("queue")) ? reader.GetString("queue") : null,
                                    step_moveline_sender = reader.IsDBNull(reader.GetOrdinal("step_moveline_sender")) ? null : reader.GetString("step_moveline_sender"),
                                    moveline_step = reader.IsDBNull(reader.GetOrdinal("moveline_step")) ? (DateTime?)null : reader.GetDateTime("moveline_step"),
                                    CompletionTime = reader.IsDBNull(reader.GetOrdinal("completion_time")) ? (DateTime?)null : reader.GetDateTime("completion_time"),
                                };


                                if (workOrder.SubDepartment == "discharging")
                                {
                                    workOrder.LineSelection = reader.IsDBNull(reader.GetOrdinal("line_selection")) ? null : reader.GetString("line_selection");
                                    workOrder.moved_to_line = reader.IsDBNull(reader.GetOrdinal("moved_to_line")) ? null : reader.GetString("moved_to_line");
                                    workOrder.line_location = workOrder.LineSelection;

                                    if (!workOrder.moved_to_line.IsNullOrEmpty())
                                    {
                                        workOrder.line_record = reader.IsDBNull(reader.GetOrdinal("line_record")) ? null : reader.GetString("line_record");
                                        workOrder.line_location = workOrder.moved_to_line;
                                    }
                                }

                                workOrder.difference_in_days = DifferenceInDays(workOrder.Step1, workOrder.UniqueNumber, workOrder.ProcessingDepartment);
                                

                                string key;
                                if (workOrder.LineSelection != null)
                                {
                                    key = $"{workOrder.SubDepartment}{workOrder.line_location}";
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
                Console.WriteLine($"{ex.Message}");
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
 
                SELECT *, 'ppic_data' AS table_origin FROM ppic_data
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
                                    LineSelection = reader.IsDBNull(reader.GetOrdinal("line_selection")) ? null : reader.GetString("line_selection"),
                                    Step1 = reader.IsDBNull(reader.GetOrdinal("step_1")) ? (DateTime?)null : reader.GetDateTime("step_1"),
                                    step_1_sender = reader.IsDBNull(reader.GetOrdinal("step_1_sender")) ? null : reader.GetString("step_1_sender"),
                                    Step2 = reader.IsDBNull(reader.GetOrdinal("step_2")) ? (DateTime?)null : reader.GetDateTime("step_2"),
                                    step_2_sender = reader.IsDBNull(reader.GetOrdinal("step_2_sender")) ? null : reader.GetString("step_2_sender"),
                                    Step3 = reader.IsDBNull(reader.GetOrdinal("step_3")) ? (DateTime?)null : reader.GetDateTime("step_3"),
                                    step_3_sender = reader.IsDBNull(reader.GetOrdinal("step_3_sender")) ? null : reader.GetString("step_3_sender"),
                                    Step4 = reader.IsDBNull(reader.GetOrdinal("step_4")) ? (DateTime?)null : reader.GetDateTime("step_4"),
                                    step_4_sender = reader.IsDBNull(reader.GetOrdinal("step_4_sender")) ? null : reader.GetString("step_4_sender"),
                                    Step5 = reader.IsDBNull(reader.GetOrdinal("step_5")) ? (DateTime?)null : reader.GetDateTime("step_5"),
                                    step_5_sender = reader.IsDBNull(reader.GetOrdinal("step_5_sender")) ? null : reader.GetString("step_5_sender"),
                                    difference_in_days = null,
                                    movable = reader.GetBoolean("movable"),
                                    moved_to_line = null,
                                    line_location = null,
                                    line_record = null,
                                    queue = !reader.IsDBNull(reader.GetOrdinal("queue")) ? reader.GetString("queue") : null,
                                    step_moveline_sender = reader.IsDBNull(reader.GetOrdinal("step_moveline_sender")) ? null : reader.GetString("step_moveline_sender"),
                                    moveline_step = reader.IsDBNull(reader.GetOrdinal("moveline_step")) ? (DateTime?)null : reader.GetDateTime("moveline_step"),
                                    CompletionTime = reader.IsDBNull(reader.GetOrdinal("completion_time")) ? (DateTime?)null : reader.GetDateTime("completion_time")
                                };

                                if (workOrder.SubDepartment == "filling")
                                {
                                    workOrder.LineSelection = reader.IsDBNull(reader.GetOrdinal("line_selection")) ? null : reader.GetString("line_selection");
                                    workOrder.moved_to_line = reader.IsDBNull(reader.GetOrdinal("moved_to_line")) ? null : reader.GetString("moved_to_line");
                                    workOrder.line_location = workOrder.LineSelection;

                                    if (!workOrder.moved_to_line.IsNullOrEmpty())
                                    {
                                        workOrder.line_record = reader.IsDBNull(reader.GetOrdinal("line_record")) ? null : reader.GetString("line_record");
                                        workOrder.line_location = workOrder.moved_to_line;
                                    }
                                }


                                workOrder.difference_in_days = DifferenceInDays(workOrder.Step1, workOrder.UniqueNumber, workOrder.ProcessingDepartment);

                                string key = $"{workOrder.SubDepartment}{workOrder.line_location}";

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
                Console.WriteLine(ex.Message);
                return StatusCode(500, $"An error occurred while fetching Kemas data: {ex.Message}");
            }

        }

        // ENDPOINT FOR DELETE BUTTON IN BATCH TRACKER
        [EnableCors("AllowAll")]
        [HttpDelete("delete-work-order")]
        public IActionResult DeleteWorkOrder([FromBody] DeleteWorkOrderRequest request)
        {
            int uniqueNumber = request.UniqueNumber;
            int woNumber = request.WONumber;

            try
            {
                using (var connection = GetConnection())
                {
                    connection.Open();

                    string query = @"
                                    DELETE FROM ppic_data WHERE unique_number = @UniqueNumber;
                                    DELETE FROM production_data WHERE unique_number = @UniqueNumber;
                                    DELETE FROM warehouse_data WHERE unique_number = @UniqueNumber;
                                    INSERT INTO audit_trail (user,action,timestamp,request_data) VALUES (@username, 'Delete',NOW(),@RequestData)";


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



                    using (var cmd = new MySqlCommand(query, connection))
                    {
                        cmd.Parameters.AddWithValue("@username", username);
                        cmd.Parameters.AddWithValue("@RequestData", $"WO Deleted: {woNumber}");
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

        [EnableCors("AllowAll")]
        [HttpGet("line-chart")]
        public IActionResult getYearlyData(int year)
        {
            try
            {
                using(var connection = GetConnection())
                {
                    connection.Open();
                    var query = "SELECT SUM(CASE WHEN MONTHNAME(completion_time) = 'January' THEN 1 ELSE 0 END) AS January, SUM(CASE WHEN MONTHNAME(completion_time) = 'February' THEN 1 ELSE 0 END) AS February," +
                                "SUM(CASE WHEN MONTHNAME(completion_time) = 'March' THEN 1 ELSE 0 END) AS March,SUM(CASE WHEN MONTHNAME(completion_time) = 'April' THEN 1 ELSE 0 END) AS April," +
                                "SUM(CASE WHEN MONTHNAME(completion_time) = 'May' THEN 1 ELSE 0 END) AS May,SUM(CASE WHEN MONTHNAME(completion_time) = 'June' THEN 1 ELSE 0 END) AS June," +
                                "SUM(CASE WHEN MONTHNAME(completion_time) = 'July' THEN 1 ELSE 0 END) AS July,SUM(CASE WHEN MONTHNAME(completion_time) = 'August' THEN 1 ELSE 0 END) AS August," +
                                "SUM(CASE WHEN MONTHNAME(completion_time) = 'September' THEN 1 ELSE 0 END) AS September,SUM(CASE WHEN MONTHNAME(completion_time) = 'October' THEN 1 ELSE 0 END) AS October," +
                                "SUM(CASE WHEN MONTHNAME(completion_time) = 'November' THEN 1 ELSE 0 END) AS November,SUM(CASE WHEN MONTHNAME(completion_time) = 'December' THEN 1 ELSE 0 END) AS December " +
                                "FROM completed_batch_data WHERE YEAR(completion_time) = @year AND MONTHNAME(completion_time) IN " +
                                "('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December')";
                    using (var cmd = new MySqlCommand(query,connection))
                    {
                        cmd.Parameters.AddWithValue("@year",year);
                        using(var reader = cmd.ExecuteReader())
                        {
                            var chartData = new Dictionary<string,int>();
                            while (reader.Read())
                            {
                                //add all the data to the dictionary
                                chartData.Add("January", reader.GetInt32("January"));
                                chartData.Add("February", reader.GetInt32("February"));
                                chartData.Add("March", reader.GetInt32("March"));
                                chartData.Add("April", reader.GetInt32("April"));
                                chartData.Add("May", reader.GetInt32("May"));
                                chartData.Add("June", reader.GetInt32("June"));
                                chartData.Add("July", reader.GetInt32("July"));
                                chartData.Add("August", reader.GetInt32("August"));
                                chartData.Add("September", reader.GetInt32("September"));
                                chartData.Add("October", reader.GetInt32("October"));
                                chartData.Add("November", reader.GetInt32("November"));
                                chartData.Add("December", reader.GetInt32("December"));
                            }
                            return Ok(chartData);
                        }
                    }
                }
            }
            catch(Exception ex)
            {
                return BadRequest($"{ex.Message}");
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
            SELECT *, 'ppic_data' AS table_origin FROM ppic_data 
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
            OR (DATE(step_1) BETWEEN @StartDate AND @EndDate OR DATE(step_2) BETWEEN @StartDate AND @EndDate OR DATE(step_3) BETWEEN @StartDate AND @EndDate OR DATE(step_4) BETWEEN @StartDate AND @EndDate OR DATE(step_5) BETWEEN @StartDate AND @EndDate OR DATE(step_6) BETWEEN @StartDate AND @EndDate OR DATE(step_6) BETWEEN @StartDate AND @EndDate))
            AND product_type = 'ruah'
            UNION
            SELECT *, 'production_data' AS table_origin FROM production_data 
            WHERE ((DATE(completion_time) BETWEEN @StartDate AND @EndDate)
            OR (DATE(step_1) BETWEEN @StartDate AND @EndDate OR DATE(step_2) BETWEEN @StartDate AND @EndDate OR DATE(step_3) BETWEEN @StartDate AND @EndDate OR DATE(step_4) BETWEEN @StartDate AND @EndDate OR DATE(step_5) BETWEEN @StartDate AND @EndDate OR DATE(step_6) BETWEEN @StartDate AND @EndDate OR DATE(step_6) BETWEEN @StartDate AND @EndDate))
            AND product_type = 'ruah'
            UNION
            SELECT *, 'ppic_data' AS table_origin FROM ppic_data 
            WHERE ((DATE(completion_time) BETWEEN @StartDate AND @EndDate)
            OR (DATE(step_1) BETWEEN @StartDate AND @EndDate OR DATE(step_2) BETWEEN @StartDate AND @EndDate OR DATE(step_3) BETWEEN @StartDate AND @EndDate OR DATE(step_4) BETWEEN @StartDate AND @EndDate OR DATE(step_5) BETWEEN @StartDate AND @EndDate OR DATE(step_6) BETWEEN @StartDate AND @EndDate OR DATE(step_6) BETWEEN @StartDate AND @EndDate))
            AND product_type = 'ruah'
            UNION
            SELECT *, 'completed_batch_data' AS table_origin FROM completed_batch_data 
            WHERE ((DATE(completion_time) BETWEEN @StartDate AND @EndDate)
            OR (DATE(step_1) BETWEEN @StartDate AND @EndDate OR DATE(step_2) BETWEEN @StartDate AND @EndDate OR DATE(step_3) BETWEEN @StartDate AND @EndDate OR DATE(step_4) BETWEEN @StartDate AND @EndDate OR DATE(step_5) BETWEEN @StartDate AND @EndDate OR DATE(step_6) BETWEEN @StartDate AND @EndDate OR DATE(step_7) BETWEEN @StartDate AND @EndDate))
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
            OR (DATE(step_1) BETWEEN @StartDate AND @EndDate OR DATE(step_2) BETWEEN @StartDate AND @EndDate OR DATE(step_3) BETWEEN @StartDate AND @EndDate OR DATE(step_4) BETWEEN @StartDate AND @EndDate OR DATE(step_5) BETWEEN @StartDate AND @EndDate OR DATE(moveline_step) BETWEEN @StartDate AND @EndDate))
            AND product_type = 'kemas'
            UNION
            SELECT *, 'production_data' AS table_origin FROM production_data 
            WHERE ((DATE(completion_time) BETWEEN @StartDate AND @EndDate)
            OR (DATE(step_1) BETWEEN @StartDate AND @EndDate OR DATE(step_2) BETWEEN @StartDate AND @EndDate OR DATE(step_3) BETWEEN @StartDate AND @EndDate OR DATE(step_4) BETWEEN @StartDate AND @EndDate OR DATE(step_5) BETWEEN @StartDate AND @EndDate OR DATE(moveline_step) BETWEEN @StartDate AND @EndDate))
            AND product_type = 'kemas'
            UNION
            SELECT *, 'ppic_data' AS table_origin FROM ppic_data 
            WHERE ((DATE(completion_time) BETWEEN @StartDate AND @EndDate)
            OR (DATE(step_1) BETWEEN @StartDate AND @EndDate OR DATE(step_2) BETWEEN @StartDate AND @EndDate OR DATE(step_3) BETWEEN @StartDate AND @EndDate OR DATE(step_4) BETWEEN @StartDate AND @EndDate OR DATE(step_5) BETWEEN @StartDate AND @EndDate OR DATE(moveline_step) BETWEEN @StartDate AND @EndDate))
            AND product_type = 'kemas'
            UNION
            SELECT *, 'completed_batch_data' AS table_origin FROM completed_batch_data 
            WHERE ((DATE(completion_time) BETWEEN @StartDate AND @EndDate)
            OR (DATE(step_1) BETWEEN @StartDate AND @EndDate OR DATE(step_2) BETWEEN @StartDate AND @EndDate OR DATE(step_3) BETWEEN @StartDate AND @EndDate OR DATE(step_4) BETWEEN @StartDate AND @EndDate OR DATE(step_5) BETWEEN @StartDate AND @EndDate OR DATE(moveline_step) BETWEEN @StartDate AND @EndDate))
            AND product_type = 'kemas';";

                    using (var cmd = new MySqlCommand(query, connection))
                    {
                        cmd.Parameters.AddWithValue("@StartDate", startDate.Date);
                        cmd.Parameters.AddWithValue("@EndDate", endDate.Date);

                        using (var reader = cmd.ExecuteReader())
                        {
                            if (!reader.HasRows)
                            {
                                return Ok("No data found for this date");
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
                using (var connection = GetConnection())
                {
                    connection.Open();
                    var query = "SELECT user, action, timestamp, request_data FROM audit_trail";

                    using (var cmd = new MySqlCommand(query, connection))
                    {
                        using (var reader = cmd.ExecuteReader())
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
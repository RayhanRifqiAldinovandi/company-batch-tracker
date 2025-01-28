namespace backend.Models
{

    public class WorkOrderData
    {
      
        public required int? UniqueNumber { get; set; }
        public required string ProductType { get; set; }
        public required int WONumber { get; set; }
        public required string BatchNumber { get; set; }
        public  string BatchStatus { get; set; }
        public required string ItemCode { get; set; }
        public required string ProcessingDepartment {  get; set; }
        public string? TableOrigin { get; set; } 
        public required string SubDepartment { get; set;}
        public DateTime? Step1 { get; set; }

        public string? step_1_sender { get; set; }
        public DateTime? Step2 { get; set; }
        public string? step_2_sender { get; set; }
        public DateTime? Step3 { get; set; }
        public string? step_3_sender { get; set; }
        public DateTime? Step4 { get; set; }
        public string? step_4_sender { get; set; }
        public DateTime? Step5 { get; set; }
        public string? step_5_sender { get; set; }
        public DateTime? Step6 { get; set; }
        public string? step_6_sender { get; set; }
        public DateTime? CompletionTime { get; set; }
    }

    public class RuahData
    {
        public int? UniqueNumber { get; set; }
        public required string ProductType { get; set; }
        public required int WONumber { get; set; }
        public required string BatchNumber { get; set; }
        public required string ItemCode { get; set; }
        public string? ProcessingDepartment { get; set; }
        public string? SubDepartment { get; set; }
        public string? LineSelection { get; set; }
        public DateTime? Step1 { get; set; }
        public string? step_1_sender { get; set; }
        public DateTime? Step2 { get; set; }
        public string? step_2_sender { get; set; }
        public DateTime? Step3 { get; set; }
        public string? step_3_sender { get; set; }
        public DateTime? Step4 { get; set; }
        public string? step_4_sender { get; set; }
        public DateTime? Step5 { get; set; }
        public string? step_5_sender { get; set; }
        public DateTime? Step6 { get; set; }
        public string? step_6_sender { get; set; }
        public DateTime? CompletionTime { get; set; }
    }

    public class MinorData
    {
        
        public int? UniqueNumber { get; set; }
        public required string ProductType { get; set; }
        public required int WONumber { get; set; }
        public required string BatchNumber { get; set; }
        public required string ItemCode { get; set; }
        public string? ProcessingDepartment { get; set; }
        public string? SubDepartment { get; set; }
        public string? LineSelection { get; set; }
        public DateTime? Step1 { get; set; }
        public string? step_1_sender { get; set; }
        public DateTime? Step2 { get; set; }
        public string? step_2_sender { get; set; }
        public DateTime? Step3 { get; set; }
        public string? step_3_sender { get; set; }
        public DateTime? Step4 { get; set; }
        public string? step_4_sender { get; set; }
        public DateTime? Step5 { get; set; }
        public string? step_5_sender { get; set; }
        public DateTime? Step6 { get; set; }
        public string? step_6_sender { get; set; }
        public DateTime? CompletionTime { get; set; }
    }

    public class KemasData
    {
        
        public int? UniqueNumber { get; set; }
        public required string ProductType { get; set; }
        public required int WONumber { get; set; }
        public required string BatchNumber { get; set; }
        public required string ItemCode { get; set; }
        public string? ProcessingDepartment { get; set; }
        public string? SubDepartment { get; set; }
        public string? LineSelection { get; set; }
        public DateTime? Step1 { get; set; }
        public string? step_1_sender { get; set; }
        public DateTime? Step2 { get; set; }
        public string? step_2_sender { get; set; }
        public DateTime? Step3 { get; set; }
        public string? step_3_sender { get; set; }
        public DateTime? Step4 { get; set; }
        public string? step_4_sender { get; set; }
        public DateTime? Step5 { get; set; }
        public string? step_5_sender { get; set; }
        public DateTime? Step6 { get; set; }
        public string? step_6_sender { get; set; }
        public DateTime? CompletionTime { get; set; }
    }


    public class EntryWorkOrderData
    {
        
        public required string ProductType { get; set; }
        public required int WONumber { get; set; }
        public required string BatchNumber { get; set; }
        public required string ItemCode { get; set; }
        public string? ProcessingDepartment { get; set; }
        public string? SubDepartment {  get; set; } 
    }

    public class UpdateLocationRequest
    {
        public required int UniqueNumber { get; set; }
        public required string ProductType { get; set; }
        public required string SubDepartment { get; set; }
        public string? LineSelection { get; set;}
    }

    public class auditTrail
    {
        public  int? UniqueNumber { get; set; }
        public required string user { get; set;}
        public required string action { get; set; }
        public required DateTime timestamp { get; set; }
        public required string request_data {  get; set; }
    }

    public class DeleteWorkOrderRequest
    {
        public int UniqueNumber { get; set; }
        public required string BatchNumber { get; set; }
    }

    public static class DefineDepartment
    {
        public static Dictionary<string, List<string>> DepartmentSubDepartmentMap { get; } = new Dictionary<string, List<string>>
        {
            {"ppic", new List<string> { "ppic"} },
            {"warehouse", new List<string> { "warehouse", "warehouse_staging"} },
            {"produksi",  new List<string> {"penimbangan", "blending","tipping", "batching", "discharging", "staging", "produksi", "ready_for_tipping","filling"}}
        };
    }

    public static class NextLocation
    {
        public static Dictionary<string, List<string>> ProcessingSequence { get; } = new Dictionary<string, List<string>>
        {
            { "minor", new List<string> {"ppic", "warehouse", "warehouse_staging", "penimbangan", "ready_for_tipping", "tipping" } },
            { "ruah", new List<string> { "ppic", "warehouse", "batching", "blending","staging", "discharging" } },
            { "kemas", new List<string> { "ppic", "produksi", "warehouse", "staging", "filling" } }
        };
    }       

}

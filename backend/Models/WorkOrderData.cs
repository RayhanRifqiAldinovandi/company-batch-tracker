namespace backend.Models
{

    public class WorkOrderData
    {

        public required int? UniqueNumber { get; set; }
        public required string ProductType { get; set; }
        public required int WONumber { get; set; }
        public required string BatchNumber { get; set; }
        public string BatchStatus { get; set; }
        public required string ItemCode { get; set; }
        public required string ProcessingDepartment { get; set; }
        public string? TableOrigin { get; set; }
        public required string SubDepartment { get; set; }
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
        public DateTime? Step7 { get; set; }
        public string? step_7_sender { get; set; }
        public DateTime? CompletionTime { get; set; }
        public string? line_location { get; set; }

        public bool? movable { get; set; }
        public string moved_to_line { get; set; }
        public string? step_moveline_sender { get; set; }
        public DateTime? moveline_step { get; set; }
        public string? line_record { get; set; }
        public int? difference_in_days { get; set; }
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
        public string? PauseDetail { get; set; }
        public string? pause_sender { get; set; }
        public DateTime? pause_timestamp { get; set; }
        public string? return_sender { get; set; }
        public DateTime? return_timestamp { get; set; }
        public int? difference_in_days { get; set; }
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
        public DateTime? Step7 { get; set; }
        public string? step_7_sender { get; set; }
        public DateTime? CompletionTime { get; set; }
        public string? line_location { get; set; }
        public bool? movable { get; set; }
        public string moved_to_line { get; set; }
        public string? step_moveline_sender { get; set; }
        public DateTime? moveline_step { get; set; }
        public string? line_record { get; set; }
        public string? queue { get; set; }
        public int? difference_in_days { get; set; }
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
        public string? line_location { get; set; }
        public bool? movable { get; set; }
        public string moved_to_line { get; set; }
        public string? step_moveline_sender { get; set; }
        public DateTime? moveline_step { get; set; }
        public string? line_record { get; set; }
        public string? queue { get; set; }
        public int? difference_in_days { get; set; }
    }

    public class productKeys
    {
        public string product_type { get; set; }
        public string? product_key { get; set; }
    }

    public class EntryWorkOrderData
    {

        public required string ProductType { get; set; }
        public required int WONumber { get; set; }
        public required string BatchNumber { get; set; }
        public required string ItemCode { get; set; }
        public string? ProcessingDepartment { get; set; }
        public string? SubDepartment { get; set; }
    }

    public class UpdateLocationRequest
    {
        public required int UniqueNumber { get; set; }
        public required string ProductType { get; set; }
        public required int WONumber { get; set; }
        public required string BatchNumber { get; set; }
        public required string SubDepartment { get; set; }
        public string? LineSelection { get; set; }
        public string? PauseDetail { get; set; }
        public string? queue { get;set; }
    }

    public class UpdateLineRequest
    {
        public required int UniqueNumber { get; set; }
        public string? LineSelection { get; set; }
        public string? currentLine { get; set; }
        public required string ProductType { get; set; }
    }

    public class Target
    {
        public int UniqueNumber { get; set; }
        public required int target_value { get;set; }
        public required int target_year { get; set; }
        public required string month { get; set; }
        public string target_for { get; set; }
    }

    public class auditTrail
    {
        public int? UniqueNumber { get; set; }
        public required string user { get; set; }
        public required string action { get; set; }
        public required DateTime timestamp { get; set; }
        public required string request_data { get; set; }
    }

    public class DeleteWorkOrderRequest
    {
        public int UniqueNumber { get; set; }
        public int WONumber { get; set; }
    }

    public static class DefineDepartment
    {
        public static Dictionary<string, List<string>> DepartmentSubDepartmentMap { get; } = new Dictionary<string, List<string>>
        {
            { "ppic", new List<string> { "ppic" } },
            { "warehouse", new List<string> { "warehouse", "warehouse staging" } },
            { "produksi", new List<string> { "penimbangan", "blending", "tipping", "ready for batching", "batching", 
                "discharging", "staging", "produksi", "ready for tipping", "filling"} }

        };

        public static class NextLocation
        {
            public static Dictionary<string, List<string>> ProcessingSequence { get; } = new Dictionary<string, List<string>>
            {
                { "minor", new List<string> {"ppic", "warehouse", "warehouse staging", "penimbangan", "ready for tipping", "tipping" } },

                { "ruah", new List<string> { "ppic", "warehouse", "ready for batching", "batching", "blending","staging", "discharging" } },

                { "kemas", new List<string> { "ppic", "produksi", "warehouse", "staging", "filling" } }
            };
        }

    }
  }

import React, { useContext } from "react";

// Dashboard Context
import { DashboardContext } from "@/app/context/dashboardContext";

const FilterCalender = () => {
  const { months, years, selectedMonth, selectedTargetYear, 
    setSelectedMonth, setSelectedTargetYear } = useContext(DashboardContext);

  return (
    <>
      <div>
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} 
        className="select select-bordered mr-2">
          {months.map((month, index) => (
            <option key={index} value={month}>
              {month}
            </option>
          ))}
        </select>
        <select value={selectedTargetYear} onChange={(e) => setSelectedTargetYear(e.target.value)}
        className="select select-bordered">
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default FilterCalender;

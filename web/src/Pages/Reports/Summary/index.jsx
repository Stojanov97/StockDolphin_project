import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { useDispatch, useSelector } from "react-redux";
import randomColor from "randomcolor";
import "./Summary.css";
import Select from "react-select";
import { sliceLoading } from "../../../Slices/LoadingSlice";
import { check } from "../../../Slices/CheckTokenSlice";
import { checkDB } from "../../../Slices/CheckForDBUpdatesSlice";

const ReportsSummary = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  let todayDate = new Date();
  let sevenDaysAgo = new Date(todayDate.getTime() - 7 * 24 * 60 * 60 * 1000);
  const categories = useSelector((state) => state.categories.value);
  const invoices = useSelector((state) => state.invoices.value);

  const categoryOptions = categories.map((cat) => {
    return { value: cat, label: cat.name };
  });

  const [selectedCategories, setSelectedCategories] = useState([]);
  let selectedCategoriesMapped = selectedCategories.map((cat) => cat.value);
  if (selectedCategoriesMapped.length === 0) {
    selectedCategoriesMapped = categories;
  }
  const [err, setErr] = useState(false);
  const [endDate, setEndDate] = useState(todayDate);
  const [startDate, setStartDate] = useState(sevenDaysAgo);
  const [timeSpan, setTimeSpan] = useState([]);

  Date.prototype.addDay = function (days) {
    let date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };

  useEffect(() => {
    if (startDate > endDate) {
      return setErr("Start date cannot be greater than end date");
    }
    setErr(false);
    let tempTimeSpan = [];
    let tempStartDate = startDate;
    while (tempStartDate <= endDate) {
      tempTimeSpan.push(new Date(tempStartDate));
      tempStartDate = tempStartDate.addDay(1);
    }
    setTimeSpan(tempTimeSpan);
  }, [endDate, startDate]);

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderRadius: "10px",
      outline: "none",
      cursor: "pointer",
      backgroundColor: "transparent",
      ":focus": {
        outline: "green",
        border: "none",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: "var(--background)",
      color: "var(--primary-text)",
      border: "none",
      outline: "none",
      cursor: "pointer",
    }),
    menu: (provided, state) => ({
      ...provided,
      maxHeight: "330px",
      overflow: "scroll",
      backgroundColor: "var(--background)",
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      height: "50px",
      maxWidth: "400px",
      display: "flex",
      flexDirection: "row",
      flexWrap: "nowrap",
      overflowX: "scroll",
      overflowY: "hidden",
    }),
    multiValue: (provided, state) => ({
      ...provided,
      flexShrink: "0",
      backgroundColor: "var(--primary-color)",
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: "var(--primary-text)",
    }),
    multiValueLabel: (provided, state) => ({
      ...provided,
      color: "var(--primary-text)",
    }),
  };
  console.log(selectedCategoriesMapped);
  return (
    <section>
      <div className="breadcrumb">
        <h1>
          <span
            onClick={() => {
              dispatch(sliceLoading(true))
              dispatch(check())
              dispatch(checkDB())
              navigate("/reports");
            }}
          >
            Reports
          </span>{" "}
          &gt;
          <span
            onClick={() => {
              dispatch(sliceLoading(true))
              dispatch(check())
              dispatch(checkDB())
            }}
          >
            {" "}
            Inventory Summary
          </span>
        </h1>
      </div>
      <hr />
      <div id="summary-workspace">
        <div id="graphControls">
          <input
            type="date"
            value={startDate.toISOString().split("T")[0]}
            onChange={(e) => {
              setStartDate(e.target.valueAsDate);
            }}
          />
          <input
            type="date"
            value={endDate.toISOString().split("T")[0]}
            onChange={(e) => {
              setEndDate(e.target.valueAsDate);
            }}
          />
          <Select
            placeholder="Select Categories"
            value={selectedCategories}
            options={categoryOptions}
            styles={customStyles}
            onChange={setSelectedCategories}
            isMulti
            closeMenuOnSelect={false}
          />
          <button
            className="interaction-btn"
            onClick={() => {
              setEndDate(todayDate);
              setStartDate(sevenDaysAgo);
              setSelectedCategories([]);
            }}
          >
            Reset
          </button>
          {err && <p className="error">{err}</p>}
        </div>
        <Line
          options={{
            plugins: { legend: { display: false } },
            elements: { line: { tension: 0.4 } },
          }}
          data={{
            labels: timeSpan.map((date) => {
              let day = new Date(date).getDay();
              return days[day];
            }),
            datasets: selectedCategoriesMapped.map((cat) => {
              let invoicesByCategory = invoices.filter((invoice) => {
                // console.log(new Date(invoice.date).toDateString());
                return invoice.category.id === cat._id;
              });
              // console.log(new Date(await invoicesByCategory[0].date));
              let test = [];
              timeSpan.forEach((date) => {
                let invoicesByDate = invoicesByCategory.filter(
                  (invoice) =>
                    new Date(invoice.date).toDateString() ===
                    date.toDateString()
                );
                if (invoicesByDate.length > 0) {
                  test.push(
                    invoicesByDate.reduce((acc, curr) => acc + curr.total, 0)
                  );
                } else {
                  test.push(0);
                }
              });
              return {
                label: cat.name,
                data: test,
                borderColor: randomColor({
                  hue: "green",
                  seed: cat.name,
                }),
              };
            }),
          }}
        />
      </div>
    </section>
  );
};

export default ReportsSummary;

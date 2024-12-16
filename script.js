const entCpAPI = "https://app.sheetlabs.com/K3N/pa_ent_cp";
const mmSmbAPI = "https://app.sheetlabs.com/K3N/pa_mm_smb";

// Function to set dynamic Month-Year Heading
function setDynamicHeading() {
  const currentDate = new Date();
  const monthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  document.getElementById("dynamic-heading").innerText = monthYear;
}

// Function to fetch and render data
async function fetchAndRenderData(apiURL, tableId, summaryIds) {
  const response = await fetch(apiURL);
  const data = await response.json();

  let totalAppts = 0, totalDue = 0, totalHeld = 0, totalOpp = 0, sdrCount = 0;

  // Separate 'Total' row and other SDRs
  const totalRow = data.find(row => row.SDR === "Total");
  const sdrRows = data.filter(row => row.SDR !== "Total");

  // Sort SDRs based on Held in descending order
  sdrRows.sort((a, b) => (b.Held || 0) - (a.Held || 0));

  const tableBody = document.getElementById(tableId);
  tableBody.innerHTML = "";

  // Render sorted SDR rows
  sdrRows.forEach(row => {
    const tr = document.createElement("tr");

    ["SDR", "Appts", "Due", "Held", "Opp"].forEach(key => {
      const td = document.createElement("td");
      td.innerText = row[key] || "-";
      tr.appendChild(td);
    });

    tableBody.appendChild(tr);

    // Accumulate totals for averages
    sdrCount++;
    totalAppts += row.Appts || 0;
    totalDue += row.Due || 0;
    totalHeld += row.Held || 0;
    totalOpp += row.Opp || 0;
  });

  // Render 'Total' row with the 'total-row' class
  const totalTr = document.createElement("tr");
  totalTr.classList.add("total-row");
  ["SDR", "Appts", "Due", "Held", "Opp"].forEach(key => {
    const td = document.createElement("td");
    td.innerText = totalRow[key] || "-";
    totalTr.appendChild(td);
  });
  tableBody.appendChild(totalTr);

  // Update summary boxes
  document.getElementById(summaryIds.avgAppts).innerText = (totalAppts / sdrCount).toFixed(2);
  document.getElementById(summaryIds.avgDue).innerText = (totalDue / sdrCount).toFixed(2);
  document.getElementById(summaryIds.avgHeld).innerText = (totalHeld / sdrCount).toFixed(2);
  document.getElementById(summaryIds.avgOpp).innerText = (totalOpp / sdrCount).toFixed(2);
}

// Initialize
setDynamicHeading();

fetchAndRenderData(entCpAPI, "ent-cp-table", {
  avgAppts: "ent-cp-avg-appts",
  avgDue: "ent-cp-avg-due",
  avgHeld: "ent-cp-avg-held",
  avgOpp: "ent-cp-avg-opp"
});

fetchAndRenderData(mmSmbAPI, "mm-smb-table", {
  avgAppts: "mm-smb-avg-appts",
  avgDue: "mm-smb-avg-due",
  avgHeld: "mm-smb-avg-held",
  avgOpp: "mm-smb-avg-opp"
});

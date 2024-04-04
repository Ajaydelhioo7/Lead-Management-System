import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

const LeadManager = () => {
  const [leads, setLeads] = useState(
    JSON.parse(localStorage.getItem("leads")) || []
  );
  const [newLead, setNewLead] = useState({
    name: "",
    number: "",
    email: "",
    status: "Pending",
  });
  const [currentFilter, setCurrentFilter] = useState("All");

  useEffect(() => {
    localStorage.setItem("leads", JSON.stringify(leads));
  }, [leads]);

  const addLead = () => {
    if (newLead.name && newLead.number && newLead.email) {
      setLeads([...leads, { ...newLead, id: Date.now() }]);
      setNewLead({ name: "", number: "", email: "", status: "Pending" });
    } else {
      alert("Please fill in all fields.");
    }
  };

  const updateLead = (id, field, value) => {
    setLeads(
      leads.map((lead) => (lead.id === id ? { ...lead, [field]: value } : lead))
    );
  };

  const deleteLead = (id) => {
    setLeads(leads.filter((lead) => lead.id !== id));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryString = event.target.result;
      const workbook = XLSX.read(binaryString, { type: "binary" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);

      const newLeads = json.map((item) => ({
        id: Date.now() + Math.random(),
        name: item.Name || "",
        number: item.Number || "",
        email: item.Email || "",
        status: item.Status || "Pending",
      }));

      setLeads((prevLeads) => [...prevLeads, ...newLeads]);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <h2>Lead Management</h2>
      <div>
        <input
          type="text"
          value={newLead.name}
          onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
          placeholder="Name"
        />
        <input
          type="text"
          value={newLead.number}
          onChange={(e) => setNewLead({ ...newLead, number: e.target.value })}
          placeholder="Number"
        />
        <input
          type="text"
          value={newLead.email}
          onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
          placeholder="Email"
        />
        <select
          value={newLead.status}
          onChange={(e) => setNewLead({ ...newLead, status: e.target.value })}
        >
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="In Progress">In Progress</option>
          <option value="Rejected">Rejected</option>
        </select>
        <button onClick={addLead}>Add New Lead</button>
      </div>
      <div>
        <input type="file" onChange={handleFileUpload} accept=".xlsx, .xls" />
        <select
          onChange={(e) => setCurrentFilter(e.target.value)}
          value={currentFilter}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="In Progress">In Progress</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>S/N</th>
            <th>Name</th>
            <th>Number</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads
            .filter(
              (lead) => currentFilter === "All" || lead.status === currentFilter
            )
            .map((lead, index) => (
              <tr key={lead.id}>
                <td>{index + 1}</td>
                <td>
                  <input
                    type="text"
                    value={lead.name}
                    onChange={(e) =>
                      updateLead(lead.id, "name", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={lead.number}
                    onChange={(e) =>
                      updateLead(lead.id, "number", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={lead.email}
                    onChange={(e) =>
                      updateLead(lead.id, "email", e.target.value)
                    }
                  />
                </td>
                <td>
                  <select
                    value={lead.status}
                    onChange={(e) =>
                      updateLead(lead.id, "status", e.target.value)
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => deleteLead(lead.id)}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadManager;

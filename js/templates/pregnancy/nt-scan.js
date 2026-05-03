export const ntScan = {
  id: "nt_scan",
  title: "NT Scan",
  category: "Pregnancy",
  sections: [
    {
      id: "pregnancy_status",
      title: "Pregnancy Status",
      fields: [
        { id: "number_of_fetuses", label: "Number of Fetuses", type: "dropdown", options: ["Single", "Twin", "Multiple"], required: true },
        { id: "fetal_viability", label: "Fetal Viability", type: "dropdown", options: ["Live", "Non-viable"], required: true },
        { id: "cardiac_activity", label: "Cardiac Activity", type: "dropdown", options: ["Present", "Absent"], required: true },
        { id: "fetal_movement", label: "Fetal Movement", type: "dropdown", options: ["Present", "Absent"] }
      ]
    },
    {
      id: "measurements",
      title: "Measurements",
      fields: [
        { id: "crl", label: "CRL", type: "measurement", unit: "mm", min: 45, max: 84, required: true },
        { id: "nt_measurement", label: "NT Measurement", type: "measurement", unit: "mm", min: 0, max: 10, required: true },
        { id: "fhr", label: "Fetal Heart Rate", type: "measurement", unit: "bpm", min: 60, max: 220 },
        { id: "gestational_age", label: "Gestational Age", type: "text", placeholder: "Auto-calculated" },
        { id: "edd", label: "EDD", type: "date" }
      ]
    },
    {
      id: "markers",
      title: "Nasal Bone & Markers",
      fields: [
        { id: "nasal_bone", label: "Nasal Bone", type: "dropdown", options: ["Present", "Absent", "Not Well Seen"], required: true },
        { id: "ductus_venosus", label: "Ductus Venosus", type: "dropdown", options: ["Normal", "Abnormal", "Not Assessed"] },
        { id: "tricuspid_flow", label: "Tricuspid Flow", type: "dropdown", options: ["Normal", "Regurgitation", "Not Assessed"] }
      ]
    },
    {
      id: "placenta_liquor",
      title: "Placenta & Liquor",
      fields: [
        { id: "placenta_position", label: "Placenta Position", type: "dropdown", options: ["Anterior", "Posterior", "Fundal", "Low-lying", "Previa"] },
        { id: "liquor", label: "Liquor", type: "dropdown", options: ["Adequate", "Reduced", "Increased"] }
      ]
    },
    {
      id: "cervix",
      title: "Cervix",
      fields: [
        { id: "cervical_length", label: "Cervical Length", type: "measurement", unit: "mm", min: 0 },
        { id: "cervix_status", label: "Cervix Status", type: "dropdown", options: ["Closed", "Open", "Funneling"] }
      ]
    },
    {
      id: "findings",
      title: "Additional Findings",
      fields: [
        { id: "findings", label: "Findings", type: "textarea" }
      ]
    }
  ]
};
export const datingScan = {
  id: "dating_scan",
  title: "Dating / Viability Scan",
  category: "Pregnancy",
  sections: [
    {
      id: "pregnancy_details",
      title: "Pregnancy Details",
      fields: [
        { id: "gestational_sac", label: "Gestational Sac", type: "dropdown", options: ["Seen", "Not Seen"], required: true },
        { id: "sac_location", label: "Sac Location", type: "dropdown", options: ["Intrauterine", "Extrauterine"] },
        { id: "yolk_sac", label: "Yolk Sac", type: "dropdown", options: ["Seen", "Not Seen"] },
        { id: "fetal_pole", label: "Fetal Pole", type: "dropdown", options: ["Seen", "Not Seen"], required: true },
        { id: "number_of_fetuses", label: "Number of Fetuses", type: "dropdown", options: ["Single", "Twin", "Multiple"], required: true },
        { id: "cardiac_activity", label: "Cardiac Activity", type: "dropdown", options: ["Present", "Absent"], required: true },
        { id: "fhr", label: "Fetal Heart Rate", type: "measurement", unit: "bpm", min: 60, max: 220 },
        { id: "fetal_movement", label: "Fetal Movement", type: "dropdown", options: ["Present", "Absent"] }
      ]
    },
    {
      id: "measurements",
      title: "Measurements",
      fields: [
        { id: "crl", label: "CRL", type: "measurement", unit: "mm", min: 0, max: 84, placeholder: "Crown-Rump Length" },
        { id: "msd", label: "MSD", type: "measurement", unit: "mm", placeholder: "Mean Sac Diameter" },
        { id: "gestational_age", label: "Gestational Age", type: "text", placeholder: "Auto-calculated or manual", help: "Auto-populated from CRL" },
        { id: "edd", label: "EDD", type: "date", help: "Estimated Due Date" }
      ]
    },
    {
      id: "uterus_cervix",
      title: "Uterus & Cervix",
      fields: [
        { id: "uterus", label: "Uterus", type: "dropdown", options: ["Normal", "Bulky", "Fibroid"] },
        { id: "cervix", label: "Cervix", type: "dropdown", options: ["Closed", "Open"] },
        { id: "cervical_length", label: "Cervical Length", type: "measurement", unit: "mm", min: 0 }
      ]
    },
    {
      id: "adnexa",
      title: "Adnexa",
      fields: [
        { id: "right_ovary", label: "Right Ovary", type: "dropdown", options: ["Normal", "Cyst", "Enlarged", "Not Visualized"] },
        { id: "left_ovary", label: "Left Ovary", type: "dropdown", options: ["Normal", "Cyst", "Enlarged", "Not Visualized"] },
        { id: "adnexal_mass", label: "Adnexal Mass", type: "dropdown", options: ["Present", "Absent"] },
        { id: "subchorionic_hematoma", label: "Subchorionic Hematoma", type: "dropdown", options: ["Present", "Absent"] }
      ]
    },
    {
      id: "findings",
      title: "Additional Findings",
      fields: [
        { id: "additional_findings", label: "Findings", type: "textarea" },
        { id: "free_fluid", label: "Free Fluid", type: "dropdown", options: ["Present", "Absent"] }
      ]
    }
  ]
};
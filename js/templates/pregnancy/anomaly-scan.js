export const anomalyScan = {
  id: "anomaly_scan",
  title: "Anomaly Scan (Level-II)",
  category: "Pregnancy",
  sections: [
    {
      id: "pregnancy_details",
      title: "Pregnancy Details",
      fields: [
        { id: "number_of_fetuses", label: "Number of Fetuses", type: "dropdown", options: ["Single", "Twin"], required: true },
        { id: "presentation", label: "Presentation", type: "dropdown", options: ["Cephalic", "Breech", "Transverse"] },
        { id: "cardiac_activity", label: "Cardiac Activity", type: "dropdown", options: ["Present", "Absent"], required: true },
        { id: "fetal_movement", label: "Fetal Movement", type: "dropdown", options: ["Present", "Absent"] }
      ]
    },
    {
      id: "biometry",
      title: "Fetal Biometry",
      fields: [
        { id: "bpd", label: "BPD", type: "measurement", unit: "mm", min: 20 },
        { id: "hc", label: "HC", type: "measurement", unit: "mm", min: 50 },
        { id: "ac", label: "AC", type: "measurement", unit: "mm", min: 50 },
        { id: "fl", label: "FL", type: "measurement", unit: "mm", min: 10 },
        { id: "efw", label: "Estimated Fetal Weight", type: "measurement", unit: "g", min: 100 },
        { id: "gestational_age", label: "Gestational Age", type: "text", placeholder: "Auto-calculated" }
      ]
    },
    {
      id: "head_brain",
      title: "Head & Brain",
      fields: [
        { id: "skull", label: "Skull", type: "dropdown", options: ["Normal", "Abnormal"] },
        { id: "ventricles", label: "Ventricles", type: "dropdown", options: ["Normal", "Dilated"] },
        { id: "cerebellum", label: "Cerebellum", type: "dropdown", options: ["Normal", "Abnormal"] },
        { id: "csp", label: "CSP (Cavum Septum Pellucidum)", type: "dropdown", options: ["Seen", "Not Seen"] }
      ]
    },
    {
      id: "face",
      title: "Face",
      fields: [
        { id: "orbits", label: "Orbits", type: "dropdown", options: ["Normal", "Abnormal"] },
        { id: "lips", label: "Lips", type: "dropdown", options: ["Intact", "Cleft Suspected"] },
        { id: "nasal_bone", label: "Nasal Bone", type: "dropdown", options: ["Present", "Absent"] }
      ]
    },
    {
      id: "heart",
      title: "Heart",
      fields: [
        { id: "four_chamber", label: "Four Chamber View", type: "dropdown", options: ["Normal", "Abnormal"] },
        { id: "cardiac_axis", label: "Cardiac Axis", type: "dropdown", options: ["Normal", "Abnormal"] },
        { id: "outflow_tracts", label: "Outflow Tracts", type: "dropdown", options: ["Normal", "Abnormal"] }
      ]
    },
    {
      id: "abdomen",
      title: "Abdomen",
      fields: [
        { id: "stomach", label: "Stomach", type: "dropdown", options: ["Seen", "Not Seen"] },
        { id: "kidneys", label: "Kidneys", type: "dropdown", options: ["Normal", "Abnormal"] },
        { id: "bladder", label: "Bladder", type: "dropdown", options: ["Seen", "Not Seen"] },
        { id: "abdominal_wall", label: "Abdominal Wall", type: "dropdown", options: ["Intact", "Abnormal"] }
      ]
    },
    {
      id: "spine_limbs",
      title: "Spine & Limbs",
      fields: [
        { id: "spine", label: "Spine", type: "dropdown", options: ["Normal", "Abnormal"] },
        { id: "upper_limbs", label: "Upper Limbs", type: "dropdown", options: ["Normal", "Abnormal"] },
        { id: "lower_limbs", label: "Lower Limbs", type: "dropdown", options: ["Normal", "Abnormal"] }
      ]
    },
    {
      id: "placenta_liquor",
      title: "Placenta & Liquor",
      fields: [
        { id: "placenta_position", label: "Placenta Position", type: "dropdown", options: ["Anterior", "Posterior", "Fundal", "Low-lying", "Previa"] },
        { id: "placenta_grade", label: "Placenta Grade", type: "dropdown", options: ["0", "I", "II", "III"] },
        { id: "afi", label: "AFI", type: "measurement", unit: "cm", min: 0 },
        { id: "liquor", label: "Liquor", type: "dropdown", options: ["Adequate", "Oligohydramnios", "Polyhydramnios"] }
      ]
    },
    {
      id: "cervix",
      title: "Cervix",
      fields: [
        { id: "cervical_length", label: "Cervical Length", type: "measurement", unit: "mm", min: 0 },
        { id: "cervix", label: "Cervix", type: "dropdown", options: ["Closed", "Open"] }
      ]
    },
    {
      id: "findings",
      title: "Additional Findings",
      fields: [
        { id: "doppler_findings", label: "Doppler Findings (if done)", type: "textarea" },
        { id: "additional_findings", label: "Additional Findings", type: "textarea" }
      ]
    }
  ]
};
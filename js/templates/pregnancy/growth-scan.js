export const growthScan = {
  id: "growth_scan",
  title: "Fetal Wellbeing / Growth Scan",
  category: "Pregnancy",
  sections: [
    {
      id: "pregnancy_status",
      title: "Pregnancy Status",
      fields: [
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
      id: "placenta_liquor",
      title: "Placenta & Liquor",
      fields: [
        { id: "placenta_position", label: "Placenta Position", type: "dropdown", options: ["Anterior", "Posterior", "Fundal", "Low-lying"] },
        { id: "placenta_grade", label: "Placenta Grade", type: "dropdown", options: ["0", "I", "II", "III"] },
        { id: "afi", label: "AFI", type: "measurement", unit: "cm", min: 0 },
        { id: "liquor", label: "Liquor", type: "dropdown", options: ["Adequate", "Oligohydramnios", "Polyhydramnios"] }
      ]
    },
    {
      id: "doppler",
      title: "Doppler",
      fields: [
        { id: "ua_doppler", label: "Umbilical Artery Doppler", type: "dropdown", options: ["Normal", "Abnormal", "Not Done"] },
        { id: "mca_doppler", label: "MCA Doppler", type: "dropdown", options: ["Normal", "Abnormal", "Not Done"] },
        { id: "cpr", label: "CPR (Cerebroplacental Ratio)", type: "number", placeholder: "ratio", min: 0 }
      ]
    },
    {
      id: "fetal_activity",
      title: "Fetal Activity",
      fields: [
        { id: "fetal_tone", label: "Fetal Tone", type: "dropdown", options: ["Present", "Absent"] },
        { id: "breathing_movement", label: "Breathing Movement", type: "dropdown", options: ["Present", "Absent"] }
      ]
    },
    {
      id: "findings",
      title: "Additional Findings",
      fields: [
        { id: "additional_findings", label: "Findings", type: "textarea" }
      ]
    }
  ]
};
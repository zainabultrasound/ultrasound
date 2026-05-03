export const dopplerObstetric = {
  id: "doppler_obstetric",
  title: "Obstetric Doppler",
  category: "Pregnancy",
  sections: [
    {
      id: "pregnancy_status",
      title: "Pregnancy Status",
      fields: [
        { id: "presentation", label: "Presentation", type: "dropdown", options: ["Cephalic", "Breech", "Transverse"] },
        { id: "cardiac_activity", label: "Cardiac Activity", type: "dropdown", options: ["Present", "Absent"], required: true },
        { id: "number_of_fetuses", label: "Number of Fetuses", type: "dropdown", options: ["Single", "Twin", "Multiple"] }
      ]
    },
    {
      id: "umbilical_artery",
      title: "Umbilical Artery",
      fields: [
        { id: "ua_psv", label: "PSV", type: "measurement", unit: "cm/s" },
        { id: "ua_edv", label: "EDV", type: "measurement", unit: "cm/s" },
        { id: "ua_ri", label: "RI (Resistance Index)", type: "number", placeholder: "0.0 - 1.0", min: 0, max: 1, step: "0.01" },
        { id: "ua_pi", label: "PI (Pulsatility Index)", type: "number", placeholder: "0.0 - 3.0", min: 0, max: 3, step: "0.01" },
        { id: "ua_sd", label: "S/D Ratio", type: "number", placeholder: "ratio", min: 0, step: "0.1" },
        { id: "ua_waveform", label: "Waveform", type: "dropdown", options: ["Normal", "Reduced Diastolic Flow", "Absent Diastolic Flow", "Reversed Diastolic Flow"] }
      ]
    },
    {
      id: "mca",
      title: "Middle Cerebral Artery (MCA)",
      fields: [
        { id: "mca_psv", label: "PSV", type: "measurement", unit: "cm/s" },
        { id: "mca_edv", label: "EDV", type: "measurement", unit: "cm/s" },
        { id: "mca_ri", label: "RI", type: "number", placeholder: "0.0 - 1.0", min: 0, max: 1, step: "0.01" },
        { id: "mca_pi", label: "PI", type: "number", placeholder: "0.0 - 3.0", min: 0, max: 3, step: "0.01" },
        { id: "cpr", label: "CPR", type: "number", placeholder: "MCA-PI / UA-PI", step: "0.01" }
      ]
    },
    {
      id: "ductus_venosus",
      title: "Ductus Venosus",
      fields: [
        { id: "dv_waveform", label: "Waveform", type: "dropdown", options: ["Normal", "Abnormal", "Reversed a-wave"] },
        { id: "dv_pi", label: "PI", type: "number", step: "0.01" }
      ]
    },
    {
      id: "uterine",
      title: "Uterine Arteries",
      fields: [
        { id: "ut_right_ri", label: "Right UtA RI", type: "number", step: "0.01", min: 0, max: 1 },
        { id: "ut_left_ri", label: "Left UtA RI", type: "number", step: "0.01", min: 0, max: 1 },
        { id: "ut_notch", label: "Notching", type: "dropdown", options: ["Absent", "Unilateral", "Bilateral"] }
      ]
    },
    {
      id: "findings",
      title: "Findings",
      fields: [
        { id: "doppler_findings", label: "Doppler Findings", type: "textarea" }
      ]
    }
  ]
};
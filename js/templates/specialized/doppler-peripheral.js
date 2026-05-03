export const dopplerPeripheral = {
  id: "doppler_peripheral",
  title: "Doppler (Peripheral Vascular)",
  category: "Specialized",
  sections: [
    {
      id: "study_type",
      title: "Study Type",
      fields: [
        { id: "doppler_type", label: "Doppler Type", type: "dropdown", options: ["Arterial", "Venous", "Carotid", "Portal"], required: true },
        { id: "vessel_name", label: "Target Vessel", type: "text", placeholder: "e.g. Right Femoral Artery" }
      ]
    },
    {
      id: "vessel_assessment",
      title: "Vessel Assessment",
      fields: [
        { id: "flow", label: "Flow", type: "dropdown", options: ["Normal", "Reduced", "Absent", "Turbulent"] },
        { id: "compressibility", label: "Compressibility", type: "dropdown", options: ["Normal", "Non-compressible"] },
        { id: "thrombus", label: "Thrombus", type: "dropdown", options: ["Present", "Absent"] }
      ]
    },
    {
      id: "waveform",
      title: "Waveform",
      fields: [
        { id: "waveform_pattern", label: "Waveform Pattern", type: "dropdown", options: ["Normal", "Dampened", "Monophasic", "Biphasic", "Triphasic"] },
        { id: "spectral_broadening", label: "Spectral Broadening", type: "dropdown", options: ["Present", "Absent"] }
      ]
    },
    {
      id: "velocity_measurements",
      title: "Velocity Measurements",
      fields: [
        { id: "psv", label: "PSV (Peak Systolic Velocity)", type: "measurement", unit: "cm/s", min: 0 },
        { id: "edv", label: "EDV (End Diastolic Velocity)", type: "measurement", unit: "cm/s", min: 0 },
        { id: "ri", label: "RI (Resistance Index)", type: "number", min: 0, max: 1, step: "0.01" },
        { id: "pi", label: "PI (Pulsatility Index)", type: "number", min: 0, step: "0.01" }
      ]
    },
    {
      id: "findings_doppler",
      title: "Findings",
      fields: [
        { id: "doppler_findings", label: "Doppler Findings", type: "textarea" }
      ]
    }
  ]
};
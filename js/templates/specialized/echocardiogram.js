export const echocardiogram = {
  id: "echocardiogram",
  title: "Echocardiogram",
  category: "Specialized",
  sections: [
    {
      id: "cardiac_chambers",
      title: "Cardiac Chambers",
      fields: [
        { id: "lv_size", label: "LV Size", type: "dropdown", options: ["Normal", "Enlarged", "Small"], required: true },
        { id: "rv_size", label: "RV Size", type: "dropdown", options: ["Normal", "Enlarged"] },
        { id: "la_size", label: "LA Size", type: "dropdown", options: ["Normal", "Enlarged"] },
        { id: "ra_size", label: "RA Size", type: "dropdown", options: ["Normal", "Enlarged"] }
      ]
    },
    {
      id: "wall_motion",
      title: "Wall Motion",
      fields: [
        { id: "lv_wall_motion", label: "LV Wall Motion", type: "dropdown", options: ["Normal", "Hypokinesia", "Akinesia", "Dyskinesia"] },
        { id: "global_function", label: "Global Function", type: "dropdown", options: ["Normal", "Reduced", "Severely Reduced"] }
      ]
    },
    {
      id: "ef",
      title: "Ejection Fraction",
      fields: [
        { id: "ef", label: "Ejection Fraction (EF)", type: "measurement", unit: "%", min: 10, max: 85 }
      ]
    },
    {
      id: "valves",
      title: "Valves",
      fields: [
        { id: "mitral_valve", label: "Mitral Valve", type: "dropdown", options: ["Normal", "Regurgitation (Mild)", "Regurgitation (Moderate)", "Regurgitation (Severe)", "Stenosis"] },
        { id: "aortic_valve", label: "Aortic Valve", type: "dropdown", options: ["Normal", "Regurgitation", "Stenosis", "Sclerosis"] },
        { id: "tricuspid_valve", label: "Tricuspid Valve", type: "dropdown", options: ["Normal", "Regurgitation"] },
        { id: "pulmonary_valve", label: "Pulmonary Valve", type: "dropdown", options: ["Normal", "Abnormal"] }
      ]
    },
    {
      id: "pericardium",
      title: "Pericardium",
      fields: [
        { id: "pericardial_effusion", label: "Pericardial Effusion", type: "dropdown", options: ["Present", "Absent"] }
      ]
    },
    {
      id: "doppler_cardiac",
      title: "Doppler / Flow",
      fields: [
        { id: "flow_patterns", label: "Flow Patterns", type: "textarea" }
      ]
    },
    {
      id: "conclusion_echo",
      title: "Conclusion",
      fields: [
        { id: "conclusion", label: "Conclusion", type: "textarea" }
      ]
    }
  ]
};
export const kub = {
  id: "kub",
  title: "KUB / Prostate (Point of Care)",
  category: "Abdomen & Pelvic",
  sections: [
    {
      id: "right_kidney",
      title: "Right Kidney",
      fields: [
        { id: "rk_size_length", label: "Size (Length)", type: "measurement", unit: "cm", min: 0, placeholder: "Length" },
        { id: "rk_size_width", label: "Size (Width)", type: "measurement", unit: "cm", min: 0, placeholder: "Width" },
        { id: "rk_cortex", label: "Cortex", type: "measurement", unit: "cm", min: 0 },
        { id: "rk_shape", label: "Shape", type: "dropdown", options: ["Normal", "Abnormal", "Not Visualized"] },
        { id: "rk_echotexture", label: "Echotexture", type: "dropdown", options: ["Normal", "Increased Echogenicity", "Decreased Echogenicity", "Abnormal"] },
        { id: "rk_capsule", label: "Capsule", type: "dropdown", options: ["Intact", "Irregular", "Breached"] },
        { id: "rk_corticomedullary", label: "Corticomedullary Demarcation", type: "dropdown", options: ["Maintained", "Lost", "Reduced"] },
        { id: "rk_calculus", label: "Calculus", type: "dropdown", options: ["Present", "Absent"] },
        { id: "rk_cyst", label: "Cyst", type: "dropdown", options: ["Present", "Absent"] },
        { id: "rk_hydronephrosis", label: "Hydronephrosis", type: "dropdown", options: ["Present", "Absent"] },
        { id: "rk_hydropelvic", label: "Hydropelvic", type: "dropdown", options: ["Present", "Absent"] },
        { id: "rk_hydroureter", label: "Hydroureter", type: "dropdown", options: ["Present", "Absent"] }
      ]
    },
    {
      id: "left_kidney",
      title: "Left Kidney",
      fields: [
        { id: "lk_size_length", label: "Size (Length)", type: "measurement", unit: "cm", min: 0, placeholder: "Length" },
        { id: "lk_size_width", label: "Size (Width)", type: "measurement", unit: "cm", min: 0, placeholder: "Width" },
        { id: "lk_cortex", label: "Cortex", type: "measurement", unit: "cm", min: 0 },
        { id: "lk_shape", label: "Shape", type: "dropdown", options: ["Normal", "Abnormal", "Not Visualized"] },
        { id: "lk_echotexture", label: "Echotexture", type: "dropdown", options: ["Normal", "Increased Echogenicity", "Decreased Echogenicity", "Abnormal"] },
        { id: "lk_capsule", label: "Capsule", type: "dropdown", options: ["Intact", "Irregular", "Breached"] },
        { id: "lk_corticomedullary", label: "Corticomedullary Demarcation", type: "dropdown", options: ["Maintained", "Lost", "Reduced"] },
        { id: "lk_calculus", label: "Calculus", type: "dropdown", options: ["Present", "Absent"] },
        { id: "lk_cyst", label: "Cyst", type: "dropdown", options: ["Present", "Absent"] },
        { id: "lk_hydronephrosis", label: "Hydronephrosis", type: "dropdown", options: ["Present", "Absent"] },
        { id: "lk_hydropelvic", label: "Hydropelvic", type: "dropdown", options: ["Present", "Absent"] },
        { id: "lk_hydroureter", label: "Hydroureter", type: "dropdown", options: ["Present", "Absent"] }
      ]
    },
    {
      id: "urinary_bladder",
      title: "Urinary Bladder",
      fields: [
        {
          id: "bladder_state",
          label: "Bladder State",
          type: "radio",
          options: ["Filled", "Partially Filled", "Empty"],
          required: true
        },
        { id: "wall_thickness", label: "Wall Thickness", type: "measurement", unit: "mm", min: 0 },
        { id: "pre_void_volume", label: "Pre Void Volume", type: "measurement", unit: "ml", min: 0 },
        { id: "pmrv", label: "PMRV", type: "measurement", unit: "ml", min: 0 }
      ]
    },
    {
      id: "prostate",
      title: "Prostate",
      fields: [
        { id: "prostate_volume", label: "Volume", type: "measurement", unit: "g", min: 0 }
      ]
    },
    {
      id: "additional_findings",
      title: "Additional Findings",
      fields: [
        { id: "inguinal_lymph_nodes", label: "Inguinal Lymph Nodes", type: "dropdown", options: ["Present", "Absent"] },
        { id: "femoral_lymph_nodes", label: "Femoral Lymph Nodes", type: "dropdown", options: ["Present", "Absent"] },
        { id: "pelvic_free_fluid", label: "Pelvic Free Fluid", type: "dropdown", options: ["Present", "Absent"] }
      ]
    }
  ]
};
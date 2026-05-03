export const kub = {
  id: "kub",
  title: "KUB (Kidney-Ureter-Bladder)",
  category: "Abdomen & Pelvic",
  sections: [
    {
      id: "kidneys",
      title: "Kidneys",
      fields: [
        { id: "right_kidney", label: "Right Kidney", type: "dropdown", options: ["Normal", "Stone", "Hydronephrosis", "Cyst", "Atrophic"], required: true },
        { id: "left_kidney", label: "Left Kidney", type: "dropdown", options: ["Normal", "Stone", "Hydronephrosis", "Cyst", "Atrophic"], required: true },
        { id: "stone_size_right", label: "Stone Size (Right)", type: "measurement", unit: "mm", min: 0 },
        { id: "stone_size_left", label: "Stone Size (Left)", type: "measurement", unit: "mm", min: 0 },
        { id: "stone_location_right", label: "Stone Location (Right)", type: "text", placeholder: "e.g. upper pole" },
        { id: "stone_location_left", label: "Stone Location (Left)", type: "text", placeholder: "e.g. mid calyx" }
      ]
    },
    {
      id: "ureters",
      title: "Ureters",
      fields: [
        { id: "ureter_dilatation", label: "Ureter Dilatation", type: "dropdown", options: ["Present", "Absent"] },
        { id: "obstruction", label: "Obstruction", type: "dropdown", options: ["Present", "Absent"] }
      ]
    },
    {
      id: "bladder",
      title: "Urinary Bladder",
      fields: [
        { id: "bladder_wall", label: "Bladder Wall", type: "dropdown", options: ["Normal", "Thickened"] },
        { id: "calculi", label: "Calculi", type: "dropdown", options: ["Present", "Absent"] },
        { id: "pre_void_volume", label: "Pre-void Volume", type: "measurement", unit: "ml", min: 0 },
        { id: "post_void_residual", label: "Post-void Residual", type: "measurement", unit: "ml", min: 0 }
      ]
    },
    {
      id: "prostate",
      title: "Prostate (if male)",
      fields: [
        { id: "prostate_size", label: "Prostate Size", type: "dropdown", options: ["Normal", "Enlarged"] },
        { id: "prostate_volume", label: "Volume", type: "measurement", unit: "cc", min: 0 }
      ]
    },
    {
      id: "findings",
      title: "Findings",
      fields: [
        { id: "findings", label: "Additional Findings", type: "textarea" }
      ]
    }
  ]
};
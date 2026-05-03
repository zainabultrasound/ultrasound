export const breast = {
  id: "breast",
  title: "Breast Ultrasound",
  category: "Specialized",
  sections: [
    {
      id: "breast_info",
      title: "Breast Information",
      fields: [
        { id: "examined_side", label: "Examined Side", type: "dropdown", options: ["Left", "Right", "Both"], required: true },
        { id: "tissue_pattern", label: "Tissue Pattern", type: "dropdown", options: ["Normal", "Fibroglandular", "Dense", "Fatty"] }
      ]
    },
    {
      id: "lesion_detection",
      title: "Lesion Detection",
      fields: [
        { id: "lesion_present", label: "Lesion Present", type: "dropdown", options: ["Yes", "No"] }
      ]
    },
    {
      id: "lesion_details",
      title: "Lesion Details",
      repeatable: true,
      groupLabel: "Lesion",
      fields: [
        { id: "location", label: "Location (Quadrant)", type: "text", placeholder: "e.g. Upper Outer Quadrant" },
        { id: "size", label: "Size", type: "measurement", unit: "mm", min: 0 },
        { id: "shape", label: "Shape", type: "dropdown", options: ["Oval", "Round", "Irregular"] },
        { id: "margins", label: "Margins", type: "dropdown", options: ["Well-defined", "Ill-defined", "Spiculated", "Microlobulated"] },
        { id: "echo_pattern", label: "Echo Pattern", type: "dropdown", options: ["Anechoic", "Hypoechoic", "Hyperechoic", "Complex", "Isoechoic"] },
        { id: "calcifications", label: "Calcifications", type: "dropdown", options: ["Present", "Absent"] },
        { id: "posterior_features", label: "Posterior Features", type: "dropdown", options: ["None", "Enhancement", "Shadowing", "Mixed"] },
        { id: "birads", label: "BIRADS Score", type: "dropdown", options: ["0", "1", "2", "3", "4A", "4B", "4C", "5", "6"] }
      ]
    },
    {
      id: "lymph_nodes_breast",
      title: "Lymph Nodes",
      fields: [
        { id: "axillary_nodes", label: "Axillary Lymph Nodes", type: "dropdown", options: ["Normal", "Enlarged", "Pathological"] }
      ]
    },
    {
      id: "findings_breast",
      title: "Findings",
      fields: [
        { id: "impression", label: "Impression", type: "textarea" }
      ]
    }
  ]
};
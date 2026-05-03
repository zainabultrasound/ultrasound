export const thyroidNeck = {
  id: "thyroid_neck",
  title: "Thyroid & Neck Ultrasound",
  category: "Specialized",
  sections: [
    {
      id: "thyroid_gland",
      title: "Thyroid Gland",
      fields: [
        { id: "thyroid_size", label: "Thyroid Size", type: "dropdown", options: ["Normal", "Enlarged", "Small"], required: true },
        { id: "echotexture", label: "Echotexture", type: "dropdown", options: ["Normal", "Heterogeneous", "Diffusely Abnormal"] },
        { id: "vascularity", label: "Vascularity", type: "dropdown", options: ["Normal", "Increased", "Decreased"] }
      ]
    },
    {
      id: "nodules",
      title: "Nodules",
      fields: [
        { id: "nodule_present", label: "Nodule Present", type: "dropdown", options: ["Yes", "No"] },
        { id: "number_of_nodules", label: "Number of Nodules", type: "number", min: 0, showIf: { field: "nodule_present", equals: "Yes" } },
        { id: "dominant_nodule_size", label: "Dominant Nodule Size", type: "measurement", unit: "mm", min: 0, showIf: { field: "nodule_present", equals: "Yes" } },
        { id: "nodule_location", label: "Location", type: "text", placeholder: "e.g. Right lobe mid pole", showIf: { field: "nodule_present", equals: "Yes" } },
        { id: "nodule_composition", label: "Composition", type: "dropdown", options: ["Solid", "Cystic", "Mixed", "Spongiform"], showIf: { field: "nodule_present", equals: "Yes" } },
        { id: "nodule_margins", label: "Margins", type: "dropdown", options: ["Regular", "Irregular", "Lobulated"], showIf: { field: "nodule_present", equals: "Yes" } },
        { id: "calcifications", label: "Calcifications", type: "dropdown", options: ["Absent", "Microcalcifications", "Macrocalcifications", "Rim Calcification"], showIf: { field: "nodule_present", equals: "Yes" } },
        { id: "tirads_score", label: "TIRADS Score", type: "dropdown", options: ["1", "2", "3", "4", "5"], showIf: { field: "nodule_present", equals: "Yes" } }
      ]
    },
    {
      id: "lymph_nodes",
      title: "Lymph Nodes",
      fields: [
        { id: "cervical_nodes", label: "Cervical Lymph Nodes", type: "dropdown", options: ["Normal", "Enlarged", "Pathological"] }
      ]
    },
    {
      id: "findings_thyroid",
      title: "Findings",
      fields: [
        { id: "findings", label: "Impression", type: "textarea" }
      ]
    }
  ]
};
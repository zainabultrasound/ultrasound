export const trus = {
  id: "trus",
  title: "Transrectal Ultrasound (TRUS)",
  category: "Abdomen & Pelvic",
  sections: [
    {
      id: "prostate",
      title: "Prostate",
      fields: [
        { id: "prostate_size", label: "Prostate Size", type: "dropdown", options: ["Normal", "Enlarged"], required: true },
        { id: "prostate_volume", label: "Volume", type: "measurement", unit: "cc", min: 0 },
        { id: "capsule", label: "Capsule", type: "dropdown", options: ["Intact", "Irregular", "Breached"] },
        { id: "echotexture", label: "Echotexture", type: "dropdown", options: ["Normal", "Heterogeneous", "Calcified"] }
      ]
    },
    {
      id: "seminal_vesicles",
      title: "Seminal Vesicles",
      fields: [
        { id: "right_sv", label: "Right Seminal Vesicle", type: "dropdown", options: ["Normal", "Enlarged", "Cystic"] },
        { id: "left_sv", label: "Left Seminal Vesicle", type: "dropdown", options: ["Normal", "Enlarged", "Cystic"] }
      ]
    },
    {
      id: "lesions",
      title: "Focal Lesions",
      fields: [
        { id: "focal_lesion", label: "Focal Lesion", type: "dropdown", options: ["Present", "Absent"] },
        { id: "lesion_location", label: "Location", type: "text", showIf: { field: "focal_lesion", equals: "Present" } },
        { id: "lesion_size", label: "Size", type: "measurement", unit: "mm", min: 0, showIf: { field: "focal_lesion", equals: "Present" } }
      ]
    },
    {
      id: "findings_trus",
      title: "Findings",
      fields: [
        { id: "findings", label: "Impression", type: "textarea" }
      ]
    }
  ]
};
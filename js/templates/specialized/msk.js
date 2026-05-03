export const msk = {
  id: "msk",
  title: "Musculoskeletal Ultrasound (MSK)",
  category: "Specialized",
  sections: [
    {
      id: "area_examined",
      title: "Area Examined",
      fields: [
        { id: "region", label: "Region", type: "text", placeholder: "e.g. Right Shoulder, Left Knee", required: true },
        { id: "side", label: "Side", type: "dropdown", options: ["Left", "Right", "Bilateral"] }
      ]
    },
    {
      id: "muscle_tendon",
      title: "Muscle / Tendon Status",
      fields: [
        { id: "muscle_integrity", label: "Muscle Integrity", type: "dropdown", options: ["Normal", "Tear (Partial)", "Tear (Complete)", "Strain", "Atrophy"] },
        { id: "tendon_integrity", label: "Tendon Integrity", type: "dropdown", options: ["Normal", "Partial Tear", "Complete Tear", "Tendinosis", "Tendinitis"] },
        { id: "edema", label: "Edema", type: "dropdown", options: ["Present", "Absent"] }
      ]
    },
    {
      id: "fluid_collection",
      title: "Fluid Collection",
      fields: [
        { id: "hematoma", label: "Hematoma", type: "dropdown", options: ["Present", "Absent"] },
        { id: "collection_size", label: "Collection Size", type: "measurement", unit: "mm", min: 0, showIf: { field: "hematoma", equals: "Present" } }
      ]
    },
    {
      id: "joint_space",
      title: "Joint Space",
      fields: [
        { id: "joint_effusion", label: "Joint Effusion", type: "dropdown", options: ["Present", "Absent"] },
        { id: "synovial_thickening", label: "Synovial Thickening", type: "dropdown", options: ["Present", "Absent"] }
      ]
    },
    {
      id: "findings_msk",
      title: "Findings",
      fields: [
        { id: "findings", label: "Impression & Findings", type: "textarea" }
      ]
    }
  ]
};
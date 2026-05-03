export const scrotal = {
  id: "scrotal",
  title: "Scrotal / Testis Ultrasound",
  category: "Specialized",
  sections: [
    {
      id: "testes",
      title: "Testes",
      fields: [
        { id: "right_testis", label: "Right Testis", type: "dropdown", options: ["Normal", "Enlarged", "Atrophic", "Mass"], required: true },
        { id: "left_testis", label: "Left Testis", type: "dropdown", options: ["Normal", "Enlarged", "Atrophic", "Mass"], required: true },
        { id: "echotexture", label: "Echotexture", type: "dropdown", options: ["Normal", "Heterogeneous", "Diffusely Abnormal"] }
      ]
    },
    {
      id: "epididymis",
      title: "Epididymis",
      fields: [
        { id: "epididymis", label: "Epididymis", type: "dropdown", options: ["Normal", "Enlarged", "Inflamed", "Cystic"] }
      ]
    },
    {
      id: "fluid",
      title: "Fluid",
      fields: [
        { id: "hydrocele", label: "Hydrocele", type: "dropdown", options: ["Present", "Absent"] },
        { id: "fluid_volume", label: "Fluid Volume", type: "dropdown", options: ["Minimal", "Moderate", "Large"], showIf: { field: "hydrocele", equals: "Present" } }
      ]
    },
    {
      id: "varicocele",
      title: "Varicocele",
      fields: [
        { id: "varicocele", label: "Varicocele", type: "dropdown", options: ["Present", "Absent"] },
        { id: "varicocele_side", label: "Side", type: "dropdown", options: ["Left", "Right", "Bilateral"], showIf: { field: "varicocele", equals: "Present" } },
        { id: "varicocele_grade", label: "Grade", type: "dropdown", options: ["I (Mild)", "II (Moderate)", "III (Severe)"], showIf: { field: "varicocele", equals: "Present" } }
      ]
    },
    {
      id: "vascular",
      title: "Vascular",
      fields: [
        { id: "blood_flow", label: "Blood Flow", type: "dropdown", options: ["Normal", "Increased (Hyperemia)", "Reduced", "Absent"] }
      ]
    },
    {
      id: "findings_scrotal",
      title: "Findings",
      fields: [
        { id: "conclusion", label: "Conclusion", type: "textarea" }
      ]
    }
  ]
};
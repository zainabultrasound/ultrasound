export const tvs = {
  id: "tvs",
  title: "Transvaginal Ultrasound (TVS)",
  category: "Abdomen & Pelvic",
  sections: [
    {
      id: "uterus_tvs",
      title: "Uterus",
      fields: [
        { id: "uterus_size", label: "Uterus Size", type: "dropdown", options: ["Normal", "Enlarged", "Bulky"] },
        { id: "position", label: "Position", type: "dropdown", options: ["Anteverted", "Retroverted"] },
        { id: "myometrium", label: "Myometrium", type: "dropdown", options: ["Normal", "Fibroid", "Adenomyosis"] }
      ]
    },
    {
      id: "endometrium_tvs",
      title: "Endometrium",
      fields: [
        { id: "endometrial_thickness", label: "Endometrial Thickness", type: "measurement", unit: "mm", min: 0, required: true },
        { id: "endometrial_pattern", label: "Endometrial Pattern", type: "dropdown", options: ["Normal", "Thickened", "Irregular", "Fluid in Cavity"] }
      ]
    },
    {
      id: "ovaries_tvs",
      title: "Ovaries",
      fields: [
        { id: "right_ovary", label: "Right Ovary", type: "dropdown", options: ["Normal", "Cyst", "Enlarged", "Not Visualized"] },
        { id: "left_ovary", label: "Left Ovary", type: "dropdown", options: ["Normal", "Cyst", "Enlarged", "Not Visualized"] },
        { id: "right_ovarian_volume", label: "Right Ovarian Volume", type: "measurement", unit: "cc", min: 0 },
        { id: "left_ovarian_volume", label: "Left Ovarian Volume", type: "measurement", unit: "cc", min: 0 },
        { id: "follicle_count_right", label: "AFC (Right)", type: "number", min: 0 },
        { id: "follicle_count_left", label: "AFC (Left)", type: "number", min: 0 }
      ]
    },
    {
      id: "pouch_of_douglas",
      title: "Pouch of Douglas",
      fields: [
        { id: "pod_free_fluid", label: "Free Fluid in POD", type: "dropdown", options: ["Present", "Absent"] },
        { id: "pod_mass", label: "Mass in POD", type: "dropdown", options: ["Present", "Absent"] }
      ]
    },
    {
      id: "findings_tvs",
      title: "Findings",
      fields: [
        { id: "findings", label: "Impression", type: "textarea" }
      ]
    }
  ]
};
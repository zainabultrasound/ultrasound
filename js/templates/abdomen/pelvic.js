export const pelvic = {
  id: "pelvic",
  title: "Pelvic Ultrasound",
  category: "Abdomen & Pelvic",
  sections: [
    {
      id: "uterus",
      title: "Uterus",
      fields: [
        { id: "uterus_size", label: "Uterus Size", type: "dropdown", options: ["Normal", "Enlarged", "Bulky", "Small"] },
        { id: "position", label: "Position", type: "dropdown", options: ["Anteverted", "Retroverted", "Mid-position"] },
        { id: "myometrium", label: "Myometrium", type: "dropdown", options: ["Normal", "Fibroid", "Adenomyosis"] },
        { id: "fibroid_detail", label: "Fibroid Details (if present)", type: "textarea" }
      ]
    },
    {
      id: "endometrium",
      title: "Endometrium",
      fields: [
        { id: "endometrial_thickness", label: "Endometrial Thickness", type: "measurement", unit: "mm", min: 0 },
        { id: "endometrium", label: "Endometrium", type: "dropdown", options: ["Normal", "Thickened", "Atrophic", "Irregular"] }
      ]
    },
    {
      id: "ovaries",
      title: "Ovaries",
      fields: [
        { id: "right_ovary", label: "Right Ovary", type: "dropdown", options: ["Normal", "Cyst", "Enlarged", "Not Visualized"] },
        { id: "left_ovary", label: "Left Ovary", type: "dropdown", options: ["Normal", "Cyst", "Enlarged", "Not Visualized"] },
        { id: "follicles", label: "Follicles", type: "dropdown", options: ["Normal", "Multiple", "Polycystic Pattern"] }
      ]
    },
    {
      id: "adnexa_fluid",
      title: "Adnexa & Free Fluid",
      fields: [
        { id: "adnexal_mass", label: "Adnexal Mass", type: "dropdown", options: ["Present", "Absent"] },
        { id: "free_fluid", label: "Free Fluid", type: "dropdown", options: ["Present", "Absent"] }
      ]
    },
    {
      id: "findings",
      title: "Findings",
      fields: [
        { id: "findings", label: "Impression", type: "textarea" }
      ]
    }
  ]
};
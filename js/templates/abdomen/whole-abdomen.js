export const wholeAbdomen = {
  id: "whole_abdomen",
  title: "Whole Abdomen Ultrasound",
  category: "Abdomen & Pelvic",
  sections: [
    {
      id: "liver",
      title: "Liver",
      fields: [
        { id: "liver_size", label: "Liver Size", type: "dropdown", options: ["Normal", "Enlarged", "Small"] },
        { id: "echotexture", label: "Echotexture", type: "dropdown", options: ["Normal", "Coarse", "Fatty", "Cirrhotic"] },
        { id: "focal_lesion", label: "Focal Lesion", type: "dropdown", options: ["Present", "Absent"] },
        { id: "ihbd", label: "Intrahepatic Bile Ducts", type: "dropdown", options: ["Normal", "Dilated"] },
        { id: "liver_lesion_detail", label: "Lesion Details (if present)", type: "textarea" }
      ]
    },
    {
      id: "gallbladder",
      title: "Gallbladder",
      fields: [
        { id: "gb_wall", label: "Gallbladder Wall", type: "dropdown", options: ["Normal", "Thickened"] },
        { id: "stones", label: "Stones", type: "dropdown", options: ["Present", "Absent"] },
        { id: "sludge", label: "Sludge", type: "dropdown", options: ["Present", "Absent"] },
        { id: "gb_distended", label: "Distended", type: "dropdown", options: ["Yes", "No"] }
      ]
    },
    {
      id: "pancreas",
      title: "Pancreas",
      fields: [
        { id: "pancreas", label: "Pancreas", type: "dropdown", options: ["Normal", "Enlarged", "Not Well Seen", "Atrophic"] },
        { id: "pancreatic_mass", label: "Mass", type: "dropdown", options: ["Present", "Absent"] }
      ]
    },
    {
      id: "spleen",
      title: "Spleen",
      fields: [
        { id: "spleen_size", label: "Spleen Size", type: "dropdown", options: ["Normal", "Enlarged"] },
        { id: "spleen_echotexture", label: "Echotexture", type: "dropdown", options: ["Normal", "Abnormal"] }
      ]
    },
    {
      id: "kidneys",
      title: "Kidneys",
      fields: [
        { id: "right_kidney", label: "Right Kidney", type: "dropdown", options: ["Normal", "Stone", "Hydronephrosis", "Cyst", "Mass"] },
        { id: "left_kidney", label: "Left Kidney", type: "dropdown", options: ["Normal", "Stone", "Hydronephrosis", "Cyst", "Mass"] },
        { id: "cmd", label: "Corticomedullary Differentiation", type: "dropdown", options: ["Maintained", "Lost"] }
      ]
    },
    {
      id: "urinary_bladder",
      title: "Urinary Bladder",
      fields: [
        { id: "bladder_wall", label: "Bladder Wall", type: "dropdown", options: ["Normal", "Thickened"] },
        { id: "bladder_stones", label: "Stones", type: "dropdown", options: ["Present", "Absent"] },
        { id: "residual_urine", label: "Residual Urine", type: "measurement", unit: "ml", min: 0 }
      ]
    },
    {
      id: "ascites_findings",
      title: "Ascites & Findings",
      fields: [
        { id: "free_fluid", label: "Free Fluid / Ascites", type: "dropdown", options: ["Present", "Absent"] },
        { id: "fluid_amount", label: "Amount", type: "dropdown", options: ["Mild", "Moderate", "Gross"], showIf: { field: "free_fluid", equals: "Present" } },
        { id: "findings", label: "Additional Findings", type: "textarea" }
      ]
    }
  ]
};
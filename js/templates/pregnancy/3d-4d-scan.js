export const threeDFourDScan = {
  id: "threed_fourd_scan",
  title: "3D / 4D Ultrasound",
  category: "Pregnancy",
  sections: [
    {
      id: "fetal_visualization",
      title: "Fetal Visualization",
      fields: [
        { id: "fetal_face_visible", label: "Fetal Face Visible", type: "dropdown", options: ["Yes", "No", "Partially"] },
        { id: "fetal_movements", label: "Fetal Movements", type: "dropdown", options: ["Active", "Reduced", "None Seen"] }
      ]
    },
    {
      id: "view_quality",
      title: "View Quality",
      fields: [
        { id: "facial_profile", label: "Facial Profile", type: "dropdown", options: ["Clear", "Not Clear", "Not Assessable"] },
        { id: "limb_movements", label: "Limb Movements", type: "dropdown", options: ["Normal", "Reduced"] }
      ]
    },
    {
      id: "placenta_liquor",
      title: "Placenta & Liquor",
      fields: [
        { id: "placenta_position", label: "Placenta Position", type: "dropdown", options: ["Anterior", "Posterior", "Fundal", "Low-lying"] },
        { id: "liquor_volume", label: "Liquor Volume", type: "dropdown", options: ["Adequate", "Reduced", "Increased"] }
      ]
    },
    {
      id: "observations",
      title: "3D/4D Observations",
      fields: [
        { id: "observations", label: "Observations", type: "textarea" }
      ]
    },
    {
      id: "impression_section",
      title: "Impression",
      fields: [
        { id: "impression_3d", label: "Impression", type: "textarea" }
      ]
    }
  ]
};
import React from "react";
import { Outlet } from "react-router-dom";
import VisionExam from "./Vision";
import ColorVisionExam from "./ColorVision";
import ENTExam from "./ENT";
import MedicalExaminationExam from "./MedicalExamination";
import OtherExam from "./other";

export function Exam() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

const examRoutes = [
  {
    path: "vision/:clientId",
    element: <VisionExam />
  },
  {
    path: "color-vision",
    element: <ColorVisionExam />
  },
  {
    path: "ent",
    element: <ENTExam />
  },
  {
    path: "medical-examination",
    element: <MedicalExaminationExam />
  },
  {
    path: "other",
    element: <OtherExam />
  },
];

export default examRoutes;

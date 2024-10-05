import { Outlet } from "react-router-dom";
import UrineTest from "./Urine";
import StoolTest from "./Stool";
import BloodGroupTest from "./BloodGroup";
import CBCTest from "./CBC";
import BiochemistryTest from "./Biochemistry";
import SerologyTest from "./Serology";
import OtherTest from "./Other";
import React from "react";

export function Lab() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

const labRoutes = [
    {
      path: "urine",
      element: <UrineTest />
    },
    {
      path: "stool",
      element: <StoolTest />
    },
    {
      path: "blood-group",
      element: <BloodGroupTest />
    },
    {
      path: "cbc",
      element: <CBCTest />
    },
    {
      path: "biochemistry",
      element: <BiochemistryTest />
    },
    {
      path: "serology",
      element: <SerologyTest />
    },
    {
      path: "other",
      element: <OtherTest />
    }
  ];

export default labRoutes
import Base from "./base";

export default function MedicalExaminationExam() {
  return (
    <Base
      categoryName={"Medical Examination"}
      inputs={[
        "Height",
        "Weight",
        "Blood Pressure",
        "Pulse",
        "Respiratory Rate",
        "Heart",
        "Lungs",
        "Abdomen",
        "Hernia",
        "Varicose Veins",
        "Limbs",
        "Skin",
        "Leprosy",
      ]}
      onSubmit={function (values) {
        console.log(values);
      }}
    />
  );
}

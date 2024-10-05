import Base from "./base";

export default function ColorVisionExam() {
  return (
    <Base
      categoryName={"Color Vision Exam"}
      inputs={["Right Eye", "Left Eye"]}
      onSubmit={function (values) {
        console.log(values);
      }}
    />
  );
}

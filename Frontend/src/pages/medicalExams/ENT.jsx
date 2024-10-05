import Base from "./base";

export default function ENTExam() {
  return (
    <Base
      categoryName={"ENT Exam"}
      inputs={["Right Ear", "Left Ear"]}
      onSubmit={function (values) {
        console.log(values);
      }}
    />
  );
}

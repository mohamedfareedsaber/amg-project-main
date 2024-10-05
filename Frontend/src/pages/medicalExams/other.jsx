import Base from "./base";

export default function OtherExam() {
  return (
    <Base
      categoryName={"Other"}
      inputs={["Venereal Diseases", "Other"]}
      onSubmit={function (values) {
        console.log(values);
      }}
    />
  );
}

import Base from "./base";

export default function BiochemistryTest() {
  return (
    <Base
      categoryName={"Biochemistry"}
      inputs={["Random Blood Sugar", "Urea", "Creatine", "SGPT", "SGOT"]}
      onSubmit={function (values) {
        console.log(values);
      }}
    />
  );
}

import Base from "./base";

export default function SerologyTest() {
  return (
    <Base
      categoryName={"Serology"}
      inputs={[
        "HIV",
        "HAV",
        "HBV",
        "HCV",
        "HEV",
        "VDRL",
        "TPHA if VDRL Positive",
        "Tuberculin Test",
      ]}
      onSubmit={function (values) {
        console.log(values);
      }}
    />
  );
}

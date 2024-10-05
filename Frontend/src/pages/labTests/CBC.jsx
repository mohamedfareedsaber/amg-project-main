import Base from "./base";

export default function CBCTest() {
  return (
    <Base
      categoryName={"CBC"}
      inputs={["Hb", "WBCs", "RBCs", "PLT"]}
      onSubmit={function (values) {
        console.log(values);
      }}
    />
  );
}

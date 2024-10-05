import Base from "./base";

export default function UrineTest() {
  return (
    <Base
      categoryName={"urine"}
      inputs={["sugar", "albumin", "bilharzia"]}
      onSubmit={function (values) {
        console.log(values);
      }}
    />
  );
}

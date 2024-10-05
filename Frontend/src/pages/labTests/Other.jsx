import Base from "./base";

export default function OtherTest() {
  return (
    <Base
      categoryName={"Other"}
      inputs={[
        "Microfilaria",
        "Malaria",
        "Pregnancy Test",
        "Chest X-ray",
      ]}
      onSubmit={function (values) {
        console.log(values);
      }}
    />
  );
}

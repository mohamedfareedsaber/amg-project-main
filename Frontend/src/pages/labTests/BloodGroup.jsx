import Base from "./base";

export default function BloodGroupTest() {
  return (
    <Base
      categoryName={"Blood Group"}
      inputs={["Blood Group"]}
      onSubmit={function (values) {
        console.log(values);
      }}
    />
  );
}

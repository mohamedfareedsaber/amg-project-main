import Base from "./base";

export default function StoolTest() {
  return (
    <Base
      categoryName={"stool"}
      inputs={["parasites", "Salmonella - Shigella", "cholera"]}
      onSubmit={function (values) {
        console.log(values);
      }}
    />
  );
}

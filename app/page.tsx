import Editor from "@/ui/editor";
import Menu from "./menu";
import Nav from "./navigation";

export default function Page() {
  return (
    <>
      <div className="flex">
        <Nav />
        <Editor />
      </div>
      <Menu />
    </>
  );
}

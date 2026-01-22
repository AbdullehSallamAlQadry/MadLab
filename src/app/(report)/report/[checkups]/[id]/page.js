import MyDocument from "./container";
import { pullResult } from "./action";

export default async function Page({ params }) {
  const { checkups, id } = await params;
  const result = await pullResult(checkups, id);

  return (
    <div className="w-full h-screen">
      <MyDocument report={result?.data} />
    </div>
  );
}

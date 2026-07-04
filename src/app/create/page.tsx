import { Suspense } from "react";
import { CreatorWorkbench } from "@/components/creator/creator-workbench";

export default function CreatePage() {
  return (
    <Suspense fallback={<div className="page-shell py-20">正在进入创作台...</div>}>
      <CreatorWorkbench />
    </Suspense>
  );
}

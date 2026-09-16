import type { Metadata } from "next";
import { ReviewMap } from "./review-map";

export const metadata: Metadata = {
  title: "Diff Review Map · Codebase Observatory",
  description: "A deterministic map of the files and review units in a Git diff.",
};

export default function ReviewPage() {
  return <ReviewMap />;
}

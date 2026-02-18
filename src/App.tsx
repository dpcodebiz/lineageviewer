import "@xyflow/react/dist/style.css";
import Flow from "./viewer";
import { ReactFlowProvider } from "@xyflow/react";
import { loadState } from "./data/init";
import { Toaster } from "./components/ui/sonner";

// Loading data
loadState();

export default function App() {
  return (
    <ReactFlowProvider>
      <div className="w-dvw h-dvh">
        <Toaster />
        <Flow />
      </div>
    </ReactFlowProvider>
  );
}

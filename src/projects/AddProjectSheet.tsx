import { useState } from "react";
import { convertTxProjectData, getProjectNames } from "./utils";
import { saveToIndexedDB } from "./storage";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Field, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function AddProjectSheet({ open, onClose }: Props) {
  const [projectName, setProjectName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | undefined>(undefined);

  const handleFile = async (file: File) => {
    if (!file.name.endsWith(".xml")) {
      toast.error("Please upload an XML file.");
      return;
    }

    const projects = (await getProjectNames()) as string[];

    const finalName =
      projectName.trim() !== ""
        ? projectName.trim()
        : file.name.replace(".xml", "");

    if (!finalName) {
      toast.error("Please provide a project name");
      return;
    }

    if (projects.includes(finalName)) {
      toast.error("There is already a project with this name");
      return;
    }

    setLoading(true);

    try {
      const content = await file.text();
      const result = convertTxProjectData(content);

      await saveToIndexedDB(finalName, {
        name: finalName,
        createdAt: new Date().toISOString(),
        data: result,
      });

      setProjectName("");

      if (onClose) onClose();
    } catch (err) {
      console.error(err);
      toast.error(
        "An error occurred while loading the file. Check the console for more details."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      setFile(file);
    }
  };

  return (
    <>
      <Sheet
        open={open}
        onOpenChange={(o) => {
          if (!o) onClose();
        }}
      >
        <SheetContent>
          <SheetHeader>
            <SheetTitle>New project</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <div className="p-4 gap-4 flex flex-col">
            <Field>
              <FieldLabel htmlFor="projectName">
                Project Name (optional)
              </FieldLabel>
              <Input
                id="projectName"
                name="projectName"
                placeholder="Project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </Field>

            <div
              className="flex p-10 w-full items-center justify-center rounded-xl border border-dashed text-sm"
              style={{
                borderColor: isDragging ? "#4f46e5" : "#ccc",
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <span>Drag your file here</span>
            </div>
            <span className="text-center">OR</span>
            <Input
              type="file"
              accept=".xml"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setFile(e.target.files[0]);
                }
              }}
            />
            <Button
              disabled={loading}
              onClick={() => {
                if (file == undefined) {
                  return;
                }

                handleFile(file);
              }}
            >
              {loading ? <Spinner /> : "Add"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

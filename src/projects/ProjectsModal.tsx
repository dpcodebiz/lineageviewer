import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddProjectSheet } from "./AddProjectSheet";
import { useEffect, useState } from "react";
import {
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckCircle2, FolderIcon, Trash } from "lucide-react";
import { toast } from "sonner";
import {
  deleteProject,
  getProject,
  getProjectNames,
  saveProject,
} from "./utils";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getSelectedProject, loadData } from "@/data/load";
import { loadState } from "@/data/init";
import { Badge } from "@/components/ui/badge";
import demoProject from "@/data/example.json";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function ProjectsModal({ isOpen, onClose }: Props) {
  const [isAddModelOpen, setIsAddModelOpen] = useState(false);
  const [projects, setProjects] = useState<string[]>();

  function loadProjects() {
    getProjectNames().then((data) => {
      setProjects(data as string[]);
    });
  }

  async function loadDefaultProject() {
    const projects = (await getProjectNames()) as string[];

    if (projects.includes("demo project")) {
      await deleteProject("demo project");
    }

    await saveProject("demo project", demoProject);
  }

  useEffect(() => {
    loadProjects();
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        if (onClose) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex flex-row">
            Available projects
            <Button
              onClick={() => loadDefaultProject()}
              variant="secondary"
              className="place-self-end ml-auto mr-10"
              size="xs"
            >
              Create default project
            </Button>
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>
        {projects?.length == 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FolderIcon />
              </EmptyMedia>
              <EmptyTitle>No project found</EmptyTitle>
              <EmptyDescription>
                Hint: explore the features with the{" "}
                <strong>create default project</strong> button ! :)
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Table className="w-full">
            <TableCaption></TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Project name</TableHead>
                <TableHead className="text-center"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects?.map((project) => (
                <TableRow key={project}>
                  <TableCell className="font-medium">
                    {project}
                    {getSelectedProject() == project && (
                      <Badge className="ml-2" variant="outline">
                        selected
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="place-content-center gap-2 flex flex-row">
                    <Button
                      variant="destructive"
                      size={"icon-xs"}
                      onClick={(e) => {
                        e.preventDefault();
                        deleteProject(project).then(async () => {
                          await loadProjects();
                          toast(
                            `Project "${project}" has been deleted successfully`
                          );
                        });
                      }}
                    >
                      <Trash />
                    </Button>
                    <Button
                      title="Select"
                      className="cursor-pointer"
                      size={"icon-xs"}
                      onClick={async () => {
                        await loadData(await getProject(project), project);
                        await loadState();
                        onClose();
                      }}
                    >
                      <CheckCircle2 />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Button onClick={() => setIsAddModelOpen(true)}>New Project</Button>
        <AddProjectSheet
          open={isAddModelOpen}
          onClose={() => setIsAddModelOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

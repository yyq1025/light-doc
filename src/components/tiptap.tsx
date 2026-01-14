import { useNavigate } from "@tanstack/react-router";
import { EditorContent } from "@tiptap/react";
import {
  Download,
  FileUp,
  LogOut,
  Menu,
  UserRoundPlus,
  UsersRound,
} from "lucide-react";
import { Activity, useState } from "react";
import { CollabDialog } from "@/components/collab-dialog";
import { EditorToolbar } from "@/components/editor-toolbar";
import { LoadFromFileDialog } from "@/components/load-from-file-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCollabEditor } from "@/hooks/use-collab-editor";
import { downloadTextFile } from "@/lib/tiptap";

export default function Tiptap({ room }: { room?: string }) {
  const navigate = useNavigate();
  const { editor, uniqueUsers, startSession } = useCollabEditor(room);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [showCollabDialog, setShowCollabDialog] = useState(false);
  const copyToNewRoom = () => {
    const roomId = startSession();
    if (!roomId) return;
    navigate({
      to: "/",
      search: (prev) => ({ ...prev, room: roomId }),
    });
  };

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <>
      <div className="sticky top-0 z-10 grid grid-cols-[1fr_auto_1fr] gap-4">
        <div>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon">
                <Menu />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52" align="start">
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <FileUp /> Open
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem
                        onSelect={() => setShowAlertDialog(true)}
                      >
                        Markdown (.md)
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem onSelect={() => setShowCollabDialog(true)}>
                  <UsersRound /> Collaboration
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Download /> Download
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem
                        onSelect={() => {
                          if (!editor) return;
                          downloadTextFile({
                            filename: "document.md",
                            content: editor.getMarkdown(),
                            mime: "text/markdown;charset=utf-8",
                          });
                        }}
                      >
                        Markdown (.md)
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => {
                          if (!editor) return;
                          downloadTextFile({
                            filename: "document.html",
                            content: editor.getHTML(),
                            mime: "text/html;charset=utf-8",
                          });
                        }}
                      >
                        HTML (.html)
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              <Activity mode={room ? "visible" : "hidden"}>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    variant="destructive"
                    onSelect={() =>
                      navigate({
                        to: "/",
                        search: (prev) => ({ ...prev, room: undefined }),
                      })
                    }
                  >
                    <LogOut /> Leave Session
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </Activity>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <EditorToolbar editor={editor} />
        <div className="flex justify-end gap-4">
          <Activity mode={room ? "visible" : "hidden"}>
            <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2">
              {uniqueUsers.slice(0, 2).map((user) => (
                <Tooltip key={user.id}>
                  <TooltipTrigger asChild>
                    <Avatar>
                      <AvatarFallback
                        style={{ backgroundColor: user.color, color: "white" }}
                      >
                        {user.name[0]}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">{user.name}</TooltipContent>
                </Tooltip>
              ))}
              {uniqueUsers.length > 2 && (
                <Avatar>
                  <AvatarFallback className="bg-gray-300 text-gray-800">
                    {`+${uniqueUsers.length - 2}`}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          </Activity>
          {room ? (
            <Button variant="outline" onClick={() => setShowCollabDialog(true)}>
              <UsersRound /> Collaboration
            </Button>
          ) : (
            <Button onClick={() => setShowCollabDialog(true)}>
              <UserRoundPlus /> Share
            </Button>
          )}
        </div>
      </div>
      <EditorContent editor={editor} className="max-w-2xl p-6 mx-auto" />
      <CollabDialog
        open={showCollabDialog}
        onOpenChange={setShowCollabDialog}
        room={room}
        onStartSession={copyToNewRoom}
      />
      <LoadFromFileDialog
        open={showAlertDialog}
        onOpenChange={setShowAlertDialog}
        editor={editor}
      />
    </>
  );
}

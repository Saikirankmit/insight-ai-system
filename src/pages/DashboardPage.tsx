import { ChatPanel } from "@/components/ChatPanel";
import { DashboardPanel } from "@/components/DashboardPanel";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

export default function DashboardPage() {
  return (
    <div className="h-full -m-6">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
          <div className="h-full border-r border-border/40 bg-card/30">
            <ChatPanel />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={65} minSize={40}>
          <DashboardPanel />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

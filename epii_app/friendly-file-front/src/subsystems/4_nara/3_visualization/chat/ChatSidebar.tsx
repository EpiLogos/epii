
import React from "react";
import { FileText, Sparkles, Settings, Save, MessageSquare, File } from "lucide-react"; // Added Save, MessageSquare, File icons

// Combined type for different draft origins
interface CrystallisationDraftItem {
  id: string;
  type: 'conversation' | 'document' | 'canvas'; // Indicate origin
  title: string; // Title or preview
  bimbaCoordinate?: string; // Optional coordinate link
  date: string;
}

// Mock data for the consolidated list - replace with real data logic
const MOCK_DRAFTS: CrystallisationDraftItem[] = [
   {
    id: "canvas_1",
    type: 'canvas',
    title: "Draft edits for Mock Heading...",
    bimbaCoordinate: "#5-2-1",
    date: "Today",
  },
  {
    id: "convo_1",
    type: 'conversation',
    title: "Exploring Anuttara",
    date: "Today",
  },
   {
    id: "doc_1",
    type: 'document',
    title: "Epi-Logos Vision Statement.pdf",
    date: "Yesterday",
  },
  {
    id: "canvas_2",
    type: 'canvas',
    title: "Analysis draft regarding context...",
    bimbaCoordinate: "#4-1-0",
    date: "Yesterday",
  },
  {
    id: "convo_2",
    type: 'conversation',
    title: "Paramasiva and Quaternary Logic",
    date: "Yesterday",
  },
];

export const ChatSidebar: React.FC = () => {
  // Placeholder function to get the right icon based on type
  const getIconForType = (type: CrystallisationDraftItem['type']) => {
    switch (type) {
      case 'conversation': return <MessageSquare size={14} className="text-epii-blue flex-shrink-0" />;
      case 'document': return <File size={14} className="text-epii-orange flex-shrink-0" />;
      case 'canvas': return <Save size={14} className="text-epii-green flex-shrink-0" />;
      default: return <FileText size={14} className="text-foreground/70 flex-shrink-0" />;
    }
  };

  return (
    <div className="w-64 bg-epii-dark/60 neo-glow rounded-lg p-4 hidden lg:block">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-light text-epii-neon">Chat Navigator</h3>
        <Settings size={18} className="text-foreground/70 hover:text-epii-neon cursor-pointer" />
      </div>
      
      {/* New Chat Button */}
      <button className="w-full bg-epii-neon text-epii-darker rounded-md px-4 py-2 hover:brightness-110 transition-all flex items-center justify-center mb-6">
        <Sparkles size={16} className="mr-2" />
        <span>New Conversation</span>
      </button>
      
      {/* Consolidated Drafts Section */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-epii-neon flex items-center gap-2">
           <Save size={14} /> {/* Using Save icon for the section */}
           Bimba Crystallisation Drafts
        </h4>
      </div>
      
      {/* Drafts List */}
      <div className="space-y-3">
        {MOCK_DRAFTS.map((item) => (
          <div 
            key={item.id}
            // TODO: Add onClick handler to load this draft/context into EpiiChatPage
            onClick={() => console.log("Load draft/context:", item.id, item.type)} 
            className="p-3 rounded-md hover:bg-epii-neon/10 cursor-pointer transition-all border border-transparent hover:border-epii-neon/20"
          >
            <div className="flex items-start gap-2"> {/* Changed to items-start */}
              {getIconForType(item.type)}
              <div className="flex-grow min-w-0"> {/* Added min-w-0 for truncation */}
                 <div className="text-sm font-medium truncate">{item.title}</div>
                 {item.bimbaCoordinate && (
                    <span className="text-xs font-mono text-epii-purple mr-1">{item.bimbaCoordinate}</span>
                 )}
                 <span className="text-xs text-foreground/60">{item.date}</span>
              </div>
            </div>
          </div>
        ))}
         {MOCK_DRAFTS.length === 0 && (
           <p className="text-xs text-foreground/60 text-center py-2">No drafts available.</p>
         )}
      </div>
      
      {/* Removed separate Recent Chats and Recent Documents sections */}
      
    </div>
  );
};

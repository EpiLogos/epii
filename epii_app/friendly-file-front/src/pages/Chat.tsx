
import { useState, useRef, useEffect } from "react";
import { Send, Search, Plus, FileText, Brain, User, Bot } from "lucide-react";
import PageTransition from "../components/layout/PageTransition";
import GeometricBackground from "../components/ui/GeometricBackground";
import { ChatMessage } from "../components/chat/ChatMessage";
import { ChatInput } from "../components/chat/ChatInput";
import { DataVisualizer } from "../components/chat/DataVisualizer";
import { ChatSidebar } from "../components/chat/ChatSidebar";

// Types for chat functionality
export interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  references?: {
    type: "file" | "node" | "user" | "web";
    id: string;
    title: string;
  }[];
  visualData?: {
    type: "graph" | "document" | "image" | "code";
    data: unknown;
  };
}

// Mock initial messages - to be replaced with real data
const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    content: "Welcome to epii. How can I assist your exploration today?",
    sender: "ai",
    timestamp: new Date(Date.now() - 5000),
  },
];

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeVisualData, setActiveVisualData] = useState<Message["visualData"] | null>(null);
  const [activeDisplayCoordinate, setActiveDisplayCoordinate] = useState<string | null>(null); // State for Notion coordinate
  const [currentFileId, setCurrentFileId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Create a new user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    console.log("Preparing to send message..."); // Log user message
    console.log("User input:", inputValue);

    // --- API call to backend ---
    // FIXME: Replace placeholder userId with actual user authentication and management system.
    // This is critical for personalized context and memory.
    const placeholderUserId = "user_123";

    // Format history for backend (simple example, might need BaseMessage structure)
    // Sending last 10 messages for context, excluding the latest user message which is sent separately
    const historyToSend = messages.slice(-10).map(msg => ({
        type: msg.sender === 'user' ? 'human' : 'ai',
        content: msg.content
        // Add tool_calls if applicable in the future
    }));

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'; // Default if not set
      console.log(`Sending request to backend: ${backendUrl}/api/chat`);

      const response = await fetch(`${backendUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: placeholderUserId,
          message: userMessage.content, // Changed key from userQuery to message
          history: historyToSend // Send the formatted history
          // fileId: currentFileId // Keep if needed for other context
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Assuming the backend returns a JSON object with the final AI message
      // structure: { llmResponse: { type: 'ai', content: '...', tool_calls: [...] } }
      const data = await response.json();
      console.log("API Response data:", data); // Log API response data

      // Backend returns { response: "...", displayCoordinate: "..." | null }
      let aiResponseContent = "Error: Could not parse AI response.";
      let displayCoordinateFromApi: string | null = null;
      const visualData = null; // Placeholder for potential visual data later

      // Extract content and displayCoordinate from the response object
      if (data && typeof data.response === 'string') {
          aiResponseContent = data.response;
          displayCoordinateFromApi = data.displayCoordinate || null; // Extract coordinate, default to null
          // TODO: Handle potential visual data if backend structure changes
      } else {
          console.error("Unexpected API response structure or missing response/displayCoordinate field:", data);
      }

      // Update the active display coordinate state
      setActiveDisplayCoordinate(displayCoordinateFromApi);


      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponseContent,
        sender: "ai",
        timestamp: new Date(),
        visualData: visualData // Add visual data if extracted
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("API call failed:", error);
      let errorMessage = "Failed to get AI response. Please try again later.";
      if (error instanceof Error) {
        errorMessage = `API call failed: ${error.message}`; // Display specific error message
      } else {
        errorMessage = "An unexpected error occurred."; // Generic error for non-Error objects
      }
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: errorMessage,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-6">
        <GeometricBackground density={8} opacity={0.02} />
        
        <div className="container mx-auto px-4 h-[calc(100vh-8rem)]">
          <div className="flex h-full gap-4">
            {/* Chat Sidebar */}
            <ChatSidebar />
            
            {/* Main Chat Area */}
            <div className="flex-grow flex flex-col bg-epii-dark/40 neo-glow rounded-lg overflow-hidden">
              {/* Chat Messages */}
              <div className="flex-grow overflow-y-auto p-6">
                {messages.map((message) => (
                  <ChatMessage 
                    key={message.id} 
                    message={message} 
                    setActiveVisualData={setActiveVisualData}
                  />
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2 text-epii-neon animate-pulse">
                    <div className="w-2 h-2 bg-epii-neon rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-epii-neon rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 bg-epii-neon rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Chat Input */}
              <ChatInput 
                value={inputValue}
                onChange={setInputValue}
                onSend={handleSendMessage}
                isLoading={isLoading}
              />
            </div>
            
            {/* Data Visualization Panel - Pass both visualData and displayCoordinate */}
            <DataVisualizer visualData={activeVisualData} displayCoordinate={activeDisplayCoordinate} />
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Chat;

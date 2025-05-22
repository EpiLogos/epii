import { useState, useRef, useEffect } from "react";
import { FileText, MoreHorizontal, Edit, Trash, Download } from "lucide-react";

interface FileCardProps {
  id: string;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDownload?: (id: string) => void;
}

const FileCard = ({
  id,
  name,
  type,
  size,
  lastModified,
  onEdit,
  onDelete,
  onDownload
}: FileCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const fileNameRef = useRef<HTMLHeadingElement>(null);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  useEffect(() => {
    const h3Element = fileNameRef.current;
    if (h3Element) {
      const containerWidth = h3Element.parentElement!.offsetWidth;
      let truncatedText = name;
      let truncationLength = name.length;
      while (h3Element.offsetWidth > containerWidth && truncationLength > 0) {
        truncationLength--;
        truncatedText = name.slice(0, truncationLength) + "...";
        h3Element.textContent = truncatedText;
      }
      if (truncationLength < name.length) {
        h3Element.setAttribute('title', name); // Set tooltip
      } else {
        h3Element.removeAttribute('title'); // Remove tooltip if no overflow
      }
    }
  }, [name]);

  return (
    <div className="bg-epii-dark neo-glow rounded-lg p-4 transition-all duration-300 hover:bg-epii-dark/70" style={{ border: '2px solid red', backgroundColor: 'rgba(255, 0, 0, 0.1)' }}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3" style={{ border: '2px solid green', backgroundColor: 'rgba(0, 255, 0, 0.1)', overflow: 'hidden' }}>
          <div className="bg-epii-neon/10 p-2 rounded-md">
            <FileText className="h-6 w-6 text-epii-neon" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-foreground" title={name} ref={fileNameRef} style={{ wordWrap: 'break-word', overflowWrap: 'break-word', flexShrink: 1, overflow: 'hidden' }}>{name}</h3>
            <p className="text-sm text-foreground/60">{type}</p>
          </div>
        </div>
        
        <div className="relative">
          <button 
            onClick={toggleMenu}
            className="p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <MoreHorizontal className="h-5 w-5 text-foreground/60" />
          </button>
          
          {isMenuOpen && (
            <div className="absolute right-0 mt-1 w-36 glass rounded-md shadow-lg py-1 z-10 animate-fade-in">
              {onEdit && (
                <button
                  onClick={() => {
                    onEdit(id);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-white/5"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
              )}
              
              {onDownload && (
                <button
                  onClick={() => {
                    onDownload(id);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-white/5"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
              )}
              
              {onDelete && (
                <button
                  onClick={() => {
                    onDelete(id);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left text-red-400 hover:bg-white/5"
                >
                  <Trash className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mt-3">
        <div>
          <p className="text-xs text-foreground/60">Size</p>
          <p className="text-sm">{size}</p>
        </div>
        <div>
          <p className="text-xs text-foreground/60">Modified</p>
          <p className="text-sm">{lastModified}</p>
        </div>
      </div>
    </div>
  );
};

export default FileCard;

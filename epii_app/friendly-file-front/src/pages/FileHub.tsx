import { useState, useEffect, useRef } from "react";
import { Search, Upload, FolderPlus, Filter, Grid, List } from "lucide-react";
import PageTransition from "../components/layout/PageTransition";
import FileCard from "../components/ui/FileCard";
import GeometricBackground from "../components/ui/GeometricBackground";

type ViewMode = "grid" | "list";

const FileHub = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const fetchFiles = () => {
    console.log("Fetching files from http://localhost:3001/files");
    fetch('http://localhost:3001/files')
      .then(response => {
        console.log("Response status:", response.status);
        return response.json();
      })
      .then(data => {
        console.log("Fetched files data:", data);
        setFiles(data.files || []); // Update files state with fetched files
      })
      .catch(error => {
        console.error("Error fetching files:", error);
      });
  };

  useEffect(() => {
    fetchFiles();
  }, []);
  
  const filteredFiles = files.filter(file => 
    file.filename?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleEdit = (id: string) => {
    console.log("Edit file with ID:", id);
    // Will be implemented with actual backend integration
  };
  
  const handleDelete = (id: string) => {
    // Will be implemented with actual backend integration
    console.log("Delete file with ID:", id);
  };
  
  const handleDownload = (id: string) => {
    console.log("Download file with ID:", id);
    // Will be implemented with actual backend integration
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      console.log("Selected file:", selectedFile);

      const formData = new FormData();
      formData.append('file', selectedFile);

      fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formData,
      })
      .then(response => response.json())
      .then(data => {
        console.log('File uploaded successfully:', data);
        // Refresh file list after upload
        fetchFiles();
      })
      .catch(error => {
        console.error('Error uploading file:', error);
        // Handle upload error (e.g., display error message)
      });
    }
  };


  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16">
        <GeometricBackground density={10} opacity={0.03} />
        
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-light mb-2">File Hub</h1>
            <p className="text-foreground/70">Manage and organize your source files</p>
          </div>
          
          {/* Search and Actions */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-epii-dark/80 neo-glow rounded-md focus:outline-none focus:ring-2 focus:ring-epii-neon/50"
              />
            </div>
            
            <div className="flex gap-2">
              <button className="bg-epii-dark neo-glow rounded-md px-4 py-2 hover:bg-epii-dark/70 transition-all flex items-center gap-2">
                <Filter size={18} />
                <span className="hidden md:inline">Filter</span>
              </button>
              
              <button className="bg-epii-dark neo-glow rounded-md px-4 py-2 hover:bg-epii-dark/70 transition-all flex items-center gap-2">
                <FolderPlus size={18} />
                <span className="hidden md:inline">New Folder</span>
              </button>
              
              <button 
                onClick={handleUploadClick}
                className="bg-epii-neon text-epii-darker rounded-md px-4 py-2 hover:brightness-110 transition-all flex items-center gap-2"
              >
                <Upload size={18} />
                <span className="hidden md:inline">Upload</span>
              </button>
              <input
                type="file"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              
              <div className="bg-epii-dark neo-glow rounded-md flex overflow-hidden">
                <button 
                  className={`px-3 py-2 transition-all ${viewMode === 'grid' ? 'bg-epii-neon/20' : 'hover:bg-epii-dark/70'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid size={18} />
                </button>
                <button 
                  className={`px-3 py-2 transition-all ${viewMode === 'list' ? 'bg-epii-neon/20' : 'hover:bg-epii-dark/70'}`}
                  onClick={() => setViewMode('list')}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Files Display */}
          {filteredFiles.length > 0 ? (
            <div className={viewMode === 'grid'
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              : "flex flex-col gap-3"
            } style={{ minWidth: 0 }}>
              {filteredFiles.map(file => (
                <FileCard
                  key={file.id}
                  id={file.id}
                  name={file.filename} // Use filename from backend metadata
                  type={file.contentType} // Use contentType from backend metadata
                  size={file.size}
                  lastModified={file.uploadDate} // Use uploadDate from backend metadata
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onDownload={handleDownload}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-epii-neon/10 mb-4">
                <Search className="h-8 w-8 text-epii-neon" />
              </div>
              <h3 className="text-xl mb-2">No files found</h3>
              <p className="text-foreground/70">
                {searchQuery ? "Try a different search term" : "Upload files to get started"}
              </p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default FileHub;

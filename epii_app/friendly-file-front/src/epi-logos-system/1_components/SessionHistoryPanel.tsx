/**
 * Session History Panel Component
 * 
 * Advanced session management interface with search, filtering, bulk operations,
 * and detailed session previews. Provides comprehensive session history management.
 * 
 * Bimba Coordinate: #5-1-3 (Epii Agent UI - Session History)
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Archive, 
  Download, 
  Trash2, 
  RotateCcw,
  MessageCircle, 
  FileText, 
  Target, 
  User,
  Clock,
  Compress,
  ChevronDown,
  ChevronRight,
  CheckSquare,
  Square,
  MoreHorizontal,
  Eye,
  ExternalLink
} from 'lucide-react';
import { sessionHistoryService } from '../3_services/SessionHistoryService';
import { sessionRoutingService } from '../3_services/SessionRoutingService';

interface SessionHistoryItem {
  id: string;
  title: string;
  sessionType: 'general' | 'document' | 'analysis' | 'coordinate';
  timestamp: Date;
  lastActivity: Date;
  messageCount: number;
  isCompressed: boolean;
  isActive: boolean;
  contextIndicator?: string;
  expertSkillId?: string;
  metadata?: Record<string, any>;
  lastMessagePreview?: string;
  compressionSummary?: any;
}

interface SessionFilter {
  sessionType?: string;
  expertSkill?: string;
  dateRange?: { start: Date; end: Date };
  isCompressed?: boolean;
  isActive?: boolean;
  minMessages?: number;
  maxMessages?: number;
}

interface SessionHistoryPanelProps {
  isVisible: boolean;
  onClose: () => void;
  onSessionSelect: (sessionId: string) => void;
  currentSessionId?: string;
  className?: string;
}

export const SessionHistoryPanel: React.FC<SessionHistoryPanelProps> = ({
  isVisible,
  onClose,
  onSessionSelect,
  currentSessionId,
  className = ''
}) => {
  const [sessions, setSessions] = useState<SessionHistoryItem[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<SessionHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<SessionFilter>({});
  const [selectedSessions, setSelectedSessions] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'lastActivity' | 'timestamp' | 'messageCount' | 'title'>('lastActivity');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Load sessions on mount and when visible
  useEffect(() => {
    if (isVisible) {
      loadSessions();
    }
  }, [isVisible]);

  // Apply filters and search when inputs change
  useEffect(() => {
    applyFiltersAndSearch();
  }, [sessions, searchQuery, activeFilter, sortBy, sortOrder]);

  /**
   * Load session history from service
   */
  const loadSessions = useCallback(async () => {
    setIsLoading(true);
    try {
      const sessionData = await sessionHistoryService.getRecentSessions(100);
      
      // Transform to interface format
      const transformedSessions: SessionHistoryItem[] = sessionData.map(session => ({
        id: session.id,
        title: session.title || generateSessionTitle(session),
        sessionType: session.sessionType || 'general',
        timestamp: new Date(session.timestamp),
        lastActivity: new Date(session.lastActivity || session.timestamp),
        messageCount: session.messageCount || 0,
        isCompressed: session.isCompressed || false,
        isActive: session.isActive !== false,
        contextIndicator: session.context?.documentId || session.context?.coordinate,
        expertSkillId: session.expertSkillId,
        metadata: session.metadata,
        lastMessagePreview: session.lastMessagePreview,
        compressionSummary: session.compressionSummary
      }));

      setSessions(transformedSessions);
    } catch (error) {
      console.error('[SessionHistoryPanel] Failed to load sessions:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Apply search filters and sorting
   */
  const applyFiltersAndSearch = useCallback(() => {
    let filtered = [...sessions];

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(session => 
        session.title.toLowerCase().includes(query) ||
        session.contextIndicator?.toLowerCase().includes(query) ||
        session.lastMessagePreview?.toLowerCase().includes(query) ||
        session.expertSkillId?.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (activeFilter.sessionType) {
      filtered = filtered.filter(session => session.sessionType === activeFilter.sessionType);
    }
    if (activeFilter.expertSkill) {
      filtered = filtered.filter(session => session.expertSkillId === activeFilter.expertSkill);
    }
    if (activeFilter.isCompressed !== undefined) {
      filtered = filtered.filter(session => session.isCompressed === activeFilter.isCompressed);
    }
    if (activeFilter.isActive !== undefined) {
      filtered = filtered.filter(session => session.isActive === activeFilter.isActive);
    }
    if (activeFilter.minMessages) {
      filtered = filtered.filter(session => session.messageCount >= activeFilter.minMessages!);
    }
    if (activeFilter.maxMessages) {
      filtered = filtered.filter(session => session.messageCount <= activeFilter.maxMessages!);
    }
    if (activeFilter.dateRange) {
      filtered = filtered.filter(session => 
        session.lastActivity >= activeFilter.dateRange!.start &&
        session.lastActivity <= activeFilter.dateRange!.end
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'lastActivity':
          comparison = a.lastActivity.getTime() - b.lastActivity.getTime();
          break;
        case 'timestamp':
          comparison = a.timestamp.getTime() - b.timestamp.getTime();
          break;
        case 'messageCount':
          comparison = a.messageCount - b.messageCount;
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    setFilteredSessions(filtered);
  }, [sessions, searchQuery, activeFilter, sortBy, sortOrder]);

  /**
   * Generate session title for sessions without title
   */
  const generateSessionTitle = (session: any): string => {
    if (session.context?.documentId) {
      return `Document: ${session.context.documentName || session.context.documentId}`;
    }
    if (session.context?.coordinate) {
      return `Coordinate: ${session.context.coordinate}`;
    }
    const date = new Date(session.timestamp);
    return `Session ${date.toLocaleDateString()} ${date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`;
  };

  /**
   * Handle session selection
   */
  const handleSessionSelect = useCallback((sessionId: string) => {
    onSessionSelect(sessionId);
    onClose();
  }, [onSessionSelect, onClose]);

  /**
   * Handle bulk selection
   */
  const handleBulkSelect = useCallback((sessionId: string, selected: boolean) => {
    setSelectedSessions(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(sessionId);
      } else {
        newSet.delete(sessionId);
      }
      return newSet;
    });
  }, []);

  /**
   * Handle select all
   */
  const handleSelectAll = useCallback(() => {
    if (selectedSessions.size === filteredSessions.length) {
      setSelectedSessions(new Set());
    } else {
      setSelectedSessions(new Set(filteredSessions.map(s => s.id)));
    }
  }, [filteredSessions, selectedSessions.size]);

  /**
   * Handle bulk operations
   */
  const handleBulkOperation = useCallback(async (operation: 'archive' | 'delete' | 'export' | 'compress') => {
    if (selectedSessions.size === 0) return;

    const sessionIds = Array.from(selectedSessions);
    
    try {
      switch (operation) {
        case 'archive':
          // Archive selected sessions
          for (const sessionId of sessionIds) {
            await sessionHistoryService.archiveSession(sessionId);
          }
          break;
        case 'delete':
          // Delete selected sessions
          for (const sessionId of sessionIds) {
            await sessionHistoryService.deleteSession(sessionId);
          }
          break;
        case 'export':
          // Export selected sessions
          await exportSelectedSessions(sessionIds);
          break;
        case 'compress':
          // Compress selected sessions
          for (const sessionId of sessionIds) {
            await sessionHistoryService.compressSession(sessionId);
          }
          break;
      }

      // Reload sessions and clear selection
      await loadSessions();
      setSelectedSessions(new Set());
    } catch (error) {
      console.error(`[SessionHistoryPanel] Bulk ${operation} failed:`, error);
    }
  }, [selectedSessions, loadSessions]);

  /**
   * Export selected sessions
   */
  const exportSelectedSessions = async (sessionIds: string[]) => {
    try {
      const exportData = [];
      
      for (const sessionId of sessionIds) {
        const session = await sessionHistoryService.getSession(sessionId);
        if (session) {
          exportData.push(session);
        }
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `epi-logos-sessions-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('[SessionHistoryPanel] Export failed:', error);
    }
  };

  /**
   * Get session type icon
   */
  const getSessionTypeIcon = (type: SessionHistoryItem['sessionType']) => {
    switch (type) {
      case 'document':
        return <FileText size={14} className="text-blue-400" />;
      case 'coordinate':
        return <Target size={14} className="text-purple-400" />;
      case 'analysis':
        return <Search size={14} className="text-green-400" />;
      default:
        return <MessageCircle size={14} className="text-gray-400" />;
    }
  };

  /**
   * Get expert skill badge
   */
  const getExpertSkillBadge = (expertSkillId?: string) => {
    if (!expertSkillId) return null;

    const skillColors: Record<string, string> = {
      'epii-chat': 'bg-purple-600 text-purple-100',
      'nara-chat': 'bg-blue-600 text-blue-100',
      'paramasiva-chat': 'bg-green-600 text-green-100',
      'anuttara-chat': 'bg-orange-600 text-orange-100',
      'universal-chat': 'bg-gray-600 text-gray-100'
    };

    const skillNames: Record<string, string> = {
      'epii-chat': 'Epii',
      'nara-chat': 'Nara',
      'paramasiva-chat': 'Paramasiva',
      'anuttara-chat': 'Anuttara',
      'universal-chat': 'Universal'
    };

    const colorClass = skillColors[expertSkillId] || 'bg-gray-600 text-gray-100';
    const name = skillNames[expertSkillId] || expertSkillId;

    return (
      <span className={`px-2 py-1 text-xs rounded ${colorClass}`}>
        {name}
      </span>
    );
  };

  /**
   * Memoized session list
   */
  const sessionList = useMemo(() => {
    return filteredSessions.map(session => (
      <div
        key={session.id}
        className={`session-item border-b border-gray-700 ${
          session.id === currentSessionId ? 'bg-epii-neon/10 border-epii-neon/40' : ''
        }`}
      >
        <div className="flex items-center p-3">
          {/* Selection checkbox */}
          <button
            onClick={() => handleBulkSelect(session.id, !selectedSessions.has(session.id))}
            className="mr-3 hover:bg-gray-700 p-1 rounded"
          >
            {selectedSessions.has(session.id) ? 
              <CheckSquare size={16} className="text-epii-neon" /> : 
              <Square size={16} className="text-gray-400" />
            }
          </button>

          {/* Session type icon */}
          <div className="mr-3">
            {getSessionTypeIcon(session.sessionType)}
          </div>

          {/* Session info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 
                className="text-sm font-medium text-gray-200 truncate cursor-pointer hover:text-epii-neon"
                onClick={() => handleSessionSelect(session.id)}
              >
                {session.title}
              </h4>
              <div className="flex items-center space-x-2 ml-2">
                {session.isCompressed && (
                  <Compress size={12} className="text-yellow-400" title="Compressed" />
                )}
                {!session.isActive && (
                  <Archive size={12} className="text-gray-500" title="Archived" />
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4 mt-1">
              <div className="flex items-center space-x-1 text-xs text-gray-400">
                <Clock size={10} />
                <span>{session.lastActivity.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-400">
                <MessageCircle size={10} />
                <span>{session.messageCount}</span>
              </div>
              {session.expertSkillId && getExpertSkillBadge(session.expertSkillId)}
            </div>

            {session.contextIndicator && (
              <div className="text-xs text-gray-500 mt-1">
                Context: {session.contextIndicator}
              </div>
            )}

            {session.lastMessagePreview && (
              <div className="text-xs text-gray-500 mt-1 truncate">
                {session.lastMessagePreview}
              </div>
            )}
          </div>

          {/* Expand/Actions */}
          <div className="flex items-center space-x-1 ml-2">
            <button
              onClick={() => setExpandedSession(
                expandedSession === session.id ? null : session.id
              )}
              className="p-1 hover:bg-gray-700 rounded"
              title="Expand details"
            >
              {expandedSession === session.id ? 
                <ChevronDown size={14} className="text-gray-400" /> : 
                <ChevronRight size={14} className="text-gray-400" />
              }
            </button>
            <button
              className="p-1 hover:bg-gray-700 rounded"
              title="More actions"
            >
              <MoreHorizontal size={14} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Expanded details */}
        {expandedSession === session.id && (
          <div className="px-3 pb-3 border-t border-gray-700 bg-gray-800/50">
            <div className="grid grid-cols-2 gap-4 mt-3 text-xs">
              <div>
                <span className="text-gray-400">Created:</span>
                <span className="ml-2 text-gray-200">
                  {session.timestamp.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Last Active:</span>
                <span className="ml-2 text-gray-200">
                  {session.lastActivity.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Type:</span>
                <span className="ml-2 text-gray-200 capitalize">
                  {session.sessionType}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Messages:</span>
                <span className="ml-2 text-gray-200">
                  {session.messageCount}
                </span>
              </div>
            </div>

            {session.compressionSummary && (
              <div className="mt-3">
                <span className="text-gray-400 text-xs">Compression Summary:</span>
                <div className="mt-1 p-2 bg-gray-900 rounded text-xs text-gray-300">
                  {JSON.stringify(session.compressionSummary, null, 2)}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex space-x-2 mt-3">
              <button
                onClick={() => handleSessionSelect(session.id)}
                className="px-3 py-1 text-xs bg-epii-neon text-epii-darker rounded hover:brightness-110"
              >
                <ExternalLink size={12} className="inline mr-1" />
                Open
              </button>
              <button
                onClick={() => exportSelectedSessions([session.id])}
                className="px-3 py-1 text-xs bg-blue-600 text-blue-100 rounded hover:bg-blue-500"
              >
                <Download size={12} className="inline mr-1" />
                Export
              </button>
              {!session.isCompressed && session.messageCount > 10 && (
                <button
                  onClick={() => handleBulkOperation('compress')}
                  className="px-3 py-1 text-xs bg-yellow-600 text-yellow-100 rounded hover:bg-yellow-500"
                >
                  <Compress size={12} className="inline mr-1" />
                  Compress
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    ));
  }, [filteredSessions, selectedSessions, expandedSession, currentSessionId, handleSessionSelect, handleBulkSelect, handleBulkOperation, exportSelectedSessions]);

  if (!isVisible) return null;

  return (
    <div className={`session-history-panel ${className}`}>
      {/* Panel overlay */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose}>
        <div 
          className="absolute right-0 top-0 h-full w-96 bg-epii-darker border-l border-epii-neon/20 shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-epii-neon/20">
            <h2 className="text-lg font-semibold text-epii-neon">Session History</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded text-gray-400"
            >
              <X size={20} />
            </button>
          </div>

          {/* Search and filters */}
          <div className="p-4 border-b border-gray-700">
            {/* Search */}
            <div className="relative mb-3">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:border-epii-neon"
              />
            </div>

            {/* Filter toggle */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 text-sm text-gray-400 hover:text-epii-neon"
              >
                <Filter size={14} />
                <span>Filters</span>
                {showFilters ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              </button>

              {/* Sort controls */}
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-') as [typeof sortBy, typeof sortOrder];
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder);
                }}
                className="text-xs bg-gray-800 border border-gray-600 rounded px-2 py-1 text-gray-200"
              >
                <option value="lastActivity-desc">Latest Activity</option>
                <option value="timestamp-desc">Newest First</option>
                <option value="messageCount-desc">Most Messages</option>
                <option value="title-asc">Title A-Z</option>
              </select>
            </div>

            {/* Filters panel */}
            {showFilters && (
              <div className="mt-3 space-y-3 p-3 bg-gray-800 rounded">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Session Type</label>
                  <select
                    value={activeFilter.sessionType || ''}
                    onChange={(e) => setActiveFilter(prev => ({ ...prev, sessionType: e.target.value || undefined }))}
                    className="w-full text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1 text-gray-200"
                  >
                    <option value="">All Types</option>
                    <option value="general">General</option>
                    <option value="document">Document</option>
                    <option value="coordinate">Coordinate</option>
                    <option value="analysis">Analysis</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Expert Skill</label>
                  <select
                    value={activeFilter.expertSkill || ''}
                    onChange={(e) => setActiveFilter(prev => ({ ...prev, expertSkill: e.target.value || undefined }))}
                    className="w-full text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1 text-gray-200"
                  >
                    <option value="">All Experts</option>
                    <option value="epii-chat">Epii</option>
                    <option value="nara-chat">Nara</option>
                    <option value="paramasiva-chat">Paramasiva</option>
                    <option value="anuttara-chat">Anuttara</option>
                    <option value="universal-chat">Universal</option>
                  </select>
                </div>

                <div className="flex space-x-2">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 mb-1">Min Messages</label>
                    <input
                      type="number"
                      value={activeFilter.minMessages || ''}
                      onChange={(e) => setActiveFilter(prev => ({ ...prev, minMessages: e.target.value ? parseInt(e.target.value) : undefined }))}
                      className="w-full text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1 text-gray-200"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 mb-1">Max Messages</label>
                    <input
                      type="number"
                      value={activeFilter.maxMessages || ''}
                      onChange={(e) => setActiveFilter(prev => ({ ...prev, maxMessages: e.target.value ? parseInt(e.target.value) : undefined }))}
                      className="w-full text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1 text-gray-200"
                      placeholder="∞"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-xs">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={activeFilter.isCompressed === true}
                      onChange={(e) => setActiveFilter(prev => ({ ...prev, isCompressed: e.target.checked ? true : undefined }))}
                      className="rounded"
                    />
                    <span className="text-gray-300">Compressed Only</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={activeFilter.isActive === false}
                      onChange={(e) => setActiveFilter(prev => ({ ...prev, isActive: e.target.checked ? false : undefined }))}
                      className="rounded"
                    />
                    <span className="text-gray-300">Archived Only</span>
                  </label>
                </div>

                <button
                  onClick={() => setActiveFilter({})}
                  className="w-full text-xs text-gray-400 hover:text-epii-neon"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Bulk actions */}
          {selectedSessions.size > 0 && (
            <div className="p-4 border-b border-gray-700 bg-gray-800/50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">
                  {selectedSessions.size} selected
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleBulkOperation('export')}
                    className="px-2 py-1 text-xs bg-blue-600 text-blue-100 rounded hover:bg-blue-500"
                  >
                    <Download size={12} className="inline mr-1" />
                    Export
                  </button>
                  <button
                    onClick={() => handleBulkOperation('archive')}
                    className="px-2 py-1 text-xs bg-gray-600 text-gray-100 rounded hover:bg-gray-500"
                  >
                    <Archive size={12} className="inline mr-1" />
                    Archive
                  </button>
                  <button
                    onClick={() => handleBulkOperation('delete')}
                    className="px-2 py-1 text-xs bg-red-600 text-red-100 rounded hover:bg-red-500"
                  >
                    <Trash2 size={12} className="inline mr-1" />
                    Delete
                  </button>
                </div>
              </div>
              <button
                onClick={handleSelectAll}
                className="text-xs text-epii-neon hover:brightness-110 mt-2"
              >
                {selectedSessions.size === filteredSessions.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
          )}

          {/* Session list */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin h-8 w-8 border-2 border-epii-neon border-t-transparent rounded-full mx-auto"></div>
                <div className="mt-4 text-sm text-gray-400">Loading sessions...</div>
              </div>
            ) : filteredSessions.length === 0 ? (
              <div className="p-8 text-center">
                <MessageCircle size={48} className="mx-auto text-gray-600 mb-4" />
                <div className="text-sm text-gray-400">
                  {searchQuery || Object.keys(activeFilter).length > 0 ? 
                    'No sessions match your search criteria' : 
                    'No sessions found'
                  }
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-700">
                {sessionList}
              </div>
            )}
          </div>

          {/* Footer stats */}
          <div className="p-4 border-t border-gray-700 bg-gray-800/30">
            <div className="text-xs text-gray-400 text-center">
              Showing {filteredSessions.length} of {sessions.length} sessions
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionHistoryPanel;
/**
 * Agent Registration Service
 * Queries existing A2A registration systems to discover available agents and skills
 * 
 * Bimba Coordinate: #5-3-2 (Epii System Service Layer)
 */

interface RegistrationData {
  availableAgents: string[];
  availableSkills: SkillInfo[];
  chatSkills: SkillInfo[];
  agentSkillMap: Record<string, SkillInfo[]>;
}

interface SkillInfo {
  id: string;
  name: string;
  description: string;
  bimbaCoordinate: string;
  agentId: string;
  qlMetadata?: {
    qlPosition: number;
    qlMode?: string;
  };
}

class AgentRegistrationService {
  private registrationData: RegistrationData | null = null;
  private readonly BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
  private readonly A2A_BASE_URL = import.meta.env.VITE_A2A_URL || 'http://localhost:3033';
  private lastUpdate: Date | null = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Get registration data, querying backend if cache is stale
   */
  async getRegistrationData(): Promise<RegistrationData> {
    const now = new Date();
    
    // Return cached data if still fresh
    if (this.registrationData && this.lastUpdate && 
        (now.getTime() - this.lastUpdate.getTime()) < this.CACHE_DURATION) {
      return this.registrationData;
    }

    // Query fresh data from backend
    await this.refreshRegistrationData();
    return this.registrationData!;
  }

  /**
   * Refresh registration data from backend systems
   */
  async refreshRegistrationData(): Promise<void> {
    try {
      console.log('[AgentRegistrationService] Refreshing registration data...');
      
      // Query skills registry via A2A service
      const response = await fetch(`${this.A2A_BASE_URL}/api/registry/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: 'getRegistrationData'
        })
      });

      if (!response.ok) {
        throw new Error(`Registry query failed: ${response.statusText}`);
      }

      const registryData = await response.json();
      
      // Process the registration data
      this.registrationData = this.processRegistryData(registryData);
      this.lastUpdate = new Date();
      
      console.log('[AgentRegistrationService] Registration data refreshed:', {
        agents: this.registrationData.availableAgents.length,
        skills: this.registrationData.availableSkills.length,
        chatSkills: this.registrationData.chatSkills.length
      });

    } catch (error) {
      console.error('[AgentRegistrationService] Failed to refresh registration data:', error);
      
      // Fallback to default data if query fails
      this.registrationData = this.getDefaultRegistrationData();
      this.lastUpdate = new Date();
    }
  }

  /**
   * Process raw registry data into structured format
   */
  private processRegistryData(data: any): RegistrationData {
    const availableAgents = data.availableAgents || [];
    const availableSkills = data.availableSkills || [];
    
    // Filter chat skills
    const chatSkills = availableSkills.filter((skill: SkillInfo) =>
      skill.id.includes('chat') || skill.name.toLowerCase().includes('chat')
    );

    // Build agent-skill mapping
    const agentSkillMap: Record<string, SkillInfo[]> = {};
    for (const agent of availableAgents) {
      agentSkillMap[agent] = availableSkills.filter((skill: SkillInfo) => 
        skill.agentId === agent
      );
    }

    return {
      availableAgents,
      availableSkills,
      chatSkills,
      agentSkillMap
    };
  }

  /**
   * Get default registration data (known working configuration)
   */
  private getDefaultRegistrationData(): RegistrationData {
    // Based on what we know exists in the current system
    const epiiChatSkill: SkillInfo = {
      id: 'epii-chat',
      name: 'Epii Chat',
      description: 'Main chat interface for Epii agent',
      bimbaCoordinate: '#5',
      agentId: 'epii-agent',
      qlMetadata: { qlPosition: 5 }
    };

    return {
      availableAgents: ['epii-agent'],
      availableSkills: [epiiChatSkill],
      chatSkills: [epiiChatSkill],
      agentSkillMap: {
        'epii-agent': [epiiChatSkill]
      }
    };
  }

  /**
   * Get available agents
   */
  async getAvailableAgents(): Promise<string[]> {
    const data = await this.getRegistrationData();
    return data.availableAgents;
  }

  /**
   * Get available chat skills
   */
  async getAvailableChatSkills(): Promise<SkillInfo[]> {
    const data = await this.getRegistrationData();
    return data.chatSkills;
  }

  /**
   * Check if a specific agent exists
   */
  async hasAgent(agentId: string): Promise<boolean> {
    const agents = await this.getAvailableAgents();
    return agents.includes(agentId);
  }

  /**
   * Check if a specific skill exists
   */
  async hasSkill(skillId: string): Promise<boolean> {
    const data = await this.getRegistrationData();
    return data.availableSkills.some(skill => skill.id === skillId);
  }

  /**
   * Get the best available chat skill for a given preference
   */
  async getBestChatSkill(preferredSkillId?: string): Promise<SkillInfo> {
    const chatSkills = await this.getAvailableChatSkills();
    
    // If preferred skill exists, use it
    if (preferredSkillId) {
      const preferred = chatSkills.find(skill => skill.id === preferredSkillId);
      if (preferred) {
        return preferred;
      }
    }

    // Otherwise, return the first available chat skill
    if (chatSkills.length > 0) {
      return chatSkills[0];
    }

    // This should never happen with default data, but safety fallback
    throw new Error('No chat skills available');
  }

  /**
   * Force refresh of registration data
   */
  async forceRefresh(): Promise<void> {
    this.lastUpdate = null; // Invalidate cache
    await this.refreshRegistrationData();
  }
}

// Singleton instance
export const agentRegistrationService = new AgentRegistrationService();
export default agentRegistrationService;
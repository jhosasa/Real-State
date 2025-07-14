import { Agent } from '../types';
import { agentsData } from '../data/agents';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const agentService = {
  async getAgentById(id: string): Promise<Agent | null> {
    await delay(200);
    return agentsData.find(a => a.id === id) || null;
  },

  async getAgents(): Promise<Agent[]> {
    await delay(300);
    return [...agentsData];
  },

  async getTopAgents(limit: number = 5): Promise<Agent[]> {
    await delay(300);
    return agentsData
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  },

  async searchAgents(query: string): Promise<Agent[]> {
    await delay(300);
    const searchQuery = query.toLowerCase();
    
    return agentsData.filter(agent =>
      agent.name.toLowerCase().includes(searchQuery) ||
      agent.company.toLowerCase().includes(searchQuery) ||
      agent.specialties.some(specialty => 
        specialty.toLowerCase().includes(searchQuery)
      )
    );
  }
};
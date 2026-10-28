export type WorkRoleId = 'leadership' | 'managers' | 'team-members' | 'architects' | 'delivery' | 'risk' | 'operations'
export type Approach = 'Assistant' | 'Prediction' | 'Image review'
export interface WorkRole { id: WorkRoleId; name: string; question: string; focus: string; action: string; deliverable: string }
export interface WorkCase {
  slug: string; title: string; approach: Approach; benefit: string; before: string; ai: string; human: string;
  inputs: string[]; systems: string[]; metric: string; pilot: string; stop: string
}
export interface WorkSource { title: string; url: string; context: string }
export interface Industry {
  slug: string; name: string; icon: string; color: string; artwork: string; tagline: string; summary: string;
  data: string; stakes: string; proof: string; owner: string; roles: Record<WorkRoleId, string>;
  evolution: [string, string, string]; evidence: string; source: WorkSource; cases: WorkCase[]
}

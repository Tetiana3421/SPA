export interface Breed {
  id: string;
  name: string;
  species: 'cat' | 'dog';
  origin?: string;
  description?: string;
}
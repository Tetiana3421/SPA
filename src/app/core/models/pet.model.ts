export interface Pet {
  id: string;
  name: string;
  type: 'dog' | 'cat';
  breedId: string;
  age: number;
  weightKg: number;
  userId?: number;
  createdAt: number;
  notes?: string;

  // NEW:
  imageUrl?: string;         // фото тварини
  descriptionLong?: string;  // розширений опис (характер, звички)
}

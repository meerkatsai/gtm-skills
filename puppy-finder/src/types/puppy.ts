export type PuppySize = 'small' | 'medium' | 'large';
export type PuppySex = 'male' | 'female';
export type PuppyStatus = 'available' | 'pending' | 'adopted';
export type PuppyAgeUnit = 'weeks' | 'months' | 'years';

export interface PuppyAge {
  value: number;
  unit: PuppyAgeUnit;
}

export interface Puppy {
  id: string;
  name: string;
  breed: string;
  age: PuppyAge;
  size: PuppySize;
  sex: PuppySex;
  location: string;
  description: string;
  photoUrl: string;
  additionalPhotos?: string[];
  personality: string[];
  status: PuppyStatus;
  ownerName: string;
  ownerEmail: string;
  listedAt: string;
  isVaccinated: boolean;
  isNeutered: boolean;
}

export interface FilterState {
  query: string;
  breed: string;
  ageUnit: PuppyAgeUnit | '';
  size: PuppySize | '';
  location: string;
  status: PuppyStatus | '';
}

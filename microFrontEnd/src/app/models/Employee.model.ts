export interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    position: string;
    status: string;
    assignedTasks?: string;
    performanceRating: number;
    avatar?: string | null;
  }
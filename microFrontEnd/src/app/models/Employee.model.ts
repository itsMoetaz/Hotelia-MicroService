export interface Employee {
  _id?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  position?: string;
  status?: string;
  assignedTasks?: string;
  performanceRating?: number;
  avatar?: string | null;
  _links?: {
    self?: {
        href: string;
    },
    employee?: {
        href: string;
    }
};
}
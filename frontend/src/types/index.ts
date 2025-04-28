export interface User {
    _id: string;
    name: string;
    email: string;
    password?: string;
    createdAt?: string;
    updatedAt?: string;
  }


export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  createdAt: string;
}

 export interface Comment {
  _id: string;
  text: string;
  createdAt: string;
  createdBy: {
    name: string;
    email: string;
  };
}

export interface Task {
  _id: any;
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  createdAt: string;
}

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filter: 'all' | 'pending' | 'completed';
}

  
  export interface AuthState {
    user: User | null;
    token: string | null;
  }
  
  export interface ModalProps {
    task: any;
    handleClose: () => void;
    token: string | null;
    refreshTasks: any;
  }
  
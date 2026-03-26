
export const TASKS_KEY = '@todo:tasks';

export const TASK_STATE = {
  CREATING: 'creating',
  CREATED: 'created',
} as const;

export type TASK_STATE = (typeof TASK_STATE)[keyof typeof TASK_STATE];

export interface Task {
  id: string;
  title: string;
  concluded?: boolean;
  state?: TASK_STATE;
}
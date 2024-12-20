/**
 * Base context for the task manager
 * remember to extend the context with  specific context if needed
 */
export interface BaseContext {
  [key: string]: unknown;
}

export interface TaskInterface<T = BaseContext> {
  name: string;
  query: string;
  context?: T[];
}

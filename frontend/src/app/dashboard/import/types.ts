export type ImportState = 
  | 'empty'
  | 'uploading'
  | 'mapping'
  | 'validation'
  | 'preview'
  | 'duplicate_review'
  | 'importing'
  | 'success'
  | 'partial_success'
  | 'error';

export type ImportMethod = 'manual' | 'csv' | 'excel' | 'json';

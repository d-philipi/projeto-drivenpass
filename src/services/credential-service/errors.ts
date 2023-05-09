import { ApplicationError } from '../../protocols';

export function duplicatedTitleError(): ApplicationError {
  return {
    name: 'DuplicatedTitleError',
    message: 'There is already an credential with given title',
  };
}
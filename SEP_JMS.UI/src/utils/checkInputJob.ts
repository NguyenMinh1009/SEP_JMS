import { Error } from "../enums/validateInput";
import { dateToTicks } from "./Datetime";

const checkInputQuantity = (quantity: number) => {
  if (quantity === 0) {
    return Error.QUANTITY_BIGGER_0;
  }
  return null;
};

const checkInputDeadlineCreate = (deadline: any) => {
  let deadlineTisk = deadline ? dateToTicks(deadline.toDate()) : 0;
  if (deadlineTisk <= dateToTicks(new Date())) {
    return Error.DEADLINE_ERROR;
  }
  return null;
};

const checkInputDeadlineEdit = (deadline: any, createdTime: any) => {
  let deadlineTisk = deadline ? dateToTicks(deadline.toDate()) : 0;
  if (deadlineTisk <= createdTime) {
    return Error.DEADLINE_ERROR;
  }
  return null;
};
const checkInputCreateJob = (quantity: number, deadline: any) => {
  const quantityError = checkInputQuantity(quantity);
  const deadlineError = checkInputDeadlineCreate(deadline);

  const errors = [];

  if (quantityError) {
    errors.push(quantityError);
  }

  if (deadlineError) {
    errors.push(deadlineError);
  }

  return errors;
};

const checkInputEditJob = (quantity: number, deadline: any, createdTime: any) => {
  const quantityError = checkInputQuantity(quantity);
  const deadlineError = checkInputDeadlineEdit(deadline, createdTime);

  const errors = [];

  if (quantityError) {
    errors.push(quantityError);
  }

  if (deadlineError) {
    errors.push(deadlineError);
  }

  return errors;
};

export { checkInputCreateJob, checkInputEditJob };

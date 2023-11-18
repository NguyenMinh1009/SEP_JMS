import { JobStatusType } from "../enums/jobStatusType";
import { Error } from "../enums/validateInput";
import { dateToTicks } from "./Datetime";
import AlwayxInstance from "../api/AxiosInstance";
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

const checkStatusCompletedProjectEdit = async (taskId: any, jobStatusEdit: number) => {
  let successJob = 0;
  let totalJob = 0;
  let result = false;
  if (jobStatusEdit === JobStatusType.Completed) {
    await AlwayxInstance.get(`job/${taskId}/projectdetailstatistics`)
      .then(res => {
        successJob = res.data.successJob;
        totalJob = res.data.totalJob;
        result = successJob === totalJob ? true : false;
      })
      .catch(err => {
        console.error(err);
      });
    return result;
  } else {
    result = true;
    return result;
  }
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

export { checkInputCreateJob, checkInputEditJob, checkStatusCompletedProjectEdit };

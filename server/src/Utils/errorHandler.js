import { ZodError } from "zod";

export const handleControllerError = (res, error) => {
  let status = 500;
  let message = "Something went wrong";
  let errors = [];

  if (error instanceof ZodError) {
    status = 400;
    errors = error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
    message = "Validation failed";
  } else if (error.name === "ValidationError") {
    status = 400;
    errors = Object.values(error.errors).map((err) => ({
      path: err.path,
      message: err.message,
    }));
    message = "Validation failed";
  } else if (error.code === 11000) {
    const field = Object.keys(error.keyValue || {})[0];
    const value = error.keyValue?.[field];
    status = 409;
    errors = [
      {
        path: field,
        message: `Duplicate value '${value}' for field '${field}'`,
      },
    ];
    message = "Duplicate field value";
  } else if (error.name === "CastError") {
    status = 400;
    errors = [
      {
        path: error.path,
        message: `Invalid value for '${error.path}'`,
      },
    ];
    message = "Invalid ID";
  } else if (error instanceof Error && error.message) {
    status = 400;
    errors = [{ path: null, message: error.message }];
    message = error.message;
  }

  if (errors.length > 0) {
    message = errors.map((err) => err.message).join(", ");
  }

  return res.status(status).json({
    status,
    message,
    errors,
  });
};

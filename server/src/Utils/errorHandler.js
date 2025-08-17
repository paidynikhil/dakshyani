import { ZodError } from "zod";

export const handleControllerError = (res, error) => {
  let status = 500;
  let message = "Something went wrong";
  let errors = [];

  if (error instanceof ZodError) {
    status = 400;
    message = "Validation failed";
    errors = error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
  } else if (error.name === "ValidationError") {
    status = 400;
    message = "Validation failed";
    errors = Object.values(error.errors).map((err) => ({
      path: err.path,
      message: err.message,
    }));
  } else if (error.code === 11000) {
    const field = Object.keys(error.keyValue || {})[0];
    const value = error.keyValue?.[field];
    status = 409;
    message = "Duplicate field value";
    errors = [{ path: field, message: `Duplicate value '${value}' for field '${field}'` }];
  } else if (error.name === "CastError") {
    status = 400;
    message = "Invalid ID";
    errors = [{ path: error.path, message: `Invalid value for '${error.path}'` }];
  } else if (error instanceof Error && error.message) {
    status = 400;
    message = "Request error";
    errors = [{ path: null, message: error.message }];
  }

  return res.status(status).json({
    status,
    message,
    errors,
  });
};

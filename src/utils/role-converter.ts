import { Role } from "../types/authTypes";
import { ErrorResponse } from "./errorResponse";

export function toRole(value: string): Role {
  switch (value) {
    case "Admin":
      return Role.Admin;
    case "Organizer":
      return Role.Organizer;
    case "Participant":
      return Role.Participant;
    default:
      throw new ErrorResponse(`Invalid role value: ${value}`, 400);
  }
}

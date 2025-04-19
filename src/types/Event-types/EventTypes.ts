export interface PermissionLetterRequestBody {
  senderNamer: string;
  senderRole: string;
  senderOrganization: string;
  eventDate: Date;
  eventTime: string;
  eventLocation: string;
  letterLink: string;
}

export interface EventRequestBody {
  senderNamer: string;
  senderRole: string;
  senderOrganization: string;
  eventDate: Date;
  eventTime: string;
  eventLocation: string;
  letterLink: string;
}

export interface EventResponse {
  id: string;
  eventDate: Date;
  eventTime: string;
  eventLocation: string;
  eventName: string;
  eventDescription: string;
  bannerImage: string;
  senderNamer?: string;
  senderRole?: string;
  senderOrganization?: string;
  letterLink?: string;
  isApproved?: boolean;
  note?: string;
  eventType?: string;
  approvedLetterLink?: string;
}

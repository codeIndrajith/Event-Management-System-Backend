export interface EventRequestBody {
  senderNamer: string;
  senderRole: string;
  senderOrganization: string;
  eventDate: Date;
  eventTime: string;
  eventLocation: string;
  letterLink: string;
}

export interface EventApprovedRequestBody {
  eventId: string;
  approvedLetterLink?: string;
  note?: string;
  approverName: string;
  approverRole: string;
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
  isPublished?: boolean;
  note?: string;
  eventType?: string;
  approvedLetterLink?: string;
}

// Admin
export interface AddVenueRequestBody {
  venueName: string;
  locationType: "indoor" | "outdoor";
  maxAttendees: number;
}

export interface FilterOptions {
  venueName?: string;
  locationType?: "indoor" | "outdoor";
  maxAttendees?: number;
}

export interface FilteredVenueResponse {
  id: string;
  venueName: string;
  locationType: "indoor" | "outdoor";
  maxAttendees: number;
}

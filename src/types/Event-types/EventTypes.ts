export interface EventRequestBody {
  senderNamer: string;
  senderRole: string;
  senderOrganization: string;
  eventName: string;
  eventDate: Date;
  startTime: string;
  endTime: string;
  venuId: string;
  venue: string;
  letterLink: string;
}

export interface ApproveEventRequestBody {
  eventId: string;
  approvedLetterLink?: string;
  approverName: string;
  approverRole: string;
  isApproved: boolean;
  reason?: string;
}

export interface PublishEventRequestBody {
  eventId: string;
  // eventName: string;
  eventDescription: string;
  bannerImage: string;
  note: string;
  eventType: string;
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
  eventDescription: string | null;
  bannerImage: string | null;
  senderNamer?: string;
  senderRole?: string;
  senderOrganization?: string;
  letterLink?: string | null;
  isApproved?: boolean;
  isPublished?: boolean;
  note?: string | null;
  eventType?: string | null;
  approvedLetterLink?: string | null;
  reason?: string | null;
}

export interface PublishedEventDatesResponse {
  id: string;
  eventName: string;
  eventDate: Date;
}

export interface AddFavoriteEventRequestBody {
  eventId: string;
}

export interface UserFavouriteEventResponse {
  id: string;
  eventId: string;
  userId: string;
}

// Admin
export interface AddVenueRequestBody {
  venueName?: string;
  locationType?: "indoor" | "outdoor";
  maxAttendees?: number;
}

export interface FilterOptions {
  venueName?: string;
  locationType?: "indoor" | "outdoor";
  maxAttendees?: number;
  date: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
}

export interface VenueResponse {
  venueName?: string;
  locationType?: string;
  maxAttendees?: number;
}

export interface FilteredVenueResponse {
  id: string;
  venueName: string;
  locationType: "indoor" | "outdoor";
  maxAttendees: number;
}

export interface AdminDashboardDataServiceResponse {
  totalEvent: number;
  pendingEvents?: number;
  activeVenues: number;
  recentEvents?: Event;
}

export interface EventHistoryFilters {
  month?: number;
  year?: number;
  venueId?: string;
  eventType?: string;
}

export interface EventHistoryResponse {
  id: string;
  eventName: string;
  eventType: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: {
    id: string;
    venueName: string;
    locationType: string;
  };
  attendeesCount: number;
  status: string;
}

import {
  addVenuService,
  adminDashboardDataService,
  approveEventService,
  getAllVenuService,
  pendingApproveEventService,
  updateVenuService,
} from "../../services/adminService";
import { IRequest } from "../../types/authTypes";
import { ResponseFormat } from "../../types/public-types/resFormat.type";
import asyncHandler from "../../utils/asyncHandler";
import { Response, NextFunction } from "express";

const VenuController = asyncHandler(
  async (req: IRequest, res: Response<ResponseFormat>, next: NextFunction) => {
    const userId: string = `${req.user?.id}`;

    const isVenuAdd = await addVenuService(req.body, userId, next);

    if (isVenuAdd) {
      res.status(201).json({
        success: isVenuAdd,
        statusCode: 201,
        message: "Venu created",
      });
    }
  }
);

const GetAllVenuController = asyncHandler(
  async (req: IRequest, res: Response<ResponseFormat>, next: NextFunction) => {
    const pageNumber = parseInt(req.query.pageNumber as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 1000;
    const venueId = req.query.venueId as string;

    const venues = await getAllVenuService(pageNumber, pageSize, next, venueId);
    res.status(200).json({
      success: true,
      statusCode: 200,
      data: venues,
    });
  }
);

const UpdateVenuController = asyncHandler(
  async (req: IRequest, res: Response<ResponseFormat>, next: NextFunction) => {
    const venueId = req.params.venueId;
    const updateVenueMsg = await updateVenuService(req.body, venueId, next);
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: updateVenueMsg,
    });
  }
);

const GetAllPendingApprovedEventController = asyncHandler(
  async (req: IRequest, res: Response<ResponseFormat>, next: NextFunction) => {
    const limit = parseInt(req.query.limit as string) || 1000;
    const pendingApprovalEvents = await pendingApproveEventService(next, limit);

    res
      .status(200)
      .json({ success: true, statusCode: 200, data: pendingApprovalEvents });
  }
);

const ApprovedEventController = asyncHandler(
  async (req: IRequest, res: Response<ResponseFormat>, next: NextFunction) => {
    const approvedEventMsg = await approveEventService(next, req.body);

    res
      .status(200)
      .json({ success: true, statusCode: 200, message: approvedEventMsg });
  }
);

const AdminDashboardPageDataController = asyncHandler(
  async (req: IRequest, res: Response<ResponseFormat>, next: NextFunction) => {
    const dashboardData = await adminDashboardDataService(next);

    res
      .status(200)
      .json({ success: true, statusCode: 200, data: dashboardData });
  }
);

export {
  VenuController,
  ApprovedEventController,
  GetAllVenuController,
  GetAllPendingApprovedEventController,
  UpdateVenuController,
  AdminDashboardPageDataController,
};

const Facility = require("../models/facility");
const Request = require("../models/request");
const Report = require("../models/report");
const Announcement = require("../models/announcement");

module.exports = class TenantController {
  static async fetchAnnouncements(req, res) {
    try {
      const announcements = await Announcement.find();
      res.status(200).json(announcements);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
  static async fetchFacilities(req, res) {
    try {
      const facilities = await Facility.find();
      res.status(200).json(facilities);
    } catch (err) {
      res.status(400).json({ message: "There are no facilities" });
    }
  }

  static async fetchFacilityByID(req, res) {
    const id = req.params.id;
    try {
      const facility = await Facility.findById(id);
      if (!facility) {
        return res.status(404).json({ message: "This facility is not found" });
      }
      res.status(200).json(facility);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  static async createReport(req, res) {
    try {
      const report = req.body;

      const existingReport = await Report.findOne({
        title: report.title,
      });

      if (existingReport) {
        return res
          .status(400)
          .json({ message: "You have already made this report" });
      }

      const newReport = await Report.create(report);

      res
        .status(201)
        .json({ message: "Report created successfully", report: newReport });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  static async createRequest(req, res) {
    try {
      const request = req.body;
      const facilityId = req.params.id;

      const isLeased = await Request.findOne({
        facilityId: facilityId,
        $or: [
          {
            startDate: { $lte: request.endDate },
            endDate: { $gte: request.startDate },
          },
          {
            startDate: { $gte: request.startDate, $lte: request.endDate },
            endDate: { $gte: request.endDate },
          },
          {
            startDate: { $lte: request.startDate },
            endDate: { $lte: request.endDate, $gte: request.startDate },
          },
        ],
      });

      if (isLeased) {
        return res
          .status(400)
          .json({
            message: "This facility is already leased within this time",
          });
      }

      const newRequest = await Request.create(request);
      res
        .status(201)
        .json({ message: "Request created successfully", request: newRequest });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  static async fetchRequests(req, res) {
    try {
      const requests = await Request.findOne({ tenantId: req.body.tenantId });
      res.status(200).json(requests);
    } catch (err) {
      res.status(400).json({ message: "There are no requests" });
    }
  }
};
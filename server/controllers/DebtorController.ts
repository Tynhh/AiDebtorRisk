import type { Request, Response } from "express";
import { DebtorService } from "../services/DebtorService";
import { insertDebtorSchema } from "@shared/schema";

export class DebtorController {
  private debtorService: DebtorService;

  constructor() {
    this.debtorService = new DebtorService();
  }

  async getDebtor(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const debtor = await this.debtorService.getDebtorById(id);
      
      if (!debtor) {
        return res.status(404).json({ message: "Debtor not found" });
      }
      
      res.json(debtor);
    } catch (error) {
      console.error("Get debtor error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async createDebtor(req: Request, res: Response) {
    try {
      const debtorData = insertDebtorSchema.parse(req.body);
      const debtor = await this.debtorService.createDebtor(debtorData);
      res.status(201).json(debtor);
    } catch (error) {
      console.error("Create debtor error:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Invalid request data" 
      });
    }
  }

  async getDebtorAssessments(req: Request, res: Response) {
    try {
      const debtorId = parseInt(req.params.id);
      const assessments = await this.debtorService.getDebtorAssessments(debtorId);
      res.json(assessments);
    } catch (error) {
      console.error("Get debtor assessments error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

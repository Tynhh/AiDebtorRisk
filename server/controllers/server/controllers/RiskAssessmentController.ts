import type { Request, Response } from "express";
import { DebtorService } from "../services/DebtorService";
import { RiskAssessmentService } from "../services/RiskAssessmentService";
import { insertDebtorSchema } from "@shared/schema";

export class RiskAssessmentController {
  private debtorService: DebtorService;
  private riskAssessmentService: RiskAssessmentService;

  constructor() {
    this.debtorService = new DebtorService();
    this.riskAssessmentService = new RiskAssessmentService();
  }

  async predictDebtorRisk(req: Request, res: Response) {
    try {
      // Validate request body
      const debtorData = insertDebtorSchema.parse(req.body);
      
      // Create debtor record
      const debtor = await this.debtorService.createDebtor(debtorData);
      
      // Get risk prediction
      const riskResult = await this.riskAssessmentService.predictRisk(debtor);
      
      res.json(riskResult);
      
    } catch (error) {
      console.error("Risk prediction error:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Invalid request data" 
      });
    }
  }
}

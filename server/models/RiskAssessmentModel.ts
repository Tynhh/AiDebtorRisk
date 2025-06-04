import { storage } from "../storage";
import type { RiskAssessment, InsertRiskAssessment } from "@shared/schema";

export class RiskAssessmentModel {
  async findById(id: number): Promise<RiskAssessment | undefined> {
    return await storage.getRiskAssessment(id);
  }

  async findByDebtorId(debtorId: number): Promise<RiskAssessment[]> {
    return await storage.getRiskAssessmentsByDebtorId(debtorId);
  }

  async create(assessmentData: InsertRiskAssessment): Promise<RiskAssessment> {
    return await storage.createRiskAssessment(assessmentData);
  }
}

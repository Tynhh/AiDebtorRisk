import { storage } from "../storage";
import type { Debtor, InsertDebtor, RiskAssessment } from "@shared/schema";

export class DebtorModel {
  async findById(id: number): Promise<Debtor | undefined> {
    return await storage.getDebtor(id);
  }

  async findByIdNumber(idNumber: string): Promise<Debtor | undefined> {
    return await storage.getDebtorByIdNumber(idNumber);
  }

  async create(debtorData: InsertDebtor): Promise<Debtor> {
    return await storage.createDebtor(debtorData);
  }

  async getAssessments(debtorId: number): Promise<RiskAssessment[]> {
    return await storage.getRiskAssessmentsByDebtorId(debtorId);
  }
}

import { DebtorModel } from "../models/DebtorModel";
import { RiskAssessmentModel } from "../models/RiskAssessmentModel";
import type { Debtor, InsertDebtor, RiskAssessment } from "@shared/schema";

export class DebtorService {
  private debtorModel: DebtorModel;
  private riskAssessmentModel: RiskAssessmentModel;

  constructor() {
    this.debtorModel = new DebtorModel();
    this.riskAssessmentModel = new RiskAssessmentModel();
  }

  async getDebtorById(id: number): Promise<Debtor | undefined> {
    return await this.debtorModel.findById(id);
  }

  async getDebtorByIdNumber(idNumber: string): Promise<Debtor | undefined> {
    return await this.debtorModel.findByIdNumber(idNumber);
  }

  async createDebtor(debtorData: InsertDebtor): Promise<Debtor> {
    // Check if debtor with same ID number already exists
    const existingDebtor = await this.debtorModel.findByIdNumber(debtorData.idNumber);
    if (existingDebtor) {
      throw new Error("Debtor with this ID number already exists");
    }

    return await this.debtorModel.create(debtorData);
  }

  async getDebtorAssessments(debtorId: number): Promise<RiskAssessment[]> {
    // Verify debtor exists
    const debtor = await this.debtorModel.findById(debtorId);
    if (!debtor) {
      throw new Error("Debtor not found");
    }

    return await this.riskAssessmentModel.findByDebtorId(debtorId);
  }
}

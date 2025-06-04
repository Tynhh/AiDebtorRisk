import { RiskAssessmentModel } from "../models/RiskAssessmentModel";
import { DebtorModel } from "../models/DebtorModel";
import type { RiskPredictionResponse, InsertRiskAssessment, Debtor } from "@shared/schema";
import { riskPredictionResponseSchema } from "@shared/schema";

export class RiskAssessmentService {
  private riskAssessmentModel: RiskAssessmentModel;
  private debtorModel: DebtorModel;
  private readonly AI_API_URL: string;

  constructor() {
    this.riskAssessmentModel = new RiskAssessmentModel();
    this.debtorModel = new DebtorModel();
    this.AI_API_URL = process.env.AI_API_URL || "http://localhost:5000/api/predict-debtor-risk";
  }

  async predictRisk(debtor: Debtor): Promise<RiskPredictionResponse> {
    try {
      // Prepare data for external AI API
      const aiRequestData = {
        fullName: debtor.fullName,
        age: debtor.age || null,
        idNumber: debtor.idNumber,
        phone: debtor.phone || null,
        monthlyIncome: Number(debtor.monthlyIncome),
        debtAmount: Number(debtor.debtAmount),
        employmentStatus: debtor.employmentStatus,
        creditScore: debtor.creditScore || null,
        paymentHistory: debtor.paymentHistory || null,
      };

      // Call external AI API
      const response = await fetch(this.AI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.AI_API_KEY && { "Authorization": `Bearer ${process.env.AI_API_KEY}` }),
        },
        body: JSON.stringify(aiRequestData),
      });

      if (!response.ok) {
        throw new Error(`External AI API error: ${response.status} ${response.statusText}`);
      }

      const aiResult = await response.json();
      const validatedResult = riskPredictionResponseSchema.parse(aiResult);

      // Store risk assessment
      await this.saveRiskAssessment(debtor.id, validatedResult);

      return validatedResult;

    } catch (error) {
      console.error("External AI API error:", error);
      
      // Generate fallback assessment based on financial data
      const fallbackResult = this.generateFallbackAssessment(debtor);
      
      // Store fallback assessment
      await this.saveRiskAssessment(debtor.id, fallbackResult);
      
      return fallbackResult;
    }
  }

  private async saveRiskAssessment(debtorId: number, result: RiskPredictionResponse): Promise<void> {
    const assessmentData: InsertRiskAssessment = {
      debtorId,
      riskScore: result.riskScore,
      riskLevel: result.riskLevel,
      riskFactors: result.riskFactors ? JSON.stringify(result.riskFactors) : null,
      recommendations: result.recommendations ? JSON.stringify(result.recommendations) : null,
    };

    await this.riskAssessmentModel.create(assessmentData);
  }

  private generateFallbackAssessment(debtor: Debtor): RiskPredictionResponse {
    const debtToIncomeRatio = Number(debtor.debtAmount) / Number(debtor.monthlyIncome);
    let riskScore: number;
    let riskLevel: "LOW" | "MEDIUM" | "HIGH";

    // Calculate risk based on debt-to-income ratio
    if (debtToIncomeRatio <= 0.3) {
      riskScore = Math.floor(Math.random() * 30) + 1; // 1-30
      riskLevel = "LOW";
    } else if (debtToIncomeRatio <= 0.6) {
      riskScore = Math.floor(Math.random() * 40) + 31; // 31-70
      riskLevel = "MEDIUM";
    } else {
      riskScore = Math.floor(Math.random() * 30) + 71; // 71-100
      riskLevel = "HIGH";
    }

    // Adjust risk based on employment status
    if (debtor.employmentStatus === "unemployed") {
      riskScore = Math.min(riskScore + 20, 100);
      if (riskScore > 70) riskLevel = "HIGH";
    }

    // Adjust risk based on credit score
    if (debtor.creditScore && debtor.creditScore < 600) {
      riskScore = Math.min(riskScore + 15, 100);
      if (riskScore > 70) riskLevel = "HIGH";
    }

    return {
      riskScore,
      riskLevel,
      riskFactors: [
        {
          name: "Debt-to-Income Ratio",
          impact: debtToIncomeRatio > 0.5 ? "High Impact" : debtToIncomeRatio > 0.3 ? "Medium Impact" : "Low Impact",
          score: Math.min(debtToIncomeRatio * 100, 100),
          description: `Current ratio of ${(debtToIncomeRatio * 100).toFixed(1)}% ${debtToIncomeRatio > 0.5 ? "indicates potential payment difficulties" : "is within acceptable range"}`,
        },
        {
          name: "Employment Status",
          impact: debtor.employmentStatus === "unemployed" ? "High Impact" : "Medium Impact",
          score: debtor.employmentStatus === "employed" ? 20 : debtor.employmentStatus === "self-employed" ? 40 : 80,
          description: debtor.employmentStatus === "employed" ? "Stable employment status" : "Employment status may affect payment capability",
        },
        ...(debtor.creditScore ? [{
          name: "Credit Score",
          impact: debtor.creditScore < 600 ? "High Impact" : debtor.creditScore < 700 ? "Medium Impact" : "Low Impact",
          score: debtor.creditScore < 600 ? 80 : debtor.creditScore < 700 ? 50 : 20,
          description: `Credit score of ${debtor.creditScore} ${debtor.creditScore < 600 ? "indicates poor credit history" : debtor.creditScore < 700 ? "shows fair credit standing" : "demonstrates good credit history"}`,
        }] : []),
      ],
      recommendations: [
        "Monitor payment patterns closely",
        debtToIncomeRatio > 0.5 ? "Consider restructuring payment terms" : "Maintain current payment schedule",
        "Request regular income verification",
        ...(debtor.employmentStatus === "unemployed" ? ["Require employment verification before extending credit"] : []),
        ...(debtor.creditScore && debtor.creditScore < 600 ? ["Implement stricter monitoring due to poor credit history"] : []),
      ],
    };
  }
}

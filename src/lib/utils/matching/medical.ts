interface MedicalTests {
  serumCreatinine: number;
  egfr: number;
}

export function evaluateMedicalTests(tests: MedicalTests): number {
  let score = 0;

  // Evaluate Serum Creatinine
  if (tests.serumCreatinine < 1.5) {
    score += 10;
  }

  // Evaluate eGFR
  if (tests.egfr > 60) {
    score += 10;
  }

  return score;
}
export const meanPooling = (embeddings: number[], tokensCount: number, dimsCount: number) => {
  const meanVector = new Array(dimsCount).fill(0);

  // Сумуємо всі токени
  for (let i = 0; i < tokensCount; i++) {
    for (let j = 0; j < dimsCount; j++) {
      meanVector[j] += embeddings[i * dimsCount + j];
    }
  }

  // Ділимо на кількість токенів
  for (let j = 0; j < dimsCount; j++) {
    meanVector[j] /= tokensCount;
  }

  return meanVector;
}
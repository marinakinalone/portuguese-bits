const removeAccents = (str: string) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

export const checkAnswer = (input: string, answer: string) => {
  const normalizedInput = removeAccents(input.toLowerCase());
  const normalizedAnswer = removeAccents(answer.toLowerCase());
  return normalizedInput === normalizedAnswer;
};

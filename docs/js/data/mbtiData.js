let cachedData;

export async function loadMbtiData() {
  if (cachedData) return cachedData;
  const [questionsMnResponse, questionsEnResponse, typesMnResponse, typesEnResponse, dimensionsResponse] = await Promise.all([
    fetch("./assets/data/questions-mn.json"),
    fetch("./assets/data/questions-en.json"),
    fetch("./assets/data/types-mn.json"),
    fetch("./assets/data/types-en.json"),
    fetch("./assets/data/dimensions-mn.json")
  ]);
  if (!questionsMnResponse.ok || !questionsEnResponse.ok || !typesMnResponse.ok || !typesEnResponse.ok || !dimensionsResponse.ok) {
    throw new Error("MBTI өгөгдөл уншигдсангүй.");
  }
  const [questionsMn, questionsEn, typesMn, typesEn, dimensions] = await Promise.all([
    questionsMnResponse.json(), questionsEnResponse.json(), typesMnResponse.json(), typesEnResponse.json(), dimensionsResponse.json()
  ]);
  cachedData = { questions: { mn: questionsMn, en: questionsEn }, types: { mn: typesMn, en: typesEn }, dimensions };
  return cachedData;
}

export function getType(types, code) {
  return types.find((item) => item.type === code);
}

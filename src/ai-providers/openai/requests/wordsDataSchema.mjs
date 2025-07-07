export const wordsDataSchema = {
  type: "function",
  function: {
    name: "generate_words_data",
    description: "Generates structured linguistic data for a list of German words",
    parameters: {
      type: "object",
      properties: {
        words_data: {
          type: "array",
          description: "Linguistic information for each word",
          items: {
            type: "object",
            properties: {
              word: {
                type: "string",
                description: "The German word"
              },
              part_of_speech: {
                type: "string",
                enum: ["noun", "verb", "adjective", "other"],
                description: "Part of speech"
              },
              regularity: {
                type: "string",
                enum: ["regular", "irregular", "n/a"],
                description: "Regularity (only meaningful for verbs)"
              },
              forms: {
                type: "string",
                description: "Key forms depending on part of speech"
              },
              translation: {
                type: "array",
                description: "Up to 7 Russian translations",
                items: { type: "string" },
                minItems: 1,
                maxItems: 7
              },
              example: {
                type: "string",
                description: "Example sentence with the word replaced by '_____'"
              }
            },
            required: [
              "word",
              "part_of_speech",
              "regularity",
              "forms",
              "translation",
              "example"
            ]
          }
        }
      },
      required: ["words_data"]
    }
  }
};

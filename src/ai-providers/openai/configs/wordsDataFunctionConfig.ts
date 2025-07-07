interface WordDataFunctionProperties {
  id: {
    type: "number";
    description: "The index of the word in the input array (starting from 0)";
  };
  word: {
    type: "string";
    description: "The German word";
  };
  part_of_speech: {
    type: "string";
    description: "Part of speech";
  };
  regularity: {
    type: "string";
    description: "Regularity (only meaningful for verbs)";
  };
  forms: {
    type: "string";
    description: "Key forms depending on part of speech";
  };
  translation: {
    type: "array";
    description: "Up to 7 Russian translations";
    items: { type: "string" };
  };
  example: {
    type: "string";
    description: "Example sentence with the word replaced by '_____'";
  };
}

export const wordsDataFunctionConfig = {
  type: "function",
  function: {
    name: "generate_words_data",
    description: "Generates structured linguistic data for a list of German words",
    parameters: {
      type: "object",
      properties: {
        count: {
          type: "number",
          description: "Total number of processed words"
        },
        words_data: {
          type: "array",
          description: "Linguistic information for each word",
          items: {
            type: "object",
            properties: {
              id: {
                type: "number",
                description: "The index of the word in the input array (starting from 0)"
              },
              word: {
                type: "string",
                description: "The German word"
              },
              part_of_speech: {
                type: "string",
                description: "Part of speech"
              },
              regularity: {
                type: "string",
                description: "Regularity (only meaningful for verbs)"
              },
              forms: {
                type: "string",
                description: "Key forms depending on part of speech"
              },
              translation: {
                type: "array",
                description: "Up to 7 Russian translations",
                items: { type: "string" }
              },
              example: {
                type: "string",
                description: "Example sentence with the word replaced by '_____'"
              }
            } as WordDataFunctionProperties,
            required: [
              "id",
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
      required: ["count", "words_data"]
    }
  }
} as const;

export const DIALOG_FUNCTION_SCHEMA = {
  type: "function",
  function: {
    name: "generate_dialog",
    description: "Generates a German A2-level dialog",
    parameters: {
      type: "object",
      properties: {
        dialog: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
              speaker: { type: "string" },
              text: { type: "string" }
            },
            required: ["id", "speaker", "text"]
          }
        }
      },
      required: ["dialog"]
    }
  }
};

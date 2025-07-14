export interface DialogFunctionConfig {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: {
      type: string; 
      properties: {
        dialog: {
          type: string;
          items: {
            type: string;
            properties: {
              id: { type: string };
              speaker: { type: string };
              text: { type: string };
            };
            required: string[];
          };
        };
      };
      required: string[];
    };
  };
}

export const dialogFunctionConfig: DialogFunctionConfig = {
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

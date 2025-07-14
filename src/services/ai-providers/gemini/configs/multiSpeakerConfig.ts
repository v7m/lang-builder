export const GEMINI_FEMALE_VOICES = [
  "Achernar",
  "Aoede",
  "Autonoe",
  "Callirrhoe",
  "Despina",
  "Erinome",
  "Gacrux",
  "Kore",
  "Laomedeia",
  "Leda",
  "Pulcherrima",
  "Sulafat",
  "Vindemiatrix",
  "Zephyr"
];

export const GEMINI_MALE_VOICES = [
  "Achird",
  "Algenib",
  "Algieba",
  "Alnilam",
  "Charon",
  "Enceladus",
  "Fenrir",
  "Iapetus",
  "Orus",
  "Puck",
  "Rasalgethi",
  "Sadachbia",
  "Sadaltager",
  "Schedar",
  "Umbriel",
  "Zubenelgenubi"
];

interface VoiceConfig {
  prebuiltVoiceConfig: {
    voiceName: string;
  };
}

interface SpeakerVoiceConfig {
  speaker: "Female" | "Male";
  voiceConfig: VoiceConfig;
}

export interface MultiSpeakerConfig {
  responseModalities: ["AUDIO"];
  speechConfig: {
    multiSpeakerVoiceConfig: {
      speakerVoiceConfigs: SpeakerVoiceConfig[];
    };
  };
}

export const multiSpeakerConfig = (femaleVoice: string, maleVoice: string): MultiSpeakerConfig => {
  return {
    responseModalities: ["AUDIO"],
    speechConfig: {
      multiSpeakerVoiceConfig: {
        speakerVoiceConfigs: [
          {
            speaker: "Female",
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: femaleVoice
              }
            }
          },
          {
            speaker: "Male",
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: maleVoice
              }
            }
          }
        ]
      }
    }
  }
};

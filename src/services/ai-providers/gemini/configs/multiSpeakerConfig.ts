const GEMINI_FEMALE_VOICE = "Kore";
const GEMINI_MALE_VOICE = "Puck";

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

export const multiSpeakerConfig: MultiSpeakerConfig = {
  responseModalities: ["AUDIO"],
  speechConfig: {
    multiSpeakerVoiceConfig: {
      speakerVoiceConfigs: [
        {
          speaker: "Female",
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: GEMINI_FEMALE_VOICE
            }
          }
        },
        {
          speaker: "Male",
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: GEMINI_MALE_VOICE
            }
          }
        }
      ]
    }
  }
};

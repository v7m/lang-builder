const GEMINI_FEMALE_VOICE = "Kore";
const GEMINI_MALE_VOICE = "Puck";

export const multiSpeakerConfig = {
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

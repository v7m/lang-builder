const GEMINI_FEMALE_VOICE = "Kore";
const GEMINI_MALE_VOICE = "Puck";

export const multiSpeakerConfig = {
  generationConfig: {
    responseModalities: ['AUDIO'],
    speechConfig: {
      multiSpeakerVoiceConfig: [
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
  },
};

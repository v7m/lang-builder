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

# LangBuilder (SprachBauer)

A tool that helps in learning foreign languages by generating comprehensive learning materials from a list of words. It creates a complete learning package that includes:

> **Note:** Currently only supports German language. Support for other languages is planned for future releases.

## How It Works

The tool leverages powerful AI models to generate three types of learning materials:

1. **Word Analysis** (via OpenAI GPT)
   - Takes your word list from `input/words_list.txt`
   - Processes each word to extract comprehensive information
   - Outputs a structured CSV file ready for Anki import
   - Perfect for spaced repetition learning

2. **Text Generation** (via OpenAI GPT)
   - Uses analyzed words to create a context-rich text
   - Automatically selects dialogue or monologue format
   - Ensures natural language flow and proper word usage
   - Enhances reading comprehension skills

3. **Speech Synthesis** (via Google Gemini)
   - Processes the generated text into natural speech
   - Applies appropriate voice selection (multiple voices for dialogues)
   - Creates the final WAV audio file
   - Provides essential listening practice

This multi-modal approach combines all outputs into a complete learning package:
- Word definitions in CSV format for Anki cards creation
- Context-rich text/dialogue in TXT format for reading practice
- Natural speech audio in WAV format for pronunciation and listening

## Setup

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd speech-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create configuration files:
   ```bash
   cp data/generation_meta.example.json data/generation_meta.json
   cp input/words_list.example.txt input/words_list.txt
   ```

4. Add your API keys to `.env`:
   ```
   OPENAI_API_KEY=your_key_here
   GEMINI_API_KEY=your_key_here
   ```

## Usage

1. Add your target words to `input/words_list.txt`, one word per line

2. Generate learning materials:
   ```bash
   npm run generate -- --all
   ```
3. Find generated files in the `output` directory:
   ```
   output/
   └── generation_1_03.02.2024/
       ├── word_definitions_1_03.02.2024.csv  # Import to Anki
       ├── dialog_text_1_03.02.2024.txt       # Read for context
       └── speech_1_03.02.2024.wav            # Listen for pronunciation
   ```

## Project Structure

```
lang-builder/
├── data/                # Generation metadata
├── input/               # Input word lists
├── output/              # Generated learning materials
├── prompts/             # AI generation templates
└── src/
    ├── ai-providers/    # AI service integrations
    │   ├── gemini/      # Gemini API integration
    │   └── openai/      # OpenAI API integration
    ├── services/        # Core services
    ├── scripts/         # CLI scripts
    └── utils/           # Helper utilities
```

## Features

- **Comprehensive Word Analysis**
  - Word forms and variations
  - Part of speech identification
  - Multiple translations
  - Natural usage examples
  - Currently optimized for German language

- **Natural Text Generation**
  - Context-rich dialogues or monologues
  - Natural flow and conversation
  - Meaningful use of target words

- **High-Quality Speech**
  - Clear pronunciation
  - Natural intonation
  - Multiple voices for dialogues

- **Learning-Optimized Output**
  - Anki-ready CSV format
  - Organized by generation sessions
  - All materials linked by generation number

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

# Zylla AI Backend

Zylla AI is an official student assistant chatbot for Landmark Metropolitan University Institute (LMUI), Buea. This repository contains the backend services for Zylla, built with Node.js, Express, and integrated with Google's Gemini AI model.

## Features

- **AI-Powered Responses**: Utilizes Google's Gemini AI model to provide accurate and helpful answers to student inquiries.
- **Factual Context Extraction**: Intelligently extracts factual information from previous conversations to provide more relevant responses.
- **Text-based Chat**: Supports text-based questions and provides concise, friendly responses.
- **Audio Transcription (Planned)**: Includes a placeholder for audio input processing and transcription using Gemini.
- **CORS Enabled**: Configured to allow cross-origin requests for flexible frontend integration.

## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web application framework for Node.js.
- **TypeScript**: Superset of JavaScript that adds static typing.
- **@google/genai**: Google's official library for interacting with Gemini AI.
- **Multer**: Middleware for handling `multipart/form-data`, primarily used for file uploads (e.g., audio files).
- **Dotenv**: Loads environment variables from a `.env` file.
- **CORS**: Middleware to enable Cross-Origin Resource Sharing.

## Project Structure

- `src/index.ts`: Main entry point of the application, sets up the Express server and middleware.
- `src/routes/zylla.ts`: Defines API routes for handling text and audio (planned) interactions with Zylla.
- `src/components/model.ts`: Contains the core logic for interacting with the Gemini AI model, including `askZylla` for text-based responses and `askZyllaWithAudio` for audio transcription.
- `src/chatHistory.ts`: Manages the conversation history for the chatbot.
- `uploads/`: Directory for temporary storage of uploaded files (e.g., audio).

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/zylla-backend.git
   cd zylla-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory of the project and add your Google Gemini API key:
   ```
   GEMINI_API_KEY=YOUR_GEMINI_API_KEY
   ```
   Replace `YOUR_GEMINI_API_KEY` with your actual API key obtained from Google AI Studio or Google Cloud.

### Running the Application

1. **Build the TypeScript code:**
   ```bash
   npm run build
   ```

2. **Start the server:**
   ```bash
   npm start
   ```
   The server will start on `http://localhost:5000` (or the port specified in your `.env` file).

### Development

For development with hot-reloading:

```bash
npm run dev
```

## API Endpoints

- `GET /`: Returns a simple message indicating the server is running.
- `POST /askZylla/text`:
  - **Description**: Sends a text question to Zylla AI and receives a text response.
  - **Request Body**:
    ```json
    {
      "question": "Your question here"
    }
    ```
  - **Response**:
    ```json
    {
      "response": "Zylla's answer"
    }
    ```
- `POST /askZylla/ask-audio`:
  - **Description**: (Planned) Uploads an audio file for transcription and processing by Zylla AI.
  - **Request Body**: `multipart/form-data` with an `audio` field containing the audio file.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.

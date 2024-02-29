# Chat-PDF Website

Welcome to the Chat-PDF website project! This platform allows users to interact with their PDF documents through a chat interface. The project leverages various technologies to provide a seamless and efficient user experience.

## Technologies Used

### AWS S3 for PDF Storage
PDFs are securely stored on AWS S3, ensuring seamless access and reliability.

### Pinecone DB for Metadata
Metadata extracted from the documents is intelligently organized using Pinecone DB. This enables efficient retrieval through vector search, making the search process faster and more accurate.

#### How VECTOR SEARCH Works
Vector search is a method based on representing documents as vectors in a high-dimensional space. Similar documents are close to each other in this space, enabling efficient and accurate search, even with a large number of documents.

### NeonDB for User and Chat Data
The robust backend relies on NeonDB, managed via Drizzle ORM. This ensures seamless handling of user and chat data.

### Gemini-AI API Integration
The power of conversation and text embedding is provided by the Gemini-AI API. A custom prompt is used to make conversations more natural, dynamic, and accurate.

## Project Setup

To set up the project, follow these steps:

1. Copy the provided `.env.example` file to `.env`.
2. Generate API keys for the following services:
    - Clerk
    - PineconeDB
    - GeminiAPI
    - NeonDB
    - AWS

    Make a list of these keys and provide the corresponding links to the websites where users can obtain them.

3. Set up your Next.js project by running the following commands:

```bash
# Install dependencies
npm install

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


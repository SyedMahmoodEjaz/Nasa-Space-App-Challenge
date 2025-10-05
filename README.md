# Nasa Space App Challenge

Decode the secrets of cosmos: Interactive Exploration and Feature Discovery in NASA's Astronomical Imagery.

🚀 Project Overview
This project was developed for the NASA International Space Apps Challenge 2025 in response to a challenge likely focused on Data Visualization and Citizen Science.

Our solution addresses the critical need to make complex astronomical imagery immediately understandable and interactive by leveraging cutting-edge AI to provide real-time feature identification, layered data visualization, and user-driven content creation.

Key Features
Interactive Image Selection: Users can seamlessly transition between high-resolution images of planets, moons, and deep space objects (e.g., Jupiter, Andromeda Galaxy, Mars Dust Storms).

AI-Powered Search: Users can describe a visual feature on the image (e.g., "these white lines on the planet"), and the AI instantly analyzes the image, identifies the feature, and returns a detailed scientific explanation and location coordinates.

Layered Data Overlays: Toggle between different scientific datasets (e.g., thermal, atmospheric data) represented as color-coded overlays, enhancing pattern recognition and analysis.

User Annotation & Labeling: Allows citizen scientists to click directly on an image, pinpoint a feature, and add custom labels and descriptions to contribute to community knowledge.


💡 How It Works (The Core Logic)
1. Data Ingestion & Display
The application fetches raw, high-resolution astronomical images from the Google Gemini API for on-demand image analysis with layered NASA datasets and citizen-science annotation tools. These images are loaded into the main viewer, which handles smooth zooming, panning, and rendering.

2. AI-Powered Feature Identification 
Gemini API Call: When a user enters a natural language query (e.g., "what is that large white spot?"), the application sends the base image data (as a Base64 string) and the user's text prompt to the Gemini API.

Multimodal Analysis: Gemini analyzes the image's content based on the text prompt, locates the described feature, and generates a scientifically accurate, synthesized description, providing immediate context.

#in order to use

🏁 Getting Started
Prerequisites
You must have Node.js and npm installed.

npm install

Running Locally
Set Environment Variables:
Create a file named .env in the root directory and add your Google Gemini API Key.

GEMINI_API_KEY="YOUR_API_KEY_HERE"

Start the Application:

npm run dev
# or npm start


3. Layers and Annotation
Processed insights (AI locations, coordinate data) and manual user inputs (annotations) are managed and rendered as dynamic overlays on the base image, allowing for a personalized and cumulative learning experience.

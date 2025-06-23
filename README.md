# Movie Review Sentiment Analysis

A web application for analyzing the sentiment of movie reviews using a rule-based approach.

## Features

- **User-Friendly Interface**: Easy-to-use web interface for submitting movie reviews
- **Two-Page Structure**:
  - Home page with a form for review input
  - Results page for displaying analysis
- **Rule-Based Sentiment Analysis**: Analyzes text based on positive and negative word lists
- **Responsive Design**: Works on various devices and screen sizes

## Technology Stack

- **Frontend**: React, React Router, Tailwind CSS
- **Backend**: Node.js (HTTP server)

## Setup and Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Quick Start

```bash
# clone repository
 git clone https://github.com/himuexe/Sentiment-Analysis
 cd Sentiment-Analysis
```

#### Backend Setup
```bash
cd backend
npm install
npm start # runs on port 3002
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev # runs on port 5173
```

## How It Works

### Sentiment Analysis Approach

The application uses a rule-based approach for sentiment analysis:

1. **Word Lists**:
   - Maintains lists of positive and negative words
   - Counts occurrences in the review text
   - Handles negations (e.g., "not good")

2. **Scoring System**:
   - Calculates confidence based on the ratio of positive to negative words
   - Provides detailed explanations of the sentiment determination

3. **Result Presentation**:
   - Clear visualization of sentiment (positive, negative, or neutral)
   - Confidence scores and word counts
   - Detailed breakdown of the analysis

## Usage

1. Open the web application in your browser
2. On the Home page, enter a movie review in the text area
3. Click "Analyze Sentiment"
4. The application will navigate to the Results page showing:
   - Sentiment determination (positive, negative, or neutral)
   - Confidence score
   - Detailed explanation of the sentiment analysis
5. Click "Analyze Another Review" to return to the Home page

## Project Structure

```
Sentiment-Analysis/
├── backend/
│   ├── server.js              # API server
│   ├── sentiment.js           # Rule-based sentiment analysis
│   └── hybrid-sentiment.js    # Sentiment analysis wrapper
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx   # Home page with input form
│   │   │   └── ResultsPage.jsx # Results page for displaying analysis
│   │   ├── App.jsx            # Main application component with routing
│   │   └── main.jsx           # Application entry point
```

## Future Enhancements

- Database integration to store reviews and results
- User accounts for tracking personal review history
- Enhanced visualization of sentiment patterns
- Expanded word lists for better accuracy
- Context-aware sentiment analysis

## License

This project is licensed under the MIT License - see the LICENSE file for details.
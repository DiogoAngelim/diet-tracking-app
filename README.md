# Diet Tracking App
![Coveralls](https://coveralls.io/repos/github/DiogoAngelim/diet-tracking-app/badge.svg?branch=main)

A diet tracking app with OCR receipt scanning, nutrition analytics, customizable targets, and browser-integrated notifications. Want more?

---

## Features
- **OCR Receipt Scanning**: Extract food items and nutrition from receipts using your own AI key – no nutritionist needed.
- **Customizable Nutrition Targets**: Set your own daily macro and micronutrient goals 
- **Nutrition Analytics**: Visualize your intake and trends with charts.
- **Notifications**: Get browser and in-app alerts for all important events.
- **Budget Tracking**: Monitor your weekly food all your spending.
- **Mobile-First UI**: Responsive and extremely easy to use on any device.

---

## Getting Started

### 1. Clone the Repository
```sh
git clone https://github.com/your-username/diet-tracking-app.git
cd diet-tracking-app
```

### 2. Install Dependencies
```sh
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set Up Environment Variables
Copy the example file and fill in your API keys:
```sh
cp .env.example .env
```

#### Required Variables in `.env`:
- `OPENAI_API_KEY` – Enter your OpenAI API key
- `GOOGLE_APPLICATION_CREDENTIALS` – Enter the path to your Google Cloud Vision JSON credentials file

##### How to Get API Keys:
- **OpenAI API Key**:  
  1. Sign up at [OpenAI](https://platform.openai.com/signup).
  2. Go to [API Keys](https://platform.openai.com/api-keys) and create a new key.
  3. Copy and paste it into your `.env` file.
- **Google Cloud Vision Credentials**:  
  1. Go to [Google Cloud Console](https://console.cloud.google.com/).
  2. Create a project and enable the Vision API.
  3. Go to IAM & Admin > Service Accounts, create a new account, and generate a key (JSON format).
  4. Download the JSON file and set the path in your `.env`.

---

### 4. Run the App in Development
```sh
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

### 5. Build for Production
```sh
npm run build
npm start
```

---

## OCR & AI Features
- The app uses OpenAI for advanced text normalization and Google Vision for OCR.
- Make sure your API keys are valid and you have sufficient quota.

---

## Security & Privacy
- Your API keys and credentials are never committed to git (see `.gitignore`).
- Sensitive files like your `JSON` file should also be ignored.

---

## Troubleshooting
- **Notifications not working?** Allow browser notifications when prompted.
- **OCR not working?** Check your Google credentials and API quota.
- **Build errors?** Ensure Node.js 18+ and all dependencies are installed.

---

## Contributing
Pull requests and issues are welcome! Open an issue for bugs or feature requests.

---

## License
MIT

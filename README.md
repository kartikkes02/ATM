# ATM Simulator 💰
A web-based ATM simulator with banking transactions, currency exchange, and transaction history tracking.

![ATM Simulator Preview](atm.jpg)

## Features ✨

### 🛡️ User Authentication
- Card insertion with PIN verification
- New card registration
- PIN attempt limits (3 attempts before card block)
- 60-second session timeout

### 💳 Banking Operations
- Deposit money
- Withdraw money (with quick amount options)
- Real-time balance check
- Transaction history view
- PDF account statement download

### 🌍 Currency Exchange
- Convert between USD and 5 currencies:
  - EUR (Euro)
  - GBP (British Pound)
  - JPY (Japanese Yen)
  - CAD (Canadian Dollar)
  - AUD (Australian Dollar)
- Real-time exchange rate calculation
- Detailed exchange receipts

### 🔒 Security Features
- Local storage for user data
- Masked card numbers (XXXX XXXX XXXX 1234)
- Transaction receipts with timestamps

## Technologies Used 🛠️

- HTML5
- CSS3 (with responsive design)
- JavaScript (ES6)
- jsPDF library for PDF generation

## How to Use 🚀

1. **Open** `index.html` in any modern browser
2. **Welcome Screen**:
   - Existing users: Click "Insert Card"
   - New users: Click "Register New Card"
3. **For Existing Cards**:
   - Enter 4-digit PIN
   - Access main menu for transactions
4. **For New Cards**:
   - Complete registration form:
     - Full name
     - 16-digit card number
     - 4-digit PIN
     - Bank selection
     - Optional initial deposit
   - Automatically logged in after registration

## Project Structure 📂
atm-simulator/
├── index.html # Main application interface
├── style.css # All styling components
├── app.js # Core application logic
└── atm.jpg # Background image (optional)

## Customization Options 🎨

Easily modify:
- `exchangeRates` in app.js for currency values
- Bank options in registration form
- Quick withdrawal amounts
- Session timeout duration (default: 60s)
- Maximum PIN attempts (default: 3)

## Screens Overview 📱

1. Welcome Screen
2. Card Registration
3. PIN Entry
4. Main Menu
5. Deposit
6. Withdrawal
7. Transaction History
8. Receipt
9. Currency Exchange
10. Exchange Confirmation

## Important Notes ⚠️

- All data persists in browser's localStorage
- Clears when browser cache is cleared
- Simulation only - no real banking connections
- For demonstration/educational purposes

## Future Enhancements 🔮

- More currency options
- Inter-account transfers
- Admin interface
- Enhanced mobile experience
- Biometric authentication

## License 📜

Free to use and modify (Open Source)

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## Contact
If you have any questions or suggestions, please open an issue in the GitHub repository.

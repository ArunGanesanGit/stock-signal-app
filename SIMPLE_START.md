# 🚀 SIMPLEST START - Run One Command

## Prerequisites
You need **Node.js** installed (one-time, takes 5 minutes)

### Install Node.js

**Mac:**
- Go to https://nodejs.org/
- Click "LTS" (Long Term Support)
- Download and run installer
- Restart your terminal

**Windows:**
- Go to https://nodejs.org/
- Click "LTS" 
- Download and run installer
- Restart your computer

**Linux (Ubuntu/Debian):**
```bash
sudo apt update && sudo apt install nodejs npm
```

### Verify Installation
Open terminal and run:
```bash
node --version
npm --version
```

Both should show version numbers (no errors).

---

## Run the Application

Once Node.js is installed, just run:

```bash
cd /Users/arunganesan/Documents/workspace/stock-signal-app
bash run.sh
```

That's it! 

Wait 20-30 seconds and then open: **http://localhost:3000**

---

## How to Use

1. **Open** http://localhost:3000
2. **Enter** a stock ticker: AAPL, MSFT, GOOGL, TSLA, or AMZN
3. **Click** "Analyze"
4. **See** Buy/Sell/Hold signal with breakdown

---

## To Stop

Press: **Ctrl + C**

---

## Troubleshooting

**"npm: command not found"**
- Node.js isn't installed
- Install from https://nodejs.org/

**"Port 3000/5000 already in use"**
- Close other applications using those ports
- Or wait 10 seconds and run again

**"Stuck loading"**
- Wait another 30 seconds (first start is slower)
- Refresh browser page

**Still stuck?**
- Try: `bash run.sh` again
- Check internet connection
- Restart computer

---

## That's All!

Really, that's everything needed. One command does it all. 🎉

Happy trading! 📈

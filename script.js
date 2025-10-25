// ===== STATE MANAGEMENT =====
let state = {
    currentTheme: 'light',
    isListening: false,
    recognition: null,
    chatHistory: [],
    messageIdCounter: 0,
    menuOpen: false,
    analytics: {
        messagessent: 0,
        calculatorUsed: 0,
        contactFormOpened: 0,
        chatExported: 0,
        themeToggled: 0,
        voiceUsed: 0
    }
};

// ===== ANALYTICS =====
function trackEvent(eventName, eventData = {}) {
    console.log('📊 Analytics Event:', eventName, eventData);
    
    // Update local analytics
    if (state.analytics.hasOwnProperty(eventName)) {
        state.analytics[eventName]++;
    }
    
    // Here you would send to your analytics service (Google Analytics, Mixpanel, etc.)
    // Example for Google Analytics 4:
    // gtag('event', eventName, eventData);
    
    // Example for custom backend:
    // fetch('/api/analytics', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ event: eventName, data: eventData, timestamp: new Date().toISOString() })
    // });
}

function getAnalytics() {
    return {
        ...state.analytics,
        totalMessages: state.chatHistory.length,
        sessionDuration: Date.now() - sessionStart
    };
}

const sessionStart = Date.now();

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeSpeechRecognition();
    initializeScrollDetection();
    animateWelcomeMessage();
    
    // Close menu when clicking outside
    document.addEventListener('click', handleOutsideClick);
    
    trackEvent('sessionStarted');
});

function initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        state.recognition = new SpeechRecognition();
        state.recognition.continuous = false;
        state.recognition.interimResults = false;
        
        state.recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            document.getElementById('userInput').value = transcript;
            stopVoice();
            trackEvent('voiceUsed');
        };
        
        state.recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            stopVoice();
        };
        
        state.recognition.onend = function() {
            stopVoice();
        };
    } else {
        document.getElementById('voiceBtn').style.display = 'none';
    }
}

function initializeScrollDetection() {
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.addEventListener('scroll', function() {
        const scrollBottom = document.getElementById('scrollBottom');
        const isScrolledUp = this.scrollHeight - this.scrollTop - this.clientHeight > 100;
        scrollBottom.classList.toggle('visible', isScrolledUp);
    });
}

function animateWelcomeMessage() {
    setTimeout(() => {
        const firstMessage = document.querySelector('.message');
        if (firstMessage) firstMessage.style.opacity = '1';
    }, 100);
}

function handleOutsideClick(event) {
    const menu = document.getElementById('menuDropdown');
    const toggle = document.getElementById('menuToggle');
    
    if (menu && toggle && !menu.contains(event.target) && !toggle.contains(event.target)) {
        closeMenu();
    }
}

// ===== THEME MANAGEMENT =====
function toggleTheme() {
    const body = document.body;
    const toggle = document.getElementById('themeToggle');
    
    state.currentTheme = state.currentTheme === 'light' ? 'dark' : 'light';
    
    if (state.currentTheme === 'dark') {
        body.classList.add('dark-theme');
        toggle.textContent = '☀️';
        showToast('Dark theme activated 🌙');
    } else {
        body.classList.remove('dark-theme');
        toggle.textContent = '🌙';
        showToast('Light theme activated ☀️');
    }
    
    trackEvent('themeToggled', { theme: state.currentTheme });
}

// ===== MENU MANAGEMENT =====
function toggleMenu() {
    state.menuOpen = !state.menuOpen;
    const menu = document.getElementById('menuDropdown');
    const toggle = document.getElementById('menuToggle');
    
    menu.classList.toggle('active', state.menuOpen);
    toggle.textContent = state.menuOpen ? '✕' : '☰';
}

function closeMenu() {
    state.menuOpen = false;
    const menu = document.getElementById('menuDropdown');
    const toggle = document.getElementById('menuToggle');
    
    menu.classList.remove('active');
    toggle.textContent = '☰';
}

// ===== VOICE INPUT =====
function toggleVoice() {
    if (state.isListening) {
        stopVoice();
    } else {
        startVoice();
    }
}

function startVoice() {
    if (state.recognition) {
        try {
            state.isListening = true;
            document.getElementById('voiceBtn').classList.add('listening');
            state.recognition.start();
            showToast('Listening... 🎤');
        } catch (error) {
            console.error('Voice recognition error:', error);
            stopVoice();
        }
    }
}

function stopVoice() {
    if (state.recognition && state.isListening) {
        try {
            state.isListening = false;
            document.getElementById('voiceBtn').classList.remove('listening');
            state.recognition.stop();
        } catch (error) {
            console.error('Error stopping recognition:', error);
        }
    }
}

// ===== CONTACT FORM =====
function openContactForm() {
    const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSf0bvHj2dJ3mAQo_FX-cdfG4md5pvnybIXOLCs67uYlFbIy7Q/viewform';
    window.open(formUrl, '_blank');
    
    trackEvent('contactFormOpened');
    
    setTimeout(() => {
        addMessage("I've opened our contact form in a new tab! Please fill it out and our solar experts will reach out to you within 24 hours. Feel free to ask me any other questions!", false);
    }, 300);
}

// ===== CALCULATOR =====
function showCalculator() {
    const calculatorHTML = `
        <div class="calculator-container">
            <h3>☀️ Solar Savings Calculator</h3>
            <div class="calc-input-group">
                <label>Monthly Electric Bill ($)</label>
                <input type="number" id="electricBill" placeholder="e.g., 150" value="150" min="0">
            </div>
            <div class="calc-input-group">
                <label>Average Sunlight Hours/Day</label>
                <input type="number" id="sunHours" placeholder="e.g., 5" value="5" step="0.5" min="0" max="12">
            </div>
            <div class="calc-input-group">
                <label>System Size (kW)</label>
                <select id="systemSize">
                    <option value="5">5 kW (Small - $15,000)</option>
                    <option value="7" selected>7 kW (Medium - $21,000)</option>
                    <option value="10">10 kW (Large - $30,000)</option>
                </select>
            </div>
            <div class="calc-input-group">
                <label>State</label>
                <select id="state">
                    <option value="0.1">California (High Incentives)</option>
                    <option value="0.08" selected>Texas (Medium Incentives)</option>
                    <option value="0.05">Florida (Standard Incentives)</option>
                    <option value="0.03">Other States</option>
                </select>
            </div>
            <button class="calc-button" onclick="calculateSavings()">Calculate My Savings 🚀</button>
            <div class="calc-results" id="calcResults"></div>
        </div>
    `;
    addCustomMessage(calculatorHTML, false);
    showToast('Calculator loaded! Fill in your details 📊');
    trackEvent('calculatorUsed');
}

function calculateSavings() {
    const electricBill = parseFloat(document.getElementById('electricBill')?.value) || 150;
    const sunHours = parseFloat(document.getElementById('sunHours')?.value) || 5;
    const systemSize = parseFloat(document.getElementById('systemSize')?.value) || 7;
    const stateIncentive = parseFloat(document.getElementById('state')?.value) || 0.08;
    
    // Input validation
    if (electricBill <= 0 || sunHours <= 0) {
        showToast('Please enter valid positive numbers');
        return;
    }
    
    // Calculations
    const systemCost = systemSize * 3000;
    const federalTaxCredit = systemCost * 0.30;
    const stateIncentiveAmount = systemCost * stateIncentive;
    const netCost = systemCost - federalTaxCredit - stateIncentiveAmount;
    
    const annualProduction = systemSize * sunHours * 365 * 0.75;
    const annualSavings = electricBill * 12;
    const paybackYears = (netCost / annualSavings).toFixed(1);
    const lifetime25Savings = (annualSavings * 25 - netCost).toFixed(0);
    const monthlyPayment = (netCost / 180).toFixed(0); // 15-year loan
    
    const resultsHTML = `
        <div class="result-item">
            <div class="result-label">System Cost (Before Incentives)</div>
            <div class="result-value">${systemCost.toLocaleString()}</div>
        </div>
        <div class="result-item">
            <div class="result-label">Federal Tax Credit (30%)</div>
            <div class="result-value">-${federalTaxCredit.toLocaleString()}</div>
        </div>
        <div class="result-item">
            <div class="result-label">State Incentives</div>
            <div class="result-value">-${stateIncentiveAmount.toLocaleString()}</div>
        </div>
        <div class="result-item">
            <div class="result-label">Net Cost</div>
            <div class="result-value">${netCost.toLocaleString()}</div>
        </div>
        <div class="result-item">
            <div class="result-label">Annual Savings</div>
            <div class="result-value">${annualSavings.toLocaleString()}</div>
        </div>
        <div class="result-item">
            <div class="result-label">Monthly Loan Payment (15yr)</div>
            <div class="result-value">${monthlyPayment}/mo</div>
        </div>
        <div class="result-item">
            <div class="result-label">Payback Period</div>
            <div class="result-value">${paybackYears} years</div>
        </div>
        <div class="result-item">
            <div class="result-label">25-Year Savings</div>
            <div class="result-value" style="color: #4CAF50; font-size: 24px;">${lifetime25Savings.toLocaleString()} 🎉</div>
        </div>
    `;
    
    const resultsDiv = document.getElementById('calcResults');
    if (resultsDiv) {
        resultsDiv.innerHTML = resultsHTML;
        resultsDiv.classList.add('show');
        showToast('Calculations complete! 💰');
        
        setTimeout(() => scrollToBottom(), 100);
        
        trackEvent('calculationCompleted', {
            systemSize,
            estimatedSavings: lifetime25Savings,
            paybackYears
        });
    }
}

// ===== CHAT EXPORT =====
function exportChat() {
    if (state.chatHistory.length === 0) {
        showToast('No messages to export! 📭');
        return;
    }
    
    let exportText = '=== SolarBot Chat Transcript ===\n';
    exportText += `Date: ${new Date().toLocaleString()}\n`;
    exportText += `Total Messages: ${state.chatHistory.length}\n`;
    exportText += '=================================\n\n';
    
    state.chatHistory.forEach((msg) => {
        const role = msg.role === 'user' ? 'You' : 'SolarBot';
        const time = new Date(msg.timestamp).toLocaleTimeString();
        exportText += `[${time}] ${role}:\n${msg.content}\n\n`;
    });
    
    exportText += '=================================\n';
    exportText += 'Generated by SolarBot - Your Solar Energy Assistant\n';
    
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SolarBot_Chat_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Chat exported successfully! 📥');
    trackEvent('chatExported', { messageCount: state.chatHistory.length });
}

// ===== CHAT MANAGEMENT =====
function clearChat() {
    if (!confirm('Are you sure you want to clear the chat history?')) {
        return;
    }
    
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.innerHTML = '';
    state.chatHistory = [];
    state.messageIdCounter = 0;
    
    setTimeout(() => {
        const welcomeMsg = document.createElement('div');
        welcomeMsg.className = 'message bot';
        welcomeMsg.style.opacity = '0';
        welcomeMsg.innerHTML = `
            <div class="avatar">☀️</div>
            <div class="message-content">
                Hello! I'm SolarBot, your AI-powered solar energy assistant! 🌟 I can help you understand solar panels, calculate potential savings, schedule appointments, and answer all your renewable energy questions. How can I help you today?
            </div>
        `;
        chatContainer.appendChild(welcomeMsg);
        setTimeout(() => welcomeMsg.style.opacity = '1', 10);
    }, 100);
    
    updateSuggestions('');
    showToast('Chat cleared! 🗑️');
    trackEvent('chatCleared');
}

// ===== MESSAGE HANDLING =====
function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    
    if (message === '') return;
    
    addMessage(message, true);
    input.value = '';
    
    trackEvent('messageSent', { messageLength: message.length });
    
    showTypingIndicator();
    
    setTimeout(() => {
        const response = getResponse(message);
        hideTypingIndicator();
        addMessage(response, false);
        input.focus();
    }, 1000 + Math.random() * 500);
}

function sendSuggestion(text) {
    document.getElementById('userInput').value = text;
    sendMessage();
}

function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function addMessage(content, isUser) {
    const chatContainer = document.getElementById('chatContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    messageDiv.style.opacity = '0';
    const currentMessageId = state.messageIdCounter++;
    messageDiv.setAttribute('data-message-id', currentMessageId);
    
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = isUser ? '👤' : '☀️';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = content;
    
    if (isUser) {
        messageDiv.appendChild(messageContent);
        messageDiv.appendChild(avatar);
    } else {
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
    }
    
    chatContainer.appendChild(messageDiv);
    
    state.chatHistory.push({
        role: isUser ? 'user' : 'assistant',
        content: content,
        timestamp: new Date().toISOString()
    });
    
    setTimeout(() => {
        messageDiv.style.opacity = '1';
    }, 10);
    
    scrollToBottom();
    
    if (!isUser) {
        updateSuggestions(content.toLowerCase());
    }
}

function addCustomMessage(htmlContent, isUser) {
    const chatContainer = document.getElementById('chatContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    messageDiv.style.opacity = '0';
    
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = isUser ? '👤' : '☀️';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.innerHTML = htmlContent;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
    
    chatContainer.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.opacity = '1';
    }, 10);
    
    scrollToBottom();
}

function showTypingIndicator() {
    const chatContainer = document.getElementById('chatContainer');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator active';
    typingDiv.id = 'typingIndicator';
    
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = '☀️';
    
    const dotsDiv = document.createElement('div');
    dotsDiv.className = 'typing-dots';
    dotsDiv.innerHTML = '<span></span><span></span><span></span>';
    
    typingDiv.appendChild(avatar);
    typingDiv.appendChild(dotsDiv);
    chatContainer.appendChild(typingDiv);
    scrollToBottom();
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

// ===== RESPONSE GENERATION =====
function getResponse(userMessage) {
    const msg = userMessage.toLowerCase();
    
    if (/calculat|savings|estimate|how much.*save/i.test(msg)) {
        setTimeout(() => showCalculator(), 500);
        return "Great! Let me pull up the solar savings calculator for you. Just fill in your details and I'll calculate your potential savings, payback period, and 25-year benefits! 🧮";
    }
    
    if (/schedule|appointment|consult|book|meet|visit/i.test(msg)) {
        setTimeout(() => openContactForm(), 500);
        return "Excellent! I'd be happy to help you schedule a consultation. Let me open our contact form where you can share your availability and preferences. Our solar experts typically respond within 24 hours!";
    }
    
    if (/contact|call|email|reach|speak|talk.*someone/i.test(msg)) {
        setTimeout(() => openContactForm(), 500);
        return "Perfect! I've opened our contact form in a new tab. Please fill it out and our solar experts will reach out to you within 24 hours. Is there anything else I can help you with?";
    }
    
    if (/(^|\s)(hi|hello|hey|greetings|good morning|good afternoon|good evening)($|\s|!)/i.test(msg)) {
        const greetings = [
            "Hello! Great to meet you! I'm SolarBot, your AI solar assistant. I can help you calculate savings, answer questions, and connect you with our expert team. What would you like to know about solar energy?",
            "Hey there! Thanks for chatting with me! I'm here to help you explore solar options. I can run calculations, explain benefits, or schedule a consultation. What interests you most?",
            "Hi! Welcome! I'm excited to help you discover solar energy. Whether you want to calculate potential savings, learn about costs, or speak with an expert, I'm here to help. What can I do for you today?"
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    if (/why|benefit|advantage|should i|worth it|good idea|pros/i.test(msg)) {
        const benefits = [
            "Solar panels offer incredible benefits! Financially, most homeowners save $20,000-$75,000 over 25 years, with systems paying for themselves in 6-10 years. Your home value increases by 3-4%, and you'll enjoy energy independence. Environmentally, you're directly fighting climate change - a typical system offsets 3-4 tons of CO2 annually! Plus, with current 30% federal tax credits, there's never been a better time. Want to use our calculator to see your specific savings?",
            "Great question! The advantages are substantial: dramatically reduced electricity bills, protection from rising energy costs, increased property value, and real environmental impact. Most systems pay for themselves in 6-10 years through savings. With incentives and financing options available, going solar is more accessible than ever! Want to calculate your potential savings?",
            "There are so many reasons to go solar! You'll save thousands over the system's 25+ year lifespan, lock in low energy costs, boost your home's value, and help fight climate change. Plus, solar technology is proven and reliable. With 30% tax credits available, it's a smart financial decision! Want to see the numbers for your home?"
        ];
        return benefits[Math.floor(Math.random() * benefits.length)];
    }
    
    if (/cost|price|expensive|afford|pay|money|dollar|investment|financing/i.test(msg)) {
        const costs = [
            "Great question! A typical residential system runs $15,000-$25,000 before incentives. The federal tax credit immediately reduces that by 30%, and many states offer additional rebates. Most homeowners pay $10,500-$17,500 effectively. You can finance with $0 down, and monthly payments are often less than your electric bill. The system pays for itself in 6-10 years! Want to use our calculator for exact numbers?",
            "Solar costs have dropped dramatically! The average system costs around $18,000 before incentives. With the 30% federal tax credit, that's about $12,600. Financing options make solar accessible with $0 down. You're trading your utility payment for a solar payment that leads to ownership. After 6-10 years, you have free electricity! Want to calculate your specific costs?",
            "Investing in solar is more affordable than ever! While systems cost $15,000-$25,000 upfront, the 30% federal tax credit plus state incentives can cut that significantly. Most people finance, paying less monthly than their old electric bill. Over 25-30 years, you'll save $40,000-$100,000! Try our calculator to see your savings!"
        ];
        return costs[Math.floor(Math.random() * costs.length)];
    }
    
    if (/(how.*work|technology|science|function|panel.*work)/i.test(msg)) {
        return "Solar panels use photovoltaic cells made of silicon that absorb sunlight. When photons hit these cells, they knock electrons loose, creating DC electrical current. An inverter converts this to AC power for your home. On sunny days, excess power flows back to the grid, earning you credits! Even on cloudy days, modern panels generate 15-20% of peak power. It's completely automated!";
    }
    
    if (/environment|climate|carbon|green|clean|planet|eco|sustainable|pollution/i.test(msg)) {
        return "The environmental impact is phenomenal! Every year, a typical system prevents 3-4 tons of CO2 emissions - equivalent to planting 100 trees annually. Over 25 years, that's 100+ tons of CO2 offset! Solar produces zero air pollution, uses no water, and directly combats climate change. You're reducing demand for fossil fuels and helping create a cleaner planet!";
    }
    
    if (/thank|thanks|appreciate/i.test(msg)) {
        return "You're very welcome! I'm always happy to help people discover solar benefits. Is there anything else you'd like to know, or would you like to use our calculator or speak with our team?";
    }
    
    if (/bye|goodbye|see you|gotta go|later/i.test(msg)) {
        return "Thanks for chatting! I hope I've helped you understand why solar is such a smart investment. Feel free to return anytime with questions. Have a sunny day! ☀️";
    }

    if (/financing|loan|payment plan|monthly payment/i.test(msg)) {
        return "Financing solar is easier than ever! Most providers offer $0 down with monthly payments often lower than your current electric bill. Options include solar loans (own the system, get tax credits), solar leases (no upfront cost, fixed monthly rate), and power purchase agreements (pay only for energy produced). Many homeowners qualify instantly, and the 30% federal tax credit can be applied to reduce your loan amount. Want to use our calculator to see estimated monthly payments?";
    }

    if (/roof|installation|install/i.test(msg)) {
        return "Most roofs are perfect for solar! Ideal conditions include south-facing with minimal shade, but east and west-facing roofs work great too. Installation typically takes 1-3 days after permits are approved. The entire process from consultation to activation averages 2-3 months. Modern mounting systems don't damage your roof - they're designed to protect it! Solar panels can even extend your roof's life by shielding it from weather. Want to schedule a free roof assessment?";
    }

    const redirects = [
        "That's interesting! While my expertise is solar energy, I'm happy to chat. Since you're here, have you considered using our calculator to see potential savings? I can also answer questions or connect you with our expert team!",
        "Good question! I specialize in solar energy, but I can try to help. Speaking of which, would you like to learn about solar benefits? Try our calculator or ask me anything!",
        "Thanks for asking! While solar energy is my specialty, I'm here for friendly conversation too. Would you like to calculate potential savings, schedule a consultation, or explore what solar could do for you?"
    ];

    return redirects[Math.floor(Math.random() * redirects.length)];
}

// ===== SUGGESTIONS =====
function updateSuggestions(context) {
    const suggestionsContainer = document.getElementById('suggestionsContainer');
    let suggestions = [];

    if (context.includes('cost') || context.includes('price') || context.includes('afford')) {
        suggestions = [
            { display: '💳 Financing options', query: 'How can I afford solar panels?' },
            { display: '🧮 Calculate savings', action: () => showCalculator() },
            { display: '⏱️ Payback period', query: 'How long until solar pays for itself?' },
            { display: '📧 Contact us', action: () => openContactForm() }
        ];
    } else if (context.includes('schedule') || context.includes('appointment') || context.includes('consult')) {
        suggestions = [
            { display: '📧 Fill contact form', action: () => openContactForm() },
            { display: '💬 More questions', query: 'I have more questions first' },
            { display: '💰 Costs', query: 'How much do solar panels cost?' },
            { display: '🧮 Calculator', action: () => showCalculator() }
        ];
    } else if (context.includes('calculator') || context.includes('savings')) {
        suggestions = [
            { display: '📅 Book appointment', query: 'Schedule a consultation' },
            { display: '💡 Why solar?', query: 'Why should I get solar panels?' },
            { display: '💰 Financing', query: 'What financing options are available?' },
            { display: '📧 Contact', action: () => openContactForm() }
        ];
    } else {
        suggestions = [
            { display: '💡 Why solar?', query: 'Why should I get solar panels?' },
            { display: '💰 Costs', query: 'How much do solar panels cost?' },
            { display: '📅 Book appointment', query: 'Schedule a consultation' },
            { display: '🧮 Calculate savings', action: () => showCalculator() }
        ];
    }

    suggestionsContainer.innerHTML = '';
    suggestions.forEach((item, index) => {
        const btn = document.createElement('button');
        btn.className = 'suggestion-btn';
        btn.textContent = item.display;
        
        if (item.action) {
            btn.onclick = item.action;
        } else {
            btn.onclick = () => sendSuggestion(item.query);
        }
        
        btn.style.animationDelay = `${index * 0.1}s`;
        suggestionsContainer.appendChild(btn);
    });
}

// ===== UTILITIES =====
function scrollToBottom() {
    const chatContainer = document.getElementById('chatContainer');
    setTimeout(() => {
        chatContainer.scrollTo({
            top: chatContainer.scrollHeight,
            behavior: 'smooth'
        });
    }, 100);
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #4CAF50;
        color: white;
        padding: 12px 24px;
        border-radius: 25px;
        font-size: 14px;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// ===== EXPORT ANALYTICS FUNCTION =====
window.getSolarBotAnalytics = getAnalytics;

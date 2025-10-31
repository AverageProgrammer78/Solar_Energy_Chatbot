// Roof condition impact
    let roofCostNote = '';
    if (roofCondition === 'poor') {
        roofCostNote = '<div class="result-note warning">Note: Your roof may need replacement before solar installation (additional $8,000-$15,000)</div>';
    } else if (roofCondition === 'fair') {
        roofCostNote = '<div class="result-note info">Your roof should last through installation, but consider replacement within 10 years</div>';
    }
    
    // Calculate production and savings
    const annualProduction = recommendedSystemSize * 1000 * stlSunHours * 365 * shadingFactor * 0.78; // 78% system efficiency
    const annualSavings = (annualProduction / 1000) * stlElectricRate;
    const paybackYears = (netCost / annualSavings).toFixed(1);
    const lifetime25Savings = (annualSavings * 25 - netCost).toFixed(0);
    const monthlyPayment = (netCost / 180).toFixed(0); // 15-year loan
    const monthlySavings = (annualSavings / 12).toFixed(0);
    
    // Environmental impact
    const co2Offset = (annualProduction / 1000 * 0.7).toFixed(1); // tons of CO2 per year
    const treesEquivalent = Math.round(co2Offset * 16.5); // trees planted equivalent
    
    const resultsHTML = `
        ${roofCostNote}
        <div class="result-highlight">
            <div class="result-label">Recommended System Size for Your Home</div>
            <div class="result-value" style="font-size: 28px; color: #ff8c00;">${recommendedSystemSize} kW</div>
            <small style="color: var(--text-secondary);">Optimized for ${homeSize} sq ft in St. Louis</small>
        </div>
        
        <div class="result-section-title">Cost Breakdown</div>
        <div class="result-item">
            <div class="result-label">System Cost (Before Incentives)</div>
            <div class="result-value">${systemCost.toLocaleString()}</div>
            <small>${recommendedSystemSize} kW × ${(costPerWatt * 1000).toLocaleString()} = ${systemCost.toLocaleString()}</small>
        </div>
        <div class="result-item">
            <div class="result-label">Federal Tax Credit (30%)</div>
            <div class="result-value" style="color: #10a37f;">-${federalTaxCredit.toLocaleString()}</div>
        </div>
        <div class="result-item">
            <div class="result-label">Missouri State Rebate (5%)</div>
            <div class="result-value" style="color: #10a37f;">-${stateRebate.toLocaleString()}</div>
        </div>
        <div class="result-item highlight">
            <div class="result-label">Your Net Investment</div>
            <div class="result-value" style="font-size: 24px;">${netCost.toLocaleString()}</div>
        </div>
        
        <div class="result-section-title">Annual Production & Savings</div>
        <div class="result-item">
            <div class="result-label">Estimated Annual Production</div>
            <div class="result-value">${(annualProduction / 1000).toLocaleString()} kWh</div>
            <small>Based on ${stlSunHours} sun hours/day in St. Louis${shadingFactor < 1 ? ` (adjusted for ${roofShading} shading)` : ''}</small>
        </div>
        <div class="result-item">
            <div class="result-label">Annual Savings (Ameren Missouri rates)</div>
            <div class="result-value">${annualSavings.toLocaleString()}</div>
            <small>~${monthlySavings}/month in electricity savings</small>
        </div>
        
        <div class="result-section-title">Financial Summary</div>
        <div class="result-item">
            <div class="result-label">Monthly Loan Payment (15-year, 4.5% APR)</div>
            <div class="result-value">${monthlyPayment}/month</div>
            <small>Your monthly savings (${monthlySavings}) can offset this payment!</small>
        </div>
        <div class="result-item">
            <div class="result-label">Payback Period</div>
            <div class="result-value">${paybackYears} years</div>
        </div>
        <div class// ===== STATE MANAGEMENT =====
let state = {
    currentUser: null,
    currentChatId: null,
    currentTheme: 'light',
    isListening: false,
    recognition: null,
    chatHistory: {},
    messageIdCounter: 0,
    sidebarOpen: false,
    analytics: {
        messagessent: 0,
        calculatorUsed: 0,
        contactFormOpened: 0,
        chatExported: 0,
        themeToggled: 0,
        voiceUsed: 0
    }
};

const sessionStart = Date.now();

// Demo users database (in production, this would be server-side)
const USERS_DB = {
    'demo': { password: 'demo123', name: 'Demo User' },
    'admin': { password: 'admin123', name: 'Admin' },
    'user': { password: 'user123', name: 'Test User' }
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    checkExistingSession();
    initializeSpeechRecognition();
    initializeScrollDetection();
});

// ===== MOTIVATIONAL BANNER =====
const motivationalQuotes = [
    "Welcome back! Every sunny day is an opportunity to save with solar energy.",
    "The best time to go solar was yesterday. The second best time is today!",
    "Your journey to energy independence starts here. Let's explore your solar potential!",
    "St. Louis gets 4.5 hours of peak sunlight daily - perfect for solar savings!",
    "Going solar is one of the smartest investments you can make for your home.",
    "The sun provides more energy in one hour than the world uses in a year. Let's harness it!",
    "Join hundreds of St. Louis families already saving with solar energy.",
    "Energy independence is just a conversation away. How can I help today?",
    "The future is bright - and it's powered by solar energy!",
    "Your roof is valuable real estate. Let's make it work for you!",
    "Small steps today lead to big savings tomorrow. Ready to explore solar?",
    "Solar panels aren't an expense - they're an investment in your future.",
    "Did you know? Solar panels can increase your home value by 3-4%!",
    "The sun is free - let's help you capture its power and reduce your bills!",
    "Every kilowatt-hour generated by solar is a step toward a cleaner planet."
];

function showMotivationalBanner() {
    const banner = document.getElementById('motivationalBanner');
    const bannerText = document.getElementById('bannerText');
    
    if (!banner || !bannerText) return;
    
    // Check if banner was closed in this session
    const bannerClosed = sessionStorage.getItem('banner_closed');
    if (bannerClosed) {
        banner.classList.add('hidden');
        return;
    }
    
    // Select random quote
    const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    bannerText.textContent = quote;
    
    banner.classList.remove('hidden');
}

function closeBanner() {
    const banner = document.getElementById('motivationalBanner');
    banner.classList.add('hidden');
    sessionStorage.setItem('banner_closed', 'true');
}

// Show banner when app loads
function showAppWithBanner() {
    showApp();
    setTimeout(() => showMotivationalBanner(), 500);
}

// ===== AUTHENTICATION =====
function checkExistingSession() {
    const savedUser = localStorage.getItem('solarbot_user');
    if (savedUser) {
        state.currentUser = savedUser;
        loadUserData();
        showApp();
    }
}

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    if (USERS_DB[username] && USERS_DB[username].password === password) {
        state.currentUser = username;
        localStorage.setItem('solarbot_user', username);
        
        loadUserData();
        showApp();
        showToast(`Welcome back, ${USERS_DB[username].name}!`);
        trackEvent('userLoggedIn');
    } else {
        showToast('Invalid username or password');
        document.getElementById('password').value = '';
    }
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        saveCurrentChat();
        
        localStorage.removeItem('solarbot_user');
        state.currentUser = null;
        state.currentChatId = null;
        
        document.getElementById('loginContainer').style.display = 'flex';
        document.getElementById('appContainer').style.display = 'none';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        
        showToast('Logged out successfully');
        trackEvent('userLoggedOut');
    }
}

function showApp() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('appContainer').style.display = 'flex';
    document.getElementById('currentUser').textContent = USERS_DB[state.currentUser].name;
    
    loadChatHistory();
    
    if (!state.currentChatId) {
        createNewChat();
    }
    
    // Show motivational banner
    setTimeout(() => showMotivationalBanner(), 500);
}

// ===== DATA PERSISTENCE =====
function loadUserData() {
    const userKey = `solarbot_chats_${state.currentUser}`;
    const savedChats = localStorage.getItem(userKey);
    
    if (savedChats) {
        try {
            state.chatHistory = JSON.parse(savedChats);
        } catch (e) {
            console.error('Error loading chat history:', e);
            state.chatHistory = {};
        }
    } else {
        state.chatHistory = {};
    }
    
    const savedTheme = localStorage.getItem(`solarbot_theme_${state.currentUser}`);
    if (savedTheme) {
        state.currentTheme = savedTheme;
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            document.getElementById('themeToggle').textContent = '☀️';
        }
    }
}

function saveUserData() {
    if (!state.currentUser) return;
    
    const userKey = `solarbot_chats_${state.currentUser}`;
    localStorage.setItem(userKey, JSON.stringify(state.chatHistory));
    localStorage.setItem(`solarbot_theme_${state.currentUser}`, state.currentTheme);
}

function saveCurrentChat() {
    if (!state.currentChatId) return;
    
    const chatContainer = document.getElementById('chatContainer');
    const messages = [];
    
    chatContainer.querySelectorAll('.message').forEach(msgDiv => {
        const isUser = msgDiv.classList.contains('user');
        const content = msgDiv.querySelector('.message-content').textContent;
        
        if (content && !content.includes('☀️ Solar Savings Calculator')) {
            messages.push({
                role: isUser ? 'user' : 'assistant',
                content: content,
                timestamp: new Date().toISOString()
            });
        }
    });
    
    if (messages.length > 0) {
        const firstUserMessage = messages.find(m => m.role === 'user');
        const preview = firstUserMessage ? firstUserMessage.content.substring(0, 50) : 'New chat';
        
        state.chatHistory[state.currentChatId] = {
            id: state.currentChatId,
            messages: messages,
            preview: preview,
            createdAt: state.chatHistory[state.currentChatId]?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        saveUserData();
    }
}

// ===== CHAT MANAGEMENT =====
function createNewChat() {
    saveCurrentChat();
    
    const chatId = 'chat_' + Date.now();
    state.currentChatId = chatId;
    
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.innerHTML = `
        <div class="message bot">
            <div class="message-wrapper">
                <div class="avatar">☀️</div>
                <div class="message-content">
                    Hello! I'm SolarBot, your AI-powered solar energy assistant! 🌟 I can help you understand solar panels, calculate potential savings, schedule appointments, and answer all your renewable energy questions. How can I help you today?
                </div>
            </div>
        </div>
    `;
    
    updateSuggestions('');
    loadChatHistory();
    showToast('New chat created');
}

function loadChat(chatId) {
    if (chatId === state.currentChatId) return;
    
    saveCurrentChat();
    
    const chat = state.chatHistory[chatId];
    if (!chat) return;
    
    state.currentChatId = chatId;
    
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.innerHTML = '';
    
    chat.messages.forEach(msg => {
        addMessageToDOM(msg.content, msg.role === 'user');
    });
    
    loadChatHistory();
    scrollToBottom();
    showToast('Chat loaded');
}

function loadChatHistory() {
    const historyContainer = document.getElementById('chatHistory');
    historyContainer.innerHTML = '';
    
    const chats = Object.values(state.chatHistory).sort((a, b) => 
        new Date(b.updatedAt) - new Date(a.updatedAt)
    );
    
    if (chats.length === 0) {
        historyContainer.innerHTML = '<div style="padding: 12px; text-align: center; color: var(--text-secondary); font-size: 13px;">No chat history yet</div>';
        return;
    }
    
    chats.forEach(chat => {
        const chatItem = document.createElement('button');
        chatItem.className = 'chat-history-item';
        if (chat.id === state.currentChatId) {
            chatItem.classList.add('active');
        }
        
        const date = new Date(chat.updatedAt);
        const dateStr = formatDate(date);
        
        chatItem.innerHTML = `
            <span class="chat-item-text">${chat.preview}</span>
            <span class="chat-item-date">${dateStr}</span>
            <button class="chat-delete-btn" onclick="deleteChatById('${chat.id}', event)">🗑️</button>
        `;
        
        chatItem.onclick = (e) => {
            if (!e.target.classList.contains('chat-delete-btn')) {
                loadChat(chat.id);
            }
        };
        
        historyContainer.appendChild(chatItem);
    });
}

function deleteCurrentChat() {
    if (!state.currentChatId) return;
    
    if (confirm('Are you sure you want to delete this chat?')) {
        delete state.chatHistory[state.currentChatId];
        saveUserData();
        createNewChat();
        showToast('Chat deleted');
    }
}

function deleteChatById(chatId, event) {
    event.stopPropagation();
    
    if (confirm('Delete this chat?')) {
        delete state.chatHistory[chatId];
        saveUserData();
        
        if (chatId === state.currentChatId) {
            createNewChat();
        } else {
            loadChatHistory();
        }
        
        showToast('Chat deleted');
    }
}

function formatDate(date) {
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ===== INITIALIZATION FUNCTIONS =====
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
        const voiceBtn = document.getElementById('voiceBtn');
        if (voiceBtn) voiceBtn.style.display = 'none';
    }
}

function initializeScrollDetection() {
    const chatWrapper = document.getElementById('chatWrapper');
    if (chatWrapper) {
        chatWrapper.addEventListener('scroll', function() {
            const scrollBottom = document.getElementById('scrollBottom');
            const isScrolledUp = this.scrollHeight - this.scrollTop - this.clientHeight > 100;
            scrollBottom.classList.toggle('visible', isScrolledUp);
        });
    }
}

// ===== SIDEBAR =====
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    state.sidebarOpen = !state.sidebarOpen;
    
    if (window.innerWidth <= 768) {
        sidebar.classList.toggle('active');
    } else {
        sidebar.classList.toggle('collapsed');
    }
}

// ===== DROPDOWN MENU =====
function toggleMenuDropdown() {
    const dropdown = document.getElementById('menuDropdown');
    dropdown.classList.toggle('show');
}

function closeMenuDropdown() {
    const dropdown = document.getElementById('menuDropdown');
    dropdown.classList.remove('show');
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('menuDropdown');
    const menuButton = event.target.closest('.icon-btn');
    
    if (dropdown && !dropdown.contains(event.target) && !menuButton) {
        dropdown.classList.remove('show');
    }
});

// ===== THEME =====
function toggleTheme() {
    const body = document.body;
    const toggle = document.getElementById('themeToggle');
    
    state.currentTheme = state.currentTheme === 'light' ? 'dark' : 'light';
    
    if (state.currentTheme === 'dark') {
        body.classList.add('dark-theme');
        toggle.textContent = '☀️';
        showToast('Dark theme activated');
    } else {
        body.classList.remove('dark-theme');
        toggle.textContent = '🌙';
        showToast('Light theme activated');
    }
    
    saveUserData();
    trackEvent('themeToggled', { theme: state.currentTheme });
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
            document.getElementById('voiceBtn').style.color = '#ef4444';
            state.recognition.start();
            showToast('Listening...');
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
            document.getElementById('voiceBtn').style.color = '';
            state.recognition.stop();
        } catch (error) {
            console.error('Error stopping recognition:', error);
        }
    }
}

// ===== CONTACT & CALCULATOR =====
function openContactForm() {
    const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSf0bvHj2dJ3mAQo_FX-cdfG4md5pvnybIXOLCs67uYlFbIy7Q/viewform';
    window.open(formUrl, '_blank');
    trackEvent('contactFormOpened');
    
    setTimeout(() => {
        addMessage("I've opened our contact form in a new tab! Please fill it out and our solar experts will reach out to you within 24 hours.", false);
    }, 300);
}

// ===== WEATHER INTEGRATION =====
function showWeather() {
    // St. Louis coordinates
    const lat = 38.6270;
    const lon = -90.1994;
    
    // Simulated weather data (in production, you'd use a real API like OpenWeatherMap)
    const weatherData = generateWeatherData();
    
    const weatherHTML = `
        <div class="weather-widget">
            <div class="weather-location">St. Louis, Missouri</div>
            <div class="weather-header">
                <div>
                    <div class="weather-temp">${weatherData.temp}°F</div>
                    <div class="weather-condition">${weatherData.condition}</div>
                </div>
                <div class="weather-icon">${weatherData.icon}</div>
            </div>
            
            <div class="solar-potential">
                <div class="potential-label">Today's Solar Production Potential</div>
                <div class="potential-value">${weatherData.solarPotential}%</div>
                <div style="font-size: 13px; margin-top: 8px; opacity: 0.9;">
                    ${weatherData.potentialMessage}
                </div>
            </div>
            
            <div class="weather-details">
                <div class="weather-detail">
                    <div class="weather-detail-label">Sunlight Hours</div>
                    <div class="weather-detail-value">${weatherData.sunHours}h</div>
                </div>
                <div class="weather-detail">
                    <div class="weather-detail-label">UV Index</div>
                    <div class="weather-detail-value">${weatherData.uvIndex}</div>
                </div>
                <div class="weather-detail">
                    <div class="weather-detail-label">Cloud Cover</div>
                    <div class="weather-detail-value">${weatherData.cloudCover}%</div>
                </div>
            </div>
            
            <div style="margin-top: 16px; font-size: 12px; opacity: 0.8; text-align: center;">
                St. Louis averages 4.5 peak sun hours daily - excellent for solar energy!
            </div>
        </div>
    `;
    
    addCustomMessage(weatherHTML, false);
    showToast('Weather data loaded');
    trackEvent('weatherViewed');
}

function generateWeatherData() {
    // Simulate realistic St. Louis weather
    const conditions = [
        { condition: 'Sunny', icon: '☀', potential: 95, temp: 75, sunHours: 9, uvIndex: 8, cloudCover: 5 },
        { condition: 'Mostly Sunny', icon: '🌤', potential: 85, temp: 72, sunHours: 7, uvIndex: 7, cloudCover: 20 },
        { condition: 'Partly Cloudy', icon: '⛅', potential: 70, temp: 68, sunHours: 5, uvIndex: 5, cloudCover: 45 },
        { condition: 'Mostly Cloudy', icon: '☁', potential: 50, temp: 65, sunHours: 3, uvIndex: 3, cloudCover: 70 },
        { condition: 'Cloudy', icon: '☁', potential: 30, temp: 62, sunHours: 2, uvIndex: 2, cloudCover: 90 }
    ];
    
    // Randomly select (in production, this would be real API data)
    const weather = conditions[Math.floor(Math.random() * conditions.length)];
    
    let potentialMessage = '';
    
    if (weather.potential >= 80) {
        potentialMessage = 'Excellent conditions! Your panels would produce peak power today.';
    } else if (weather.potential >= 60) {
        potentialMessage = 'Good solar day! Panels producing strong energy output.';
    } else if (weather.potential >= 40) {
        potentialMessage = 'Moderate conditions. Panels still generating decent power.';
    } else {
        potentialMessage = 'Lower production today, but panels still working efficiently.';
    }
    
    return {
        ...weather,
        solarPotential: weather.potential,
        potentialMessage
    };
}

function showCalculator() {
    const calculatorHTML = `
        <div class="calculator-container">
            <h3>St. Louis Solar Savings Calculator</h3>
            <p class="calc-subtitle">Customized for the Greater St. Louis, Missouri region</p>
            
            <div class="calc-input-group">
                <label>Monthly Electric Bill ($)</label>
                <input type="number" id="electricBill" placeholder="Enter your average monthly bill" value="150" min="0" step="10">
                <small class="input-hint">Average St. Louis household: $140-180/month</small>
            </div>
            
            <div class="calc-input-group">
                <label>Home Size (Square Feet)</label>
                <input type="number" id="homeSize" placeholder="Enter your home size" value="2000" min="500" step="100">
                <small class="input-hint">Helps determine optimal system size</small>
            </div>
            
            <div class="calc-input-group">
                <label>Roof Condition</label>
                <select id="roofCondition">
                    <option value="excellent">Excellent (0-5 years old)</option>
                    <option value="good" selected>Good (6-15 years old)</option>
                    <option value="fair">Fair (16-25 years old)</option>
                    <option value="poor">Poor (needs replacement)</option>
                </select>
            </div>
            
            <div class="calc-input-group">
                <label>Roof Shading</label>
                <select id="roofShading">
                    <option value="none" selected>Minimal/No shade</option>
                    <option value="partial">Partial shade (some trees)</option>
                    <option value="significant">Significant shade (many trees)</option>
                </select>
            </div>
            
            <button class="calc-button" onclick="calculateSavings()">Calculate My St. Louis Savings</button>
            <div class="calc-results" id="calcResults"></div>
        </div>
    `;
    addCustomMessage(calculatorHTML, false);
    showToast('Calculator loaded');
    trackEvent('calculatorUsed');
}

function calculateSavings() {
    const electricBill = parseFloat(document.getElementById('electricBill')?.value) || 150;
    const homeSize = parseFloat(document.getElementById('homeSize')?.value) || 2000;
    const roofCondition = document.getElementById('roofCondition')?.value || 'good';
    const roofShading = document.getElementById('roofShading')?.value || 'none';
    
    if (electricBill <= 0 || homeSize <= 0) {
        showToast('Please enter valid numbers');
        return;
    }
    
    // St. Louis specific data
    const stlSunHours = 4.5; // Average daily sun hours in St. Louis
    const stlElectricRate = 0.12; // Ameren Missouri average rate per kWh
    const missouriRebate = 0.05; // Missouri state incentive (5%)
    
    // Calculate recommended system size based on home size and electric bill
    let recommendedSystemSize;
    if (homeSize < 1500) {
        recommendedSystemSize = 5;
    } else if (homeSize < 2500) {
        recommendedSystemSize = 7;
    } else if (homeSize < 3500) {
        recommendedSystemSize = 10;
    } else {
        recommendedSystemSize = 12;
    }
    
    // Adjust for shading
    let shadingFactor = 1.0;
    if (roofShading === 'partial') shadingFactor = 0.85;
    if (roofShading === 'significant') shadingFactor = 0.70;
    
    // Calculate costs (St. Louis average: $3.00-3.20 per watt)
    const costPerWatt = 3.10;
    const systemCost = recommendedSystemSize * 1000 * costPerWatt;
    
    // Incentives
    const federalTaxCredit = systemCost * 0.30; // 30% federal tax credit
    const stateRebate = systemCost * missouriRebate;
    const netCost = systemCost - federalTaxCredit - stateRebate;
    
    // Roof condition impact
    let roofCostNote = '';
    if (roofCondition === 'poor') {
        roofCostNote = '<div class="result-note warning">⚠️ Note: Your roof may need replacement before solar installation (additional $8,000-$15,000)</div>';
    } else if (roofCondition === 'fair') {
        roofCostNote = '<div class="result-note info">ℹ️ Your roof should last through installation, but consider replacement within 10 years</div>';
    }
    
    // Calculate production and savings
    const annualProduction = recommendedSystemSize * 1000 * stlSunHours * 365 * shadingFactor * 0.78; // 78% system efficiency
    const annualSavings = (annualProduction / 1000) * stlElectricRate;
    const paybackYears = (netCost / annualSavings).toFixed(1);
    const lifetime25Savings = (annualSavings * 25 - netCost).toFixed(0);
    const monthlyPayment = (netCost / 180).toFixed(0); // 15-year loan
    const monthlySavings = (annualSavings / 12).toFixed(0);
    
    // Environmental impact
    const co2Offset = (annualProduction / 1000 * 0.7).toFixed(1); // tons of CO2 per year
    const treesEquivalent = Math.round(co2Offset * 16.5); // trees planted equivalent
    
    const resultsHTML = `
        ${roofCostNote}
        <div class="result-highlight">
            <div class="result-label">Recommended System Size for Your Home</div>
            <div class="result-value" style="font-size: 28px; color: #ff8c00;">${recommendedSystemSize} kW</div>
            <small style="color: var(--text-secondary);">Optimized for ${homeSize} sq ft in St. Louis</small>
        </div>
        
        <div class="result-section-title">💰 Cost Breakdown</div>
        <div class="result-item">
            <div class="result-label">System Cost (Before Incentives)</div>
            <div class="result-value">${systemCost.toLocaleString()}</div>
            <small>${recommendedSystemSize} kW × ${(costPerWatt * 1000).toLocaleString()} = ${systemCost.toLocaleString()}</small>
        </div>
        <div class="result-item">
            <div class="result-label">Federal Tax Credit (30%)</div>
            <div class="result-value" style="color: #10a37f;">-${federalTaxCredit.toLocaleString()}</div>
        </div>
        <div class="result-item">
            <div class="result-label">Missouri State Rebate (5%)</div>
            <div class="result-value" style="color: #10a37f;">-${stateRebate.toLocaleString()}</div>
        </div>
        <div class="result-item highlight">
            <div class="result-label">Your Net Investment</div>
            <div class="result-value" style="font-size: 24px;">${netCost.toLocaleString()}</div>
        </div>
        
        <div class="result-section-title">💡 Annual Production & Savings</div>
        <div class="result-item">
            <div class="result-label">Estimated Annual Production</div>
            <div class="result-value">${(annualProduction / 1000).toLocaleString()} kWh</div>
            <small>Based on ${stlSunHours} sun hours/day in St. Louis${shadingFactor < 1 ? ` (adjusted for ${roofShading} shading)` : ''}</small>
        </div>
        <div class="result-item">
            <div class="result-label">Annual Savings (Ameren Missouri rates)</div>
            <div class="result-value">${annualSavings.toLocaleString()}</div>
            <small>~${monthlySavings}/month in electricity savings</small>
        </div>
        
        <div class="result-section-title">📊 Financial Summary</div>
        <div class="result-item">
            <div class="result-label">Monthly Loan Payment (15-year, 4.5% APR)</div>
            <div class="result-value">${monthlyPayment}/month</div>
            <small>Your monthly savings (${monthlySavings}) can offset this payment!</small>
        </div>
        <div class="result-item">
            <div class="result-label">Payback Period</div>
            <div class="result-value">${paybackYears} years</div>
        </div>
        <div class="result-item highlight">
            <div class="result-label">25-Year Net Savings</div>
            <div class="result-value" style="font-size: 32px; color: #10a37f;">${Math.abs(lifetime25Savings).toLocaleString()} 💰</div>
            <small>Total value over system lifetime</small>
        </div>
        
        <div class="result-section-title">🌍 Environmental Impact (Annual)</div>
        <div class="result-item">
            <div class="result-label">CO₂ Emissions Prevented</div>
            <div class="result-value">${co2Offset} tons/year</div>
            <small>Equivalent to planting ${treesEquivalent} trees annually!</small>
        </div>
        
        <div class="result-note success">
            ✅ <strong>Great news!</strong> St. Louis receives excellent sunlight for solar energy, and Missouri offers good incentives. 
            Your system would likely produce ${shadingFactor === 1 ? 'optimal' : 'good'} results!
        </div>
    `;
    
    const resultsDiv = document.getElementById('calcResults');
    if (resultsDiv) {
        resultsDiv.innerHTML = resultsHTML;
        resultsDiv.classList.add('show');
        showToast('St. Louis calculations complete!');
        setTimeout(() => scrollToBottom(), 100);
        trackEvent('calculationCompleted', { 
            systemSize: recommendedSystemSize, 
            homeSize, 
            estimatedSavings: lifetime25Savings, 
            paybackYears,
            location: 'St. Louis, MO'
        });
    }
}

// ===== CHAT EXPORT =====
function exportChat() {
    if (!state.currentChatId || !state.chatHistory[state.currentChatId]) {
        showToast('No messages to export');
        return;
    }
    
    const chat = state.chatHistory[state.currentChatId];
    let exportText = '=== SolarBot Chat Transcript ===\n';
    exportText += `Date: ${new Date().toLocaleString()}\n\n`;
    
    chat.messages.forEach((msg) => {
        const role = msg.role === 'user' ? 'You' : 'SolarBot';
        const time = new Date(msg.timestamp).toLocaleTimeString();
        exportText += `[${time}] ${role}:\n${msg.content}\n\n`;
    });
    
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SolarBot_Chat_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Chat exported successfully');
    trackEvent('chatExported', { messageCount: chat.messages.length });
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
        saveCurrentChat();
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
    addMessageToDOM(content, isUser);
    
    if (!isUser) {
        updateSuggestions(content.toLowerCase());
    }
}

function addMessageToDOM(content, isUser) {
    const chatContainer = document.getElementById('chatContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    
    const messageWrapper = document.createElement('div');
    messageWrapper.className = 'message-wrapper';
    
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = isUser ? 'U' : 'S';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = content;
    
    messageWrapper.appendChild(avatar);
    messageWrapper.appendChild(messageContent);
    messageDiv.appendChild(messageWrapper);
    
    chatContainer.appendChild(messageDiv);
    
    scrollToBottom();
}

function addCustomMessage(htmlContent, isUser) {
    const chatContainer = document.getElementById('chatContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    
    const messageWrapper = document.createElement('div');
    messageWrapper.className = 'message-wrapper';
    
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = isUser ? 'U' : 'S';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.innerHTML = htmlContent;
    
    messageWrapper.appendChild(avatar);
    messageWrapper.appendChild(messageContent);
    messageDiv.appendChild(messageWrapper);
    
    chatContainer.appendChild(messageDiv);
    
    scrollToBottom();
}

function showTypingIndicator() {
    const chatContainer = document.getElementById('chatContainer');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator active';
    typingDiv.id = 'typingIndicator';
    
    const messageWrapper = document.createElement('div');
    messageWrapper.className = 'message-wrapper';
    
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = 'S';
    
    const dotsDiv = document.createElement('div');
    dotsDiv.className = 'typing-dots';
    dotsDiv.innerHTML = '<span></span><span></span><span></span>';
    
    messageWrapper.appendChild(avatar);
    messageWrapper.appendChild(dotsDiv);
    typingDiv.appendChild(messageWrapper);
    
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
    
    if (/roof.*analysis|analyze.*roof|satellite|aerial.*view|roof.*potential/i.test(msg)) {
        setTimeout(() => showRoofAnalysis(), 500);
        return "I can analyze your roof using AI and satellite imagery! This will give you insights about your roof size, orientation, shading, and solar potential. Just enter your address and I'll generate a detailed analysis for you.";
    }
    
    if (/weather|sun|sunny|cloud|forecast|production.*today/i.test(msg)) {
        setTimeout(() => showWeather(), 500);
        return "Let me show you today's weather and solar production potential for St. Louis! This will help you understand how much energy your panels would generate today.";
    }
    
    if (/calculat|savings|estimate|how much.*save/i.test(msg)) {
        setTimeout(() => showCalculator(), 500);
        return "Great! Let me pull up the solar savings calculator for you. Just fill in your details and I'll calculate your potential savings, payback period, and 25-year benefits!";
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
    suggestions.forEach((item) => {
        const btn = document.createElement('button');
        btn.className = 'suggestion-btn';
        btn.textContent = item.display;
        
        if (item.action) {
            btn.onclick = item.action;
        } else {
            btn.onclick = () => sendSuggestion(item.query);
        }
        
        suggestionsContainer.appendChild(btn);
    });
}

// ===== UTILITIES =====
function scrollToBottom() {
    const chatWrapper = document.getElementById('chatWrapper');
    setTimeout(() => {
        chatWrapper.scrollTo({
            top: chatWrapper.scrollHeight,
            behavior: 'smooth'
        });
    }, 100);
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

function trackEvent(eventName, eventData = {}) {
    console.log('📊 Analytics Event:', eventName, eventData);
    if (state.analytics.hasOwnProperty(eventName)) {
        state.analytics[eventName]++;
    }
}

function getAnalytics() {
    return {
        ...state.analytics,
        totalMessages: Object.values(state.chatHistory).reduce((sum, chat) => sum + chat.messages.length, 0),
        sessionDuration: Date.now() - sessionStart,
        totalChats: Object.keys(state.chatHistory).length
    };
}

window.getSolarBotAnalytics = getAnalytics;

// Chat functionality with Gemini AI API
(function () {
  'use strict';

  // ⚠️ IMPORTANT: Add your Gemini API key here
  // Get your free API key from: https://makersuite.google.com/app/apikey
  const GEMINI_API_KEY = 'AIzaSyBODTk8lRxtxKvz3J_kQI40g9Xco7Lt0DI';

  // System instructions for the AI - customize this to guide the AI's behavior
  const SYSTEM_INSTRUCTIONS = `You are a helpful, friendly AI assistant integrated into LinkUp, a professional social networking platform. 
You help users with:
- Professional advice and career guidance
- Technical questions about programming and technology
- General knowledge and information
- Networking tips and communication strategies
- you will call my name "Vartika" everytime when you give the query

Some information about me - im vartika singh, a CS student at VITS Satna pursuing my B.Tech degree. I am passionate about coding, web development, and AI technologies. and im 20 years old. and i live in nagod, madhya pradesh. and im the creator of this website (Linkup) and also i create you as well

Keep your responses concise, professional, and helpful. Be encouraging and supportive.`;

  const STORAGE = {
    CHAT_HISTORY: 'linkup.chat.history',
  };

  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent`;

  // Elements
  const $ = (sel) => document.querySelector(sel);
  
  const el = {
    year: $('#year'),
    meAvatar: $('#meAvatar'),
    chatMessages: $('#chatMessages'),
    chatForm: $('#chatForm'),
    messageInput: $('#messageInput'),
    sendBtn: $('#sendBtn'),
    clearChat: $('#clearChat'),
  };

  let chatHistory = [];
  let isTyping = false;

  init();

  function init() {
    // Footer year
    if (el.year) el.year.textContent = String(new Date().getFullYear());

    // Load user avatar
    const currentUser = loadCurrentUser();
    if (el.meAvatar) {
      const initials = getInitials(currentUser.name);
      el.meAvatar.textContent = initials;
      el.meAvatar.style.background = currentUser.color;
      el.meAvatar.title = currentUser.name;
    }

    // Load chat history
    loadChatHistory();
    renderChatHistory();

    // Event listeners
    el.chatForm.addEventListener('submit', handleSendMessage);
    el.messageInput.addEventListener('input', handleInputChange);
    el.messageInput.addEventListener('keydown', handleKeyDown);
    el.clearChat.addEventListener('click', handleClearChat);

    // Auto-resize textarea
    el.messageInput.addEventListener('input', autoResizeTextarea);
  }

  function loadCurrentUser() {
    try {
      const stored = localStorage.getItem('linkup_current_user');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    
    return {
      id: 'me',
      name: 'Vartika Singh',
      headline: 'CS Student at VIT Vellore',
      color: '#667eea',
    };
  }

  function getInitials(name) {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0].toUpperCase())
      .join('');
  }

  function loadChatHistory() {
    try {
      const stored = localStorage.getItem(STORAGE.CHAT_HISTORY);
      if (stored) {
        chatHistory = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load chat history', e);
      chatHistory = [];
    }
  }

  function saveChatHistory() {
    try {
      localStorage.setItem(STORAGE.CHAT_HISTORY, JSON.stringify(chatHistory));
    } catch (e) {
      console.error('Failed to save chat history', e);
    }
  }

  function handleInputChange() {
    const message = el.messageInput.value.trim();
    el.sendBtn.disabled = !message || isTyping;
  }

  function handleKeyDown(e) {
    // Send on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!el.sendBtn.disabled) {
        el.chatForm.dispatchEvent(new Event('submit'));
      }
    }
  }

  function autoResizeTextarea() {
    el.messageInput.style.height = 'auto';
    el.messageInput.style.height = Math.min(el.messageInput.scrollHeight, 150) + 'px';
  }

  async function handleSendMessage(e) {
    e.preventDefault();
    
    const message = el.messageInput.value.trim();
    if (!message || isTyping) return;

    // Check if API key is configured
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
      showError('Please configure your Gemini API key in the chat.js file. Get your free key from https://makersuite.google.com/app/apikey');
      return;
    }

    // Add user message
    addMessage('user', message);
    
    // Clear input
    el.messageInput.value = '';
    el.messageInput.style.height = 'auto';
    handleInputChange();

    // Show typing indicator
    isTyping = true;
    showTypingIndicator();

    try {
      // Call Gemini API with system instructions
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{
              text: SYSTEM_INSTRUCTIONS
            }]
          },
          contents: [{
            parts: [{
              text: message
            }]
          }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to get response from AI');
      }

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';

      // Remove typing indicator
      removeTypingIndicator();
      
      // Add AI response
      addMessage('ai', aiResponse);

    } catch (error) {
      console.error('Error calling Gemini API:', error);
      removeTypingIndicator();
      showError(error.message || 'Failed to send message. Please check your API key and try again.');
    } finally {
      isTyping = false;
      handleInputChange();
    }
  }

  function addMessage(sender, text) {
    const message = {
      id: Date.now().toString(),
      sender,
      text,
      timestamp: new Date().toISOString(),
    };

    chatHistory.push(message);
    saveChatHistory();
    renderMessage(message);
    scrollToBottom();
  }

  function renderChatHistory() {
    if (chatHistory.length === 0) return;

    // Remove welcome message
    const welcome = el.chatMessages.querySelector('.chat-welcome');
    if (welcome) welcome.remove();

    // Render all messages
    chatHistory.forEach(renderMessage);
    scrollToBottom();
  }

  function renderMessage(message) {
    // Remove welcome message if exists
    const welcome = el.chatMessages.querySelector('.chat-welcome');
    if (welcome) welcome.remove();

    const messageEl = document.createElement('div');
    messageEl.className = `chat-message chat-message--${message.sender}`;
    messageEl.setAttribute('data-id', message.id);

    const currentUser = loadCurrentUser();
    const initials = message.sender === 'user' ? getInitials(currentUser.name) : 'AI';
    const avatarColor = message.sender === 'user' ? currentUser.color : 'linear-gradient(135deg, #667eea, #764ba2)';

    messageEl.innerHTML = `
      <div class="message-avatar" style="background: ${avatarColor}">
        ${message.sender === 'user' ? initials : `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
          </svg>
        `}
      </div>
      <div class="message-content">
        <div class="message-text">${formatMessage(message.text)}</div>
        <div class="message-time">${formatTime(message.timestamp)}</div>
      </div>
    `;

    el.chatMessages.appendChild(messageEl);
  }

  function showTypingIndicator() {
    const typingEl = document.createElement('div');
    typingEl.className = 'chat-message chat-message--ai typing-indicator';
    typingEl.id = 'typingIndicator';

    typingEl.innerHTML = `
      <div class="message-avatar" style="background: linear-gradient(135deg, #667eea, #764ba2)">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
        </svg>
      </div>
      <div class="message-content">
        <div class="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;

    el.chatMessages.appendChild(typingEl);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    const typingEl = $('#typingIndicator');
    if (typingEl) typingEl.remove();
  }

  function showError(message) {
    const errorEl = document.createElement('div');
    errorEl.className = 'chat-error';
    errorEl.textContent = message;

    el.chatMessages.appendChild(errorEl);
    scrollToBottom();

    // Remove after 5 seconds
    setTimeout(() => {
      errorEl.remove();
    }, 5000);
  }

  function handleClearChat() {
    if (!confirm('Are you sure you want to clear all chat history?')) return;

    chatHistory = [];
    saveChatHistory();
    
    el.chatMessages.innerHTML = `
      <div class="chat-welcome">
        <div class="welcome-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <h3>Welcome to AI Chat!</h3>
        <p>Start a conversation with the AI assistant. Ask questions, get help, or just chat!</p>
      </div>
    `;
  }

  function formatMessage(text) {
    // Escape HTML
    let formatted = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

    // Convert URLs to links
    formatted = formatted.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" rel="noopener">$1</a>'
    );

    // Convert line breaks to <br>
    formatted = formatted.replace(/\n/g, '<br>');

    // Convert **bold** to <strong>
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Convert *italic* to <em>
    formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Convert `code` to <code>
    formatted = formatted.replace(/`(.+?)`/g, '<code>$1</code>');

    return formatted;
  }

  function formatTime(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diff = now - date;

    // Less than 1 minute
    if (diff < 60000) return 'Just now';

    // Less than 1 hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m ago`;
    }

    // Less than 24 hours
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}h ago`;
    }

    // Today
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }

    // This year
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    // Other years
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function scrollToBottom() {
    setTimeout(() => {
      el.chatMessages.scrollTop = el.chatMessages.scrollHeight;
    }, 100);
  }
})();

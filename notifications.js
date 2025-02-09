class NotificationManager {
  constructor() {
    this.permissionStatus = document.getElementById('permission-status');
    this.requestButton = document.getElementById('request-permission');
    this.simulateButton = document.getElementById('simulate-text');
    this.phone = document.getElementById('phone');
    
    this.init();
  }

  init() {
    this.updatePermissionStatus();
    
    this.requestButton.addEventListener('click', () => this.requestPermission());
    this.simulateButton.addEventListener('click', () => this.simulateText());
    
    // Check if service workers are supported
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('service-worker.js')
        .then(registration => {
          console.log('ServiceWorker registration successful');
        })
        .catch(err => {
          console.log('ServiceWorker registration failed: ', err);
        });
    }
  }

  updatePermissionStatus() {
    this.permissionStatus.textContent = Notification.permission;
    this.requestButton.style.display = 
      Notification.permission === 'granted' ? 'none' : 'inline-block';
  }

  async requestPermission() {
    try {
      const permission = await Notification.requestPermission();
      this.updatePermissionStatus();
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  }

  simulateText() {
    const messages = [
      "Hey, how are you?",
      "Want to grab lunch?",
      "Don't forget about tomorrow's meeting!",
      "Check out this cool website I found!",
      "Missing you! ❤️"
    ];
    
    const senders = [
      "Alice",
      "Bob",
      "Mom",
      "Work Chat",
      "Best Friend"
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    const randomSender = senders[Math.floor(Math.random() * senders.length)];

    this.showNotification(randomSender, randomMessage);
  }

  showNotification(title, message) {
    // Show in-page notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
      <strong>${title}</strong><br>
      ${message}
    `;
    
    this.phone.insertBefore(notification, this.phone.firstChild);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after 5 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => notification.remove(), 300);
    }, 5000);

    // Show system notification if permitted
    if (Notification.permission === 'granted') {
      const options = {
        body: message,
        icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="11" fill="%23007AFF"/><text x="12" y="16" text-anchor="middle" fill="white" font-family="system-ui" font-size="14">📱</text></svg>',
        badge: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="11" fill="%23007AFF"/></svg>'
      };
      
      new Notification(title, options);
    }
  }
}

// Initialize when page loads
window.addEventListener('load', () => {
  new NotificationManager();
});
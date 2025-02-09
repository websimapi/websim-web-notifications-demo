class NotificationManager {
  constructor() {
    this.permissionStatus = document.getElementById('permission-status');
    this.requestButton = document.getElementById('request-permission');
    this.simulateButton = document.getElementById('simulate-text');
    this.phone = document.getElementById('phone');
    this.swRegistration = null;
    
    this.init();
  }

  async init() {
    this.updatePermissionStatus();
    
    this.requestButton.addEventListener('click', () => this.requestPermission());
    this.simulateButton.addEventListener('click', () => this.simulateText());
    
    // Check if service workers and notifications are supported
    if (!('serviceWorker' in navigator)) {
      console.error('Service Workers are not supported');
      this.updateStatus('Service Workers not supported');
      return;
    }

    if (!('Notification' in window)) {
      console.error('Notifications are not supported');
      this.updateStatus('Notifications not supported');
      return;
    }

    try {
      this.swRegistration = await navigator.serviceWorker.register('service-worker.js');
      console.log('ServiceWorker registration successful');
      
      // Ensure the service worker is active
      if (this.swRegistration.active) {
        this.updateStatus('Service Worker active');
      } else {
        await navigator.serviceWorker.ready;
        this.updateStatus('Service Worker ready');
      }
    } catch (err) {
      console.error('ServiceWorker registration failed: ', err);
      this.updateStatus('Service Worker registration failed');
    }
  }

  updateStatus(message) {
    this.permissionStatus.textContent = `${message} (Notification permission: ${Notification.permission})`;
  }

  updatePermissionStatus() {
    this.updateStatus(Notification.permission);
    this.requestButton.style.display = 
      Notification.permission === 'granted' ? 'none' : 'inline-block';
  }

  async requestPermission() {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      console.log('Permission request result:', permission);
      this.updatePermissionStatus();
      
      if (permission === 'granted') {
        // Try to show a test notification
        await this.showNotification('Test Notification', 'Notifications are now working!');
      } else {
        alert('We need notification permission to show notifications');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      alert('There was an error requesting notification permission');
    }
  }

  simulateText() {
    const messages = [
      "Hey, how are you?",
      "Want to grab lunch?",
      "Don't forget about tomorrow's meeting!",
      "Check out this cool website I found!",
      "Missing you! "
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

  async showNotification(title, message) {
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
      try {
        const options = {
          body: message,
          icon: '/notification-icon.svg',
          badge: '/notification-badge.svg'
        };
        
        if (this.swRegistration) {
          await this.swRegistration.showNotification(title, options);
        } else {
          new Notification(title, options);
        }
      } catch (error) {
        console.error('Error showing notification:', error);
      }
    }
  }
}

// Initialize when page loads
window.addEventListener('load', () => {
  new NotificationManager();
});
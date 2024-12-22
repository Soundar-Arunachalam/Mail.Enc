
  document.getElementById("manage-keys").addEventListener("click",(e)=>{
window.open("managekeys.html","_blanc");
console.log(e);
  })
  
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize activity tracking
    loadRecentActivity();
    
    // Add click handlers for quick action buttons
    initializeQuickActions();
    
    // Check key status and update UI
    checkKeyStatus();
  });
  
  // Initialize Quick Actions
  function initializeQuickActions() {
    // Generate Keys Quick Action
    document.querySelector('[href="keys.html"]').addEventListener('click', function(e) {
        e.preventDefault();
        chrome.storage.local.get('privateKey', function(data) {
            if (data.privateKey) {
                if (confirm('Keys already exist. Generate new ones?')) {
                    window.location.href = 'keys.html';
                }
            } else {
                window.location.href = 'keys.html';
            }
        });
    });

    // Encrypt Message Quick Action
    document.querySelector('[href="encrypt.html"]').addEventListener('click', function(e) {
        e.preventDefault();
        chrome.storage.local.get('publicKey', function(data) {
            if (!data.publicKey) {
                alert('Please generate keys first!');
                window.location.href = 'keys.html';
            } else {
                window.location.href = 'encrypt.html';
            }
        });
    });

    // Decrypt Message Quick Action
    document.querySelector('[href="decrypt.html"]').addEventListener('click', function(e) {
        e.preventDefault();
        chrome.storage.local.get('privateKey', function(data) {
            if (!data.privateKey) {
                alert('Please generate keys first!');
                window.location.href = 'keys.html';
            } else {
                window.location.href = 'decrypt.html';
            }
        });
    });
  }
  
  // Load Recent Activity
  async function loadRecentActivity() {
    const activityList = document.getElementById('activityList');
    
    try {
        const { activities = [] } = await chrome.storage.local.get('activities');
        
        if (activities.length === 0) {
            activityList.innerHTML = `
                <div class="list-group-item text-center text-muted">
                    <i class="fas fa-info-circle me-2"></i>No recent activity
                </div>
            `;
            return;
        }

        activityList.innerHTML = activities
            .slice(0, 5) // Show only last 5 activities
            .map(activity => `
                <div class="list-group-item">
                    <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">
                            <i class="fas ${getActivityIcon(activity.type)} me-2"></i>
                            ${activity.title}
                        </h6>
                        <small class="text-muted">${formatDate(activity.timestamp)}</small>
                    </div>
                    <p class="mb-1 small">${activity.description}</p>
                </div>
            `)
            .join('');

    } catch (error) {
        console.error('Failed to load activities:', error);
        activityList.innerHTML = `
            <div class="list-group-item text-center text-danger">
                <i class="fas fa-exclamation-circle me-2"></i>Failed to load activities
            </div>
        `;
    }
  }
  
  // Add new activity
  async function addActivity(activity) {
    try {
        const { activities = [] } = await chrome.storage.local.get('activities');
        activities.unshift({
            ...activity,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 20 activities
        await chrome.storage.local.set({
            activities: activities.slice(0, 20)
        });
        
        // Reload activity list
        loadRecentActivity();
    } catch (error) {
        console.error('Failed to add activity:', error);
    }
  }
  
  // Helper function to get icon for activity type
  function getActivityIcon(type) {
    const icons = {
        'key-generation': 'fa-key',
        'encryption': 'fa-lock',
        'decryption': 'fa-unlock',
        'contact-added': 'fa-user-plus',
        'settings-changed': 'fa-cog'
    };
    return icons[type] || 'fa-info-circle';
  }
  
  // Format date for activity list
  function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) { // Less than 1 minute
        return 'Just now';
    } else if (diff < 3600000) { // Less than 1 hour
        const minutes = Math.floor(diff / 60000);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diff < 86400000) { // Less than 1 day
        const hours = Math.floor(diff / 3600000);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
        return date.toLocaleDateString();
    }
  }
  
  // Check key status and update UI
  async function checkKeyStatus() {
    try {
        const { privateKey, publicKey } = await chrome.storage.local.get(['privateKey', 'publicKey']);
        
        // Update Generate Keys button state
        const generateBtn = document.querySelector('[href="keys.html"]').closest('.dashboard-card');
        if (privateKey && publicKey) {
            generateBtn.querySelector('.btn').classList.remove('btn-primary');
            generateBtn.querySelector('.btn').classList.add('btn-success');
            generateBtn.querySelector('.btn').innerHTML = 'View Keys';
        }

        // Add key status to activity if not present
        if (privateKey && publicKey) {
            const { activities = [] } = await chrome.storage.local.get('activities');
            if (!activities.some(a => a.type === 'key-generation')) {
                addActivity({
                    type: 'key-generation',
                    title: 'Keys Generated',
                    description: 'Encryption keys are ready to use'
                });
            }
        }

    } catch (error) {
        console.error('Failed to check key status:', error);
    }
  }
  
  // Add these event listeners for the navbar items
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        // Remove active class from all links
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        // Add active class to clicked link
        this.classList.add('active');
    });
  });
  
  // Add hover effects for dashboard cards
  document.querySelectorAll('.dashboard-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)';
    });
  });
  
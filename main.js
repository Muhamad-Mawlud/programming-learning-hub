// ===== Theme Toggle =====
document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme');

    // Function to update icon
    const updateIcon = (theme) => {
        if (!themeToggleBtn) return;
        if (theme === 'light') {
            themeToggleBtn.innerHTML = '<i class="bi bi-moon-stars-fill"></i>'; // Show Moon to switch to Dark
            themeToggleBtn.setAttribute('title', 'گۆڕین بۆ دۆخی تاریک'); // Switch to Dark Mode
        } else {
            themeToggleBtn.innerHTML = '<i class="bi bi-sun-fill"></i>'; // Show Sun to switch to Light
            themeToggleBtn.setAttribute('title', 'گۆڕین بۆ دۆخی ڕووناک'); // Switch to Light Mode
        }
    };

    // Apply saved theme
    if (savedTheme === 'light') {
        document.body.setAttribute('data-theme', 'light');
        updateIcon('light');
    } else {
        updateIcon('dark');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme');
            if (currentTheme === 'light') {
                document.body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
                updateIcon('dark');
            } else {
                document.body.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                updateIcon('light');
            }
        });
    }
});

// ===== Navbar Scroll Effect =====
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Active Navigation Link =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// ===== Course Filter =====
const filterBtns = document.querySelectorAll('.filter-btn');
const courseItems = document.querySelectorAll('[data-category]');

if (filterBtns.length > 0 && courseItems.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            courseItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = ''; // Revert to default CSS
                    // Animation reset
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    item.style.transition = 'all 0.4s ease';

                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// ===== Animation on Scroll =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.course-card, .feature-card, .instructor-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
});

// ===== Form Submission =====
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        // Add form handling logic
        alert('سوپاس! نامەکەت نێردرا.');
        this.reset();
    });
}

// ===== Language Switcher =====
const languageSelector = document.getElementById('languageSelector');
let currentLang = localStorage.getItem('codeistan_lang') || 'ku';

function applyLanguage(lang) {
    const html = document.documentElement;
    const isRTL = lang === 'ku' || lang === 'ar';

    // Set Direction and Lang Attribute
    html.setAttribute('lang', lang);
    html.setAttribute('dir', isRTL ? 'rtl' : 'ltr');

    // Update Bootstrap
    const bootstrapLink = document.querySelector('link[href*="bootstrap"]');
    if (bootstrapLink) {
        if (isRTL) {
            if (!bootstrapLink.href.includes('.rtl.')) {
                bootstrapLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.rtl.min.css';
            }
        } else {
            bootstrapLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css';
        }
    }

    // Update Text Content
    if (typeof translations !== 'undefined') {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[key] && translations[key][lang]) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translations[key][lang];
                } else {
                    element.textContent = translations[key][lang];
                }
            }
        });
    }

    // Save Preference
    localStorage.setItem('codeistan_lang', lang);
    currentLang = lang;

    // Update Button Text/Icon if needed
    if (languageSelector) {
        languageSelector.innerHTML = `<i class="bi bi-globe me-1"></i> ${lang === 'ku' ? 'کوردی' : lang === 'en' ? 'English' : 'عربي'}`;
    }
}

// Initialize Language
document.addEventListener('DOMContentLoaded', () => {
    // Determine language from URL param or local storage
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    if (langParam && ['ku', 'en', 'ar'].includes(langParam)) {
        currentLang = langParam;
    }

    applyLanguage(currentLang);

    // Language Switcher Events
    document.querySelectorAll('.lang-option').forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = e.currentTarget.getAttribute('data-lang');
            applyLanguage(lang);
        });
    });

    // Auth Modal Tab Switcher
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');

    if (loginBtn && registerBtn) {
        loginBtn.addEventListener('click', () => {
            const triggerEl = document.querySelector('#login-tab');
            bootstrap.Tab.getOrCreateInstance(triggerEl).show();
        });

        registerBtn.addEventListener('click', () => {
            const triggerEl = document.querySelector('#register-tab');
            bootstrap.Tab.getOrCreateInstance(triggerEl).show();
        });
    }

    // Show Auth Modal on Load
    const authModal = document.getElementById('authModal');

    // Ensure DB is initialized before check
    if (typeof db === 'undefined') {
        console.error('Database file not loaded! Please include js/db.js');
        return;
    }

    // Function to update UI based on auth state
    function updateAuthUI() {
        const guestElements = document.getElementById('guestElements');
        const authElements = document.getElementById('authElements');
        const userNameDisplay = document.getElementById('userNameDisplay');

        // Navigation Links Logic
        const restrictedPages = ['courses.html', 'features.html', 'instructors.html', 'contact.html'];
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link, .footer-links a');

        if (db.isLoggedIn()) {
            const user = db.getCurrentUser();
            if (guestElements) guestElements.style.setProperty('display', 'none', 'important');
            if (authElements) authElements.style.removeProperty('display');

            if (userNameDisplay) userNameDisplay.textContent = user.name;

            // Enable Links
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href && restrictedPages.some(page => href.includes(page))) {
                    link.classList.remove('disabled', 'text-muted');
                    link.style.pointerEvents = 'auto';
                    link.style.opacity = '1';
                }
            });
        } else {
            if (guestElements) guestElements.style.removeProperty('display');
            if (authElements) authElements.style.setProperty('display', 'none', 'important');

            // Disable Links
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                // Check if it's one of the restricted pages
                if (href && restrictedPages.some(page => href.includes(page))) {
                    link.classList.add('disabled', 'text-muted');
                    link.style.pointerEvents = 'none';
                    link.style.opacity = '0.5';
                }
            });
        }
    }

    // Call on load
    updateAuthUI();

    // Logout Handler
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            db.endSession();
            updateAuthUI();
            // Ideally redirect to home, but here just update UI
            window.location.reload();
        });
    }

    if (authModal) { // Check if authModal exists in DOM, even if not logged in
        const modal = bootstrap.Modal.getOrCreateInstance(authModal);

        // Handle Login & Register Forms
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        const handleAuth = (e) => {
            e.preventDefault();
            const form = e.target;
            const email = form.querySelector('input[type="email"]').value;
            const password = form.querySelector('input[type="password"]').value;

            // Password Validation for Register
            if (form.id === 'registerForm') {
                if (password.length < 8) {
                    alert('وشەی نهێنی نابێت لە ٨ پیت کەمتر بێت'); // Password must be at least 8 characters
                    return;
                }
            }

            let result = { success: false, message: '' };

            if (form.id === 'loginForm') {
                result = db.login(email, password);
            } else if (form.id === 'registerForm') {
                const name = form.querySelector('input[type="text"]').value;
                result = db.register({ name, email, password });
            }

            if (result.success) {
                // Success - Close modal
                document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
                modal.hide();
                updateAuthUI(); // Update UI immediately
            } else {
                // Fail - Show Alert
                alert(result.message);
            }
        };

        if (loginForm) loginForm.addEventListener('submit', handleAuth);
        if (registerForm) registerForm.addEventListener('submit', handleAuth);

        // ===== Forgot Password Logic =====
        const forgotPasswordLink = document.getElementById('forgotPasswordLink');
        const backToLoginBtn = document.getElementById('backToLoginBtn');
        const forgotPasswordSection = document.getElementById('forgotPasswordSection');
        const forgotPasswordForm = document.getElementById('forgotPasswordForm');
        const authTabs = document.getElementById('authTabs');
        const authTabsContent = document.getElementById('authTabsContent');
        const socialLoginSection = document.getElementById('socialLoginSection');

        if (forgotPasswordLink && forgotPasswordSection && authTabs && authTabsContent) {
            // Switch to Forgot Password View
            forgotPasswordLink.addEventListener('click', (e) => {
                e.preventDefault();
                authTabs.classList.add('d-none');
                authTabsContent.classList.add('d-none');
                if (socialLoginSection) socialLoginSection.classList.add('d-none');
                forgotPasswordSection.classList.remove('d-none');
            });

            // Back to Login View
            if (backToLoginBtn) {
                backToLoginBtn.addEventListener('click', () => {
                    forgotPasswordSection.classList.add('d-none');
                    authTabs.classList.remove('d-none');
                    authTabsContent.classList.remove('d-none');
                    if (socialLoginSection) socialLoginSection.classList.remove('d-none');
                });
            }

            // Handle Password Reset
            if (forgotPasswordForm) {
                forgotPasswordForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const email = document.getElementById('resetEmail').value;
                    const newPassword = document.getElementById('resetPassword').value;

                    if (newPassword.length < 6) {
                        alert('وشەی نهێنی نابێت لە ٦ پیت کەمتر بێت'); // Password < 6 chars
                        return;
                    }

                    // db.updateUser returns { success: false, message: 'User not found' } if invalid
                    const updateResult = db.updateUser(email, { password: newPassword });

                    if (updateResult.success) {
                        alert('وشەی نهێنی بەسەرکەوتوویی گۆڕدرا. ئێستا دەتوانیت بچیتە ژوورەوە.'); // Password changed successfully
                        // Reset form and go back to login
                        forgotPasswordForm.reset();
                        forgotPasswordSection.classList.add('d-none');
                        authTabs.classList.remove('d-none');
                        authTabsContent.classList.remove('d-none');
                        if (socialLoginSection) socialLoginSection.classList.remove('d-none');

                        // Switch to Login Tab
                        const loginTabTrigger = document.querySelector('#login-tab');
                        if (loginTabTrigger) bootstrap.Tab.getOrCreateInstance(loginTabTrigger).show();
                    } else {
                        alert('ئەم ئیمەیڵە بوونی نییە'); // Email not found
                    }
                });
            }
        }

        // Terms Modal Logic
        const termsLink = document.getElementById('termsLink');
        const termsModalEl = document.getElementById('termsModal');
        const termsAgreeBtn = document.getElementById('termsAgreeBtn');
        const termsCheckbox = document.getElementById('termsAccept');

        if (termsLink && termsModalEl) {
            const termsModal = new bootstrap.Modal(termsModalEl);

            termsLink.addEventListener('click', (e) => {
                e.preventDefault();
                termsModal.show();
            });

            if (termsAgreeBtn && termsCheckbox) {
                termsAgreeBtn.addEventListener('click', () => {
                    termsCheckbox.checked = true;
                    termsModal.hide();
                });
            }
        }

        // Toggle Password Visibility
        document.querySelectorAll('.toggle-password').forEach(btn => {
            btn.addEventListener('click', function () {
                const input = this.previousElementSibling;
                if (input.getAttribute('type') === 'password') {
                    input.setAttribute('type', 'text');
                    this.querySelector('i').classList.remove('bi-eye');
                    this.querySelector('i').classList.add('bi-eye-slash');
                } else {
                    input.setAttribute('type', 'password');
                    this.querySelector('i').classList.remove('bi-eye-slash');
                    this.querySelector('i').classList.add('bi-eye');
                }
            });
        });

        // ===== Profile Modal Logic =====
        const profileModalEl = document.getElementById('profileModal');
        const profileLink = document.querySelector('a[data-i18n="nav.profile"]'); // Target Profile Link

        if (profileModalEl && profileLink) {
            const profileModal = new bootstrap.Modal(profileModalEl);
            const profileForm = document.getElementById('profileForm');
            const profileImageInput = document.getElementById('profileImageInput');
            const profileImagePreview = document.getElementById('profileImagePreview');
            const removeProfileImageBtn = document.getElementById('removeProfileImageBtn');
            const profileNameInput = document.getElementById('profileNameInput');
            const profileEmailInput = document.getElementById('profileEmailInput');

            // Open Modal & Populate Data
            profileLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (db.isLoggedIn()) {
                    const user = db.getCurrentUser();
                    profileNameInput.value = user.name;
                    profileEmailInput.value = user.email;

                    if (user.image) {
                        profileImagePreview.src = user.image;
                        if (removeProfileImageBtn) removeProfileImageBtn.style.display = 'flex';
                    } else {
                        profileImagePreview.src = `https://ui-avatars.com/api/?name=${user.name}&background=random`;
                        if (removeProfileImageBtn) removeProfileImageBtn.style.display = 'none';
                    }
                    profileModal.show();
                }
            });

            // Image Preview Handler
            profileImageInput.addEventListener('change', function () {
                const file = this.files[0];
                if (file) {
                    // Validate File Size (Max 2MB)
                    if (file.size > 2 * 1024 * 1024) {
                        alert('قەبارەی وێنەکە نابێت لە ٢ مێگابایت زیاتر بێت'); // Image size too large
                        this.value = ''; // Reset input
                        return;
                    }

                    const reader = new FileReader();
                    reader.onload = function (e) {
                        profileImagePreview.src = e.target.result;
                        if (removeProfileImageBtn) removeProfileImageBtn.style.display = 'flex';
                    };
                    reader.readAsDataURL(file);
                }
            });

            // Remove Image Handler
            if (removeProfileImageBtn) {
                removeProfileImageBtn.addEventListener('click', () => {
                    profileImageInput.value = ''; // Clear file input
                    const currentName = profileNameInput.value || 'User';
                    profileImagePreview.src = `https://ui-avatars.com/api/?name=${currentName}&background=random`;
                    removeProfileImageBtn.style.display = 'none';
                });
            }

            // Form Submit Handler
            profileForm.addEventListener('submit', function (e) {
                e.preventDefault();

                const newName = profileNameInput.value;
                const newImage = profileImagePreview.src;
                const email = profileEmailInput.value; // Read-only, used as key

                // Basic Validation
                if (!newName.trim()) {
                    alert('تکایە ناوێک بنووسە'); // Please enter a name
                    return;
                }

                let imageToSave = undefined;
                if (newImage.startsWith('data:image')) {
                    imageToSave = newImage;
                } else if (newImage.includes('ui-avatars.com')) {
                    imageToSave = null; // Explicitly remove image
                }

                // Update Data
                const updateResult = db.updateUser(email, {
                    name: newName,
                    image: imageToSave
                });

                if (updateResult.success) {
                    alert('پڕۆفایل نوێکرایەوە'); // Profile updated
                    profileModal.hide();
                    window.location.reload(); // Reload to reflect changes across UI
                } else {
                    alert('هەڵەیەک ڕوویدا: ' + updateResult.message);
                }
            });
        } // end of if (profileModalEl && profileLink)
    } // end of if (authModal)
}); // end of DOMContentLoaded
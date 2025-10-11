// Wait for the entire HTML document to be loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. GETTING REQUIRED ELEMENTS FROM THE DOM ---
    const form = document.getElementById('validation-form');
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');

    // --- 2. SETTING UP EVENT LISTENERS ---

    // The main event listener for the form submission
    form.addEventListener('submit', (event) => {
        // Prevent the form from submitting by default
        event.preventDefault();
        
        // Run all validation checks
        validateForm();
    });

    // Added 'input' event listeners for real-time feedback as the user types
    fullName.addEventListener('input', () => validateField(fullName, validateFullName));
    email.addEventListener('input', () => validateField(email, validateEmail));
    phone.addEventListener('input', () => validateField(phone, validatePhone));
    password.addEventListener('input', () => {
        validateField(password, () => validatePassword(password.value.trim(), fullName.value.trim()));
        // Also re-validate the confirm password field whenever the password changes
        validateField(confirmPassword, () => validateConfirmPassword(password.value.trim(), confirmPassword.value.trim()));
    });
    confirmPassword.addEventListener('input', () => validateField(confirmPassword, () => validateConfirmPassword(password.value.trim(), confirmPassword.value.trim())));


    // --- 3. UTILITY FUNCTIONS FOR DISPLAYING ERRORS/SUCCESS ---

    /**
     * Displays an error message for a given input field.
     * @param {HTMLElement} input - The input element with an error.
     * @param {string} message - The error message to display.
     */
    function setError(input, message) {
        const formGroup = input.parentElement;
        const errorMessage = formGroup.querySelector('.error-message');
        
        errorMessage.innerText = message;
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
    }

    /**
     * Marks an input field as valid (success).
     * @param {HTMLElement} input - The valid input element.
     */
    function setSuccess(input) {
        const formGroup = input.parentElement;
        const errorMessage = formGroup.querySelector('.error-message');
        
        errorMessage.innerText = '';
        input.classList.add('is-valid');
        input.classList.remove('is-invalid');
    }


    // --- 4. INDIVIDUAL VALIDATION LOGIC FUNCTIONS ---

    // Function to validate the Full Name
    function validateFullName() {
        const nameValue = fullName.value.trim();
        if (nameValue.length < 5) {
            setError(fullName, 'Full name must be at least 5 characters long.');
            return false;
        }
        setSuccess(fullName);
        return true;
    }

    // Function to validate the Email
    function validateEmail() {
        const emailValue = email.value.trim();
        // A simple check for the '@' character
        if (!emailValue.includes('@')) {
            setError(email, 'Please enter a valid email address.');
            return false;
        }
        setSuccess(email);
        return true;
    }

    // Function to validate the Phone Number
    function validatePhone() {
        const phoneValue = phone.value.trim();
        // Check if it's exactly 10 digits and not the forbidden number
        if (phoneValue.length !== 10 || isNaN(phoneValue)) {
            setError(phone, 'Phone number must be a 10-digit number.');
            return false;
        }
        if (phoneValue === '1234567890') {
            setError(phone, 'Phone number cannot be 1234567890.');
            return false;
        }
        setSuccess(phone);
        return true;
    }

    // Function to validate the Password
    function validatePassword(passwordValue, nameValue) {
        if (passwordValue.length < 8) {
            setError(password, 'Password must be at least 8 characters long.');
            return false;
        }
        if (passwordValue.toLowerCase() === 'password') {
            setError(password, 'Password cannot be "password".');
            return false;
        }
        if (nameValue && passwordValue.toLowerCase() === nameValue.toLowerCase()) {
            setError(password, 'Password cannot be your name.');
            return false;
        }
        setSuccess(password);
        return true;
    }

    // Function to validate the Confirm Password
    function validateConfirmPassword(passwordValue, confirmPasswordValue) {
        if (confirmPasswordValue !== passwordValue) {
            setError(confirmPassword, 'Passwords do not match.');
            return false;
        }
        // Only show success if the field is not empty
        if (confirmPasswordValue) {
            setSuccess(confirmPassword);
        } else {
             setError(confirmPassword, 'Please confirm your password.');
             return false;
        }
        return true;
    }

    // --- 5. MASTER VALIDATION AND UTILITY FUNCTIONS ---

    /**
     * A helper function to validate a single field using a specific validation function.
     * This is used by the 'input' event listeners for real-time validation.
     * @param {HTMLElement} field - The input field to validate.
     * @param {Function} validationFunction - The function to use for validation.
     */
    function validateField(field, validationFunction) {
        validationFunction();
    }
    
    /**
     * The main function that validates the entire form.
     * It calls all individual validation functions and checks their return values.
     */
    function validateForm() {
        const isNameValid = validateFullName();
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();
        
        // Pass trimmed values directly to password validation functions
        const nameValue = fullName.value.trim();
        const passwordValue = password.value.trim();
        const confirmPasswordValue = confirmPassword.value.trim();
        
        const isPasswordValid = validatePassword(passwordValue, nameValue);
        const isConfirmPasswordValid = validateConfirmPassword(passwordValue, confirmPasswordValue);

        // If all fields are valid, show a success message
        if (isNameValid && isEmailValid && isPhoneValid && isPasswordValid && isConfirmPasswordValid) {
            alert('Form submitted successfully! 🎉');
            form.reset(); // Reset the form fields
            // Remove validation classes after reset
            document.querySelectorAll('.form-control').forEach(input => {
                input.classList.remove('is-valid', 'is-invalid');
            });
        }
    }
});

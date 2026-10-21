document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // جلوگیری از برگرداندن اسکرول قبلی توسط مرورگر
    // =====================================================

    if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
    }

    window.scrollTo(0, 0);


    // =====================================================
    // VARIABLES
    // =====================================================

    const form = document.getElementById("registrationForm");

    const steps = document.querySelectorAll(".step");

    const nextButton = document.getElementById("nextButton");

    const previousButton =
        document.getElementById("previousButton");

    const submitButton =
        document.getElementById("submitButton");

    const stepCounter =
        document.getElementById("stepCounter");

    const ratings =
        document.querySelectorAll(".rating button");

    const skillInput =
        document.getElementById("skill");


    let currentStep = 0;


    // =====================================================
    // SHOW STEP
    // =====================================================

    function showStep(index) {

        steps.forEach((step, i) => {

            step.classList.toggle(
                "active",
                i === index
            );

        });


        // دکمه قبلی

        previousButton.disabled =
            index === 0;


        // =================================================
        // شمارنده مراحل - برعکس
        // مثال:
        // مرحله اول: ۹ / ۹
        // مرحله دوم: ۸ / ۹
        // مرحله سوم: ۷ / ۹
        // ...
        // مرحله آخر: ۱ / ۹
        // =================================================

        const remainingStep =
            steps.length - index;

        stepCounter.textContent =
            `${persianNumber(steps.length)} / ${persianNumber(index + 1)}`;


        // =================================================
        // مرحله آخر
        // =================================================

        if (index === steps.length - 1) {

            nextButton.style.display = "none";

            previousButton.style.display = "block";

            submitButton.style.display = "block";

        } else {

            nextButton.style.display = "block";

            previousButton.style.display = "block";

            submitButton.style.display = "none";
        }


        // =================================================
        // فوکوس روی اولین فیلد
        // preventScroll باعث می‌شود فوکوس باعث
        // پایین رفتن صفحه نشود.
        // =================================================

        const activeStep =
            steps[index];

        const firstInput =
            activeStep.querySelector(
                "input:not([type='hidden']), textarea"
            );

        if (firstInput) {

            setTimeout(() => {

                firstInput.focus({
                    preventScroll: true
                });

            }, 100);
        }
    }


    // =====================================================
    // VALIDATE CURRENT STEP
    // =====================================================

    function validateCurrentStep() {

        const current =
            steps[currentStep];

        const requiredFields =
            current.querySelectorAll(
                "input[required], textarea[required]"
            );


        let valid = true;


        requiredFields.forEach(field => {

            field.classList.remove("invalid");


            if (!field.value.trim()) {

                field.classList.add("invalid");

                valid = false;
            }
        });


        // =================================================
        // مرحله میزان تسلط
        // =================================================

        if (currentStep === 5) {

            if (!skillInput.value) {

                valid = false;

                document
                    .querySelector(".skill-box")
                    .classList.add("invalid-skill");

            } else {

                document
                    .querySelector(".skill-box")
                    .classList.remove("invalid-skill");
            }
        }


        if (!valid) {

            const firstInvalid =
                current.querySelector(".invalid");

            if (firstInvalid) {

                firstInvalid.focus({
                    preventScroll: true
                });
            }
        }


        return valid;
    }


    // =====================================================
    // NEXT
    // =====================================================

    nextButton.addEventListener("click", () => {

        if (!validateCurrentStep()) {
            return;
        }


        if (currentStep < steps.length - 1) {

            currentStep++;

            showStep(currentStep);
        }

    });


    // =====================================================
    // PREVIOUS
    // =====================================================

    previousButton.addEventListener("click", () => {

        if (currentStep > 0) {

            currentStep--;

            showStep(currentStep);
        }

    });


    // =====================================================
    // RATING
    // =====================================================

    ratings.forEach(button => {

        button.addEventListener("click", () => {

            ratings.forEach(btn => {

                btn.classList.remove("selected");

            });


            button.classList.add("selected");


            const value =
                button.dataset.value;


            skillInput.value = value;


            document
                .querySelector(".skill-box")
                .classList.remove("invalid-skill");

        });

    });


    // =====================================================
    // INPUT FOCUS EFFECT
    // =====================================================

    const inputs =
        document.querySelectorAll(
            ".form-input, .textarea"
        );


    inputs.forEach(input => {

        input.addEventListener("focus", () => {

            input.parentElement
                ?.classList.add("focused");

        });


        input.addEventListener("blur", () => {

            input.parentElement
                ?.classList.remove("focused");

        });

    });


    // =====================================================
    // REMOVE INVALID WHEN USER TYPES
    // =====================================================

    inputs.forEach(input => {

        input.addEventListener("input", () => {

            if (input.value.trim()) {

                input.classList.remove("invalid");
            }

        });

    });


    // =====================================================
    // FORM SUBMIT - WEB3FORMS
    // =====================================================
    
    form.addEventListener("submit", async (event) => {
    
        event.preventDefault();
    
        // جلوگیری از چند بار کلیک کردن روی ثبت
        submitButton.disabled = true;
        submitButton.textContent = "در حال ارسال...";
    
        const formData = new FormData(form);
    
        try {
        
            const response = await fetch(
                "https://api.web3forms.com/submit",
                {
                    method: "POST",
                    body: formData
                }
            );
        
            const result = await response.json();
        
            if (result.success) {
            
                // نمایش پیام موفقیت
                form.innerHTML = `
                    <div class="success-message">
                        درخواست شما با موفقیت ثبت شد 🌹
                        <br>
                        <small>
                            ممنون که برای همکاری با انجمن علمی اقدام کردید.
                        </small>
                    </div>
                `;
            
            } else {
            
                console.error("Web3Forms error:", result);
            
                submitButton.disabled = false;
                submitButton.textContent = "ثبت درخواست";
            
                alert(
                    "ارسال اطلاعات انجام نشد. لطفاً دوباره تلاش کنید."
                );
            }
        
        } catch (error) {
        
            console.error("Network error:", error);
        
            submitButton.disabled = false;
            submitButton.textContent = "ثبت درخواست";
        
            alert(
                "خطایی در اتصال به سرور رخ داد. لطفاً دوباره تلاش کنید."
            );
        }
    
    });

    // =====================================================
    // PERSIAN NUMBERS
    // =====================================================

    function persianNumber(number) {

        const numbers = [
            "۰",
            "۱",
            "۲",
            "۳",
            "۴",
            "۵",
            "۶",
            "۷",
            "۸",
            "۹"
        ];


        return String(number)
            .split("")
            .map(char => {

                return numbers[Number(char)] ?? char;

            })
            .join("");
    }


    // =====================================================
    // INITIAL STEP
    // =====================================================

    showStep(currentStep);


    // یک بار دیگر بعد از لود شدن اولیه
    // اسکرول را کاملاً به بالای صفحه برمی‌گردانیم.

    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 50);

});
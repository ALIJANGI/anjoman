document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // جلوگیری از برگرداندن اسکرول قبلی
    // =====================================================

    if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
    }


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


    // میزان تسلط ادیت
    const ratings =
        document.querySelectorAll(".rating:not(.experience-yes-no):not(.technical-rating) button");

    const skillInput =
        document.getElementById("skill");


    // تجربه بله / خیر
    const experienceButtons =
        document.querySelectorAll(".experience-yes-no button");

    const technicalExperienceInput =
        document.getElementById("technical-experience");


    // میزان تجربه 1 تا 4
    const technicalRatingButtons =
        document.querySelectorAll(".technical-rating button");

    const technicalSkillInput =
        document.getElementById("technical-skill");


    // شماره موبایل
    const phoneInput =
        document.getElementById("number");


    let currentStep = 0;


    // =====================================================
    // تبدیل اعداد فارسی و عربی به انگلیسی
    // =====================================================

    function normalizeDigits(value) {

        return String(value)
            .replace(/[۰-۹]/g, digit => {
                return String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit));
            })
            .replace(/[٠-٩]/g, digit => {
                return String("٠١٢٣٤٥٦٧٨٩".indexOf(digit));
            });

    }


    // =====================================================
    // اعتبارسنجی شماره موبایل
    // =====================================================

    function validatePhoneNumber() {

        const value =
            normalizeDigits(phoneInput.value.trim());

        // مقدار نرمال‌شده را دوباره داخل input قرار می‌دهیم
        phoneInput.value = value;

        // باید دقیقاً 11 رقم و با 09 شروع شود
        const phoneRegex = /^09\d{9}$/;

        if (!phoneRegex.test(value)) {

            phoneInput.classList.add("invalid");

            return false;
        }

        phoneInput.classList.remove("invalid");

        return true;
    }


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


        // شمارنده
        stepCounter.textContent =
            `${persianNumber(steps.length)} / ${persianNumber(index + 1)}`;


        // مرحله آخر
        if (index === steps.length - 1) {

            nextButton.style.display = "none";

            previousButton.style.display = "block";

            submitButton.style.display = "block";

        } else {

            nextButton.style.display = "block";

            previousButton.style.display = "block";

            submitButton.style.display = "none";

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


        // بررسی فیلدهای معمولی
        requiredFields.forEach(field => {

            field.classList.remove("invalid");


            if (!field.value.trim()) {

                field.classList.add("invalid");

                valid = false;
            }

        });


        // =================================================
        // شماره موبایل
        // =================================================

        if (currentStep === 2) {

            if (!validatePhoneNumber()) {

                valid = false;
            }

        }


        // =================================================
        // مرحله میزان تسلط به ادیت
        // =================================================

        if (currentStep === 5) {

            const skillBox =
                current.querySelector(".skill-box");


            if (!skillInput.value) {

                valid = false;

                skillBox.classList.add("invalid-skill");

            } else {

                skillBox.classList.remove("invalid-skill");

            }

        }


        // =================================================
        // مرحله تجربه بله / خیر
        // =================================================

        if (currentStep === 6) {

            const skillBox =
                current.querySelector(".skill-box");


            if (!technicalExperienceInput.value) {

                valid = false;

                skillBox.classList.add("invalid-skill");

            } else {

                skillBox.classList.remove("invalid-skill");

            }

        }


        // =================================================
        // مرحله میزان تجربه 1 تا 4
        // =================================================

        if (currentStep === 7) {

            const skillBox =
                current.querySelector(".skill-box");


            if (!technicalSkillInput.value) {

                valid = false;

                skillBox.classList.add("invalid-skill");

            } else {

                skillBox.classList.remove("invalid-skill");

            }

        }


        // =================================================
        // اگر خطایی وجود داشت
        // =================================================

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
    // RATING - ادیت عکس و ویدیو
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
                .querySelector(".step[data-step='5'] .skill-box")
                ?.classList.remove("invalid-skill");

        });

    });


    // =====================================================
    // تجربه بله / خیر
    // =====================================================

    experienceButtons.forEach(button => {

        button.addEventListener("click", () => {


            experienceButtons.forEach(btn => {

                btn.classList.remove("selected");

            });


            button.classList.add("selected");


            technicalExperienceInput.value =
                button.dataset.value;


            document
                .querySelector(".step[data-step='6'] .skill-box")
                ?.classList.remove("invalid-skill");

        });

    });


    // =====================================================
    // میزان تجربه 1 تا 4
    // =====================================================

    technicalRatingButtons.forEach(button => {

        button.addEventListener("click", () => {


            technicalRatingButtons.forEach(btn => {

                btn.classList.remove("selected");

            });


            button.classList.add("selected");


            technicalSkillInput.value =
                button.dataset.value;


            document
                .querySelector(".step[data-step='7'] .skill-box")
                ?.classList.remove("invalid-skill");

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
    // تبدیل اعداد شماره موبایل هنگام تایپ
    // =====================================================

    phoneInput.addEventListener("input", () => {

        phoneInput.value =
            normalizeDigits(phoneInput.value);

        phoneInput.classList.remove("invalid");

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


        // آخرین مرحله هم قبل از ارسال بررسی شود
        if (!validateCurrentStep()) {
            return;
        }


        submitButton.disabled = true;

        submitButton.textContent =
            "در حال ارسال...";


        const formData =
            new FormData(form);


        const data =
            Object.fromEntries(formData.entries());


        try {

            const response =
                await fetch(
                    "https://api.web3forms.com/submit",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },

                        body: JSON.stringify(data)
                    }
                );


            const result =
                await response.json();


            console.log(
                "Web3Forms response:",
                result
            );


            if (response.ok && result.success) {

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

                console.error(
                    "Web3Forms error:",
                    result
                );


                submitButton.disabled = false;

                submitButton.textContent =
                    "ثبت درخواست";


                alert(
                    result.message ||
                    "ارسال اطلاعات انجام نشد. لطفاً دوباره تلاش کنید."
                );

            }


        } catch (error) {

            console.error(
                "Network error:",
                error
            );


            submitButton.disabled = false;

            submitButton.textContent =
                "ثبت درخواست";


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

});
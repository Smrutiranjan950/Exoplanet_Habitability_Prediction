/* =========================================================
   EXOHABIT
   FRONTEND JAVASCRIPT
   ========================================================= */


/* =========================================================
   PREDICTION FORM
   ========================================================= */

const predictionForm =
    document.getElementById("predictionForm");


predictionForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        /* -------------------------------------------------
           RESULT ELEMENTS
           ------------------------------------------------- */

        const resultText =
            document.getElementById(
                "predictionText"
            );

        const resultDescription =
            document.querySelector(
                ".result-description"
            );

        const habitableProbability =
            document.getElementById(
                "habitableProbability"
            );

        const notHabitableProbability =
            document.getElementById(
                "notHabitableProbability"
            );

        const habitableBar =
            document.getElementById(
                "habitableBar"
            );

        const notHabitableBar =
            document.getElementById(
                "notHabitableBar"
            );


        /* -------------------------------------------------
           SHOW ANALYZING
           ------------------------------------------------- */

        resultText.innerText =
            "Analyzing...";

        resultDescription.innerText =
            "Machine-learning system is processing the supplied astronomical parameters.";

        habitableProbability.innerText =
            "--%";

        notHabitableProbability.innerText =
            "--%";

        habitableBar.style.width =
            "0%";

        notHabitableBar.style.width =
            "0%";


        /* -------------------------------------------------
           GET INPUT DATA
           ------------------------------------------------- */

        const data = {

            pl_rade:
                document.getElementById(
                    "pl_rade"
                ).value,

            pl_orbper:
                document.getElementById(
                    "pl_orbper"
                ).value,

            pl_eqt:
                document.getElementById(
                    "pl_eqt"
                ).value,

            pl_insol:
                document.getElementById(
                    "pl_insol"
                ).value,

            st_teff:
                document.getElementById(
                    "st_teff"
                ).value,

            st_rad:
                document.getElementById(
                    "st_rad"
                ).value,

            st_mass:
                document.getElementById(
                    "st_mass"
                ).value,

            st_logg:
                document.getElementById(
                    "st_logg"
                ).value
        };


        /* -------------------------------------------------
           SEND REQUEST TO FLASK
           ------------------------------------------------- */

        try {

            const response =
                await fetch(
                    "/predict",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(data)
                    }
                );


            /* -------------------------------------------------
               CHECK RESPONSE
               ------------------------------------------------- */

            if (!response.ok) {

                throw new Error(
                    "Server returned an error."
                );

            }


            const result =
                await response.json();


            /* -------------------------------------------------
               DISPLAY PREDICTION
               ------------------------------------------------- */

            resultText.innerText =
                result.prediction;


            resultDescription.innerText =
                "Analysis completed successfully using the trained Random Forest classification model.";


            /* -------------------------------------------------
               DISPLAY PROBABILITIES
               ------------------------------------------------- */

            const habitable =
                Number(
                    result.habitable_probability
                );

            const notHabitable =
                Number(
                    result.not_habitable_probability
                );


            habitableProbability.innerText =
                habitable + "%";


            notHabitableProbability.innerText =
                notHabitable + "%";


            /* -------------------------------------------------
               UPDATE PROGRESS BARS
               ------------------------------------------------- */

            setTimeout(
                function () {

                    habitableBar.style.width =
                        habitable + "%";

                    notHabitableBar.style.width =
                        notHabitable + "%";

                },
                100
            );


            /* -------------------------------------------------
               RESULT VISUAL
               ------------------------------------------------- */

            if (
                result.prediction ===
                "Potentially Habitable"
            ) {

                resultText.style.color =
                    "#4ade80";

            } else {

                resultText.style.color =
                    "#fb7185";

            }


        }


        /* -------------------------------------------------
           ERROR HANDLING
           ------------------------------------------------- */

        catch (error) {

            console.error(error);


            resultText.innerText =
                "Prediction Error";


            resultText.style.color =
                "#fb7185";


            resultDescription.innerText =
                "Unable to connect to the prediction server. Please check that Flask is running.";


            habitableProbability.innerText =
                "--%";

            notHabitableProbability.innerText =
                "--%";


            habitableBar.style.width =
                "0%";

            notHabitableBar.style.width =
                "0%";

        }

    }
);


/* =========================================================
   NAVBAR ACTIVE LINK
   ========================================================= */

const sections =
    document.querySelectorAll(
        "section[id]"
    );

const navLinks =
    document.querySelectorAll(
        ".nav-links a"
    );


window.addEventListener(
    "scroll",
    function () {

        let currentSection = "";


        sections.forEach(
            function (section) {

                const sectionTop =
                    section.offsetTop - 150;

                const sectionHeight =
                    section.offsetHeight;


                if (
                    window.scrollY >=
                    sectionTop
                    &&
                    window.scrollY <
                    sectionTop + sectionHeight
                ) {

                    currentSection =
                        section.getAttribute(
                            "id"
                        );

                }

            }
        );


        navLinks.forEach(
            function (link) {

                link.classList.remove(
                    "active"
                );


                if (
                    link.getAttribute("href") ===
                    "#" + currentSection
                ) {

                    link.classList.add(
                        "active"
                    );

                }

            }
        );

    }
);


/* =========================================================
   SMOOTH SCROLL
   ========================================================= */

navLinks.forEach(
    function (link) {

        link.addEventListener(
            "click",
            function (event) {

                const target =
                    document.querySelector(
                        link.getAttribute("href")
                    );


                if (target) {

                    event.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth"
                    });

                }

            }
        );

    }
);


/* =========================================================
   INPUT VALIDATION
   ========================================================= */

const numberInputs =
    document.querySelectorAll(
        "#predictionForm input"
    );


numberInputs.forEach(
    function (input) {

        input.addEventListener(
            "input",
            function () {

                if (
                    this.value !== ""
                    &&
                    !isNaN(this.value)
                ) {

                    this.style.borderColor =
                        "rgba(34,211,238,0.25)";

                } else {

                    this.style.borderColor =
                        "";

                }

            }
        );

    }
);
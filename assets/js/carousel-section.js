$(document).ready(
    function () {
        // Bind buttons
        let sectionBtn01 = $("#section-01")
        let sectionBtn02 = $("#section-02")
        let sectionBtn03 = $("#section-03")
        let sectionBtn04 = $("#section-04")
        let sectionBtn05 = $("#section-05")
        const buttons = [sectionBtn01, sectionBtn02, sectionBtn03, sectionBtn04, sectionBtn05];

        // Bind categories
        let category01 = $("#carousel-1");
        let category02 = $("#carousel-2");
        let category03 = $("#carousel-3");
        let category04 = $("#carousel-4");
        let category05 = $("#carousel-5");
        const categories = [category01, category02, category03, category04, category05];

        function activateSingleButton(selectedButton) {
            // Remove active class from every button that was not selected
            buttons.forEach(button => {
                button === selectedButton ? button.addClass('active') : button.removeClass('active');
            })
        }

        function displaySingleCategory(selectedCategory) {
            categories.forEach(category => {
                category === selectedCategory ? category.removeClass('d-none') : category.addClass('d-none');
            })
            // Reset carousel to first slide
            selectedCategory.carousel(0);
        }

        // Define button functions
        sectionBtn01.click(function () {
            activateSingleButton(sectionBtn01);
            displaySingleCategory(category01);
        });

        sectionBtn02.click(function () {
            activateSingleButton(sectionBtn02);
            displaySingleCategory(category02);
        });

        sectionBtn03.click(function () {
            activateSingleButton(sectionBtn03);
            displaySingleCategory(category03);
        });

        sectionBtn04.click(function () {
            activateSingleButton(sectionBtn04);
            displaySingleCategory(category04);
        });

        sectionBtn05.click(function () {
            activateSingleButton(sectionBtn05);
            displaySingleCategory(category05);
        });
    }
);

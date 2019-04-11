$(document).ready(
    function () {

        // Bind buttons
        let sectionBtn01 = $("#section-01")
        let sectionBtn02 = $("#section-02")
        let sectionBtn03 = $("#section-03")

        // Bind HTML sections
        let category01 = $("#carousel-1");
        let category02 = $("#carousel-2");
        
        // Define button functions
        sectionBtn01.click(function () {
            category02.addClass('d-none')
            category01.removeClass('d-none')
            sectionBtn01.addClass('active')
            sectionBtn02.removeClass('active')
        });

        sectionBtn02.click(function () {
            category01.addClass('d-none')
            category02.removeClass('d-none')
            sectionBtn01.removeClass('active');
            sectionBtn02.addClass('active');
        });

    }
);

$(document).ready(
    function () {
        // Bind buttons
        let carouselButton1 = $("#carousel-button-1")
        let carouselButton2 = $("#carousel-button-2")
        let carouselButton3 = $("#carousel-button-3")
        let carouselButton4 = $("#carousel-button-4")
        let carouselButton5 = $("#carousel-button-5")
        const carouselButtons = [carouselButton1, carouselButton2, carouselButton3, carouselButton4, carouselButton5];

        // Bind carousels
        let carousel1 = $("#carousel-1");
        let carousel2 = $("#carousel-2");
        let carousel3 = $("#carousel-3");
        let carousel4 = $("#carousel-4");
        let carousel5 = $("#carousel-5");
        const carousels = [carousel1, carousel2, carousel3, carousel4, carousel5];

        function activateSingleButton(selectedButton) {
            // Remove active class from every button that was not selected
            carouselButtons.forEach(button => {
                button === selectedButton ? button.addClass('active') : button.removeClass('active');
            })
        }

        function displaySingleCarousel(selectedCarousel) {
            carousels.forEach(carousel => {
                carousel === selectedCarousel ? carousel.removeClass('d-none') : carousel.addClass('d-none');
            })
            // Reset carousel to first slide
            selectedCarousel.carousel(0);
        }

        // Define button functions
        carouselButton1.click(function () {
            activateSingleButton(carouselButton1);
            displaySingleCarousel(carousel1);
        });

        carouselButton2.click(function () {
            activateSingleButton(carouselButton2);
            displaySingleCarousel(carousel2);
        });

        carouselButton3.click(function () {
            activateSingleButton(carouselButton3);
            displaySingleCarousel(carousel3);
        });

        carouselButton4.click(function () {
            activateSingleButton(carouselButton4);
            displaySingleCarousel(carousel4);
        });

        carouselButton5.click(function () {
            activateSingleButton(carouselButton5);
            displaySingleCarousel(carousel5);
        });
    }
);
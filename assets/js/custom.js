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

$(document).ready(
    function () {
        // Bind buttons
        let publicationButton1 = $("#publication-button-1")
        let publicationButton2 = $("#publication-button-2")
        const publicationButtons = [publicationButton1, publicationButton2];

        // Bind publications
        let publication1 = $("#publication-1");
        let publication2 = $("#publication-2");
        const publications = [publication1, publication2];

        function activateSingleButton(selectedButton) {
            // Remove active class from every button that was not selected
            publicationButtons.forEach(button => {
                button === selectedButton ? button.addClass('active') : button.removeClass('active');
            });
        }

        function displaySinglePublication(selectedPublication) {
            publications.forEach(publication => {
                publication === selectedPublication ? publication.removeClass('d-none') : publication.addClass('d-none');
            });
        }

        // Define button functions
        publicationButton1.click(function () {
            activateSingleButton(publicationButton1);
            displaySinglePublication(publication1);
        });

        publicationButton2.click(function () {
            activateSingleButton(publicationButton2);
            displaySinglePublication(publication2);
        });
    }
)

$(document).ready(
    function () {
        // Bind buttons
        let communityResourceButton1 = $("#community-resource-button-1")
        let communityResourceButton2 = $("#community-resource-button-2")
        const communityResourceButtons = [communityResourceButton1, communityResourceButton2];

        // Bind communityResources
        let communityResource1 = $("#community-resources-1");
        let communityResource2 = $("#community-resources-2");
        const communityResources = [communityResource1, communityResource2];

        function activateSingleButton(selectedButton) {
            // Remove active class from every button that was not selected
            communityResourceButtons.forEach(button => {
                button === selectedButton ? button.addClass('active') : button.removeClass('active');
            });
        }

        function displaySinglePublication(selectedPublication) {
            communityResources.forEach(communityResource => {
                communityResource === selectedPublication ? communityResource.removeClass('d-none') : communityResource.addClass('d-none');
            });
        }

        // Define button functions
        communityResourceButton1.click(function () {
            activateSingleButton(communityResourceButton1);
            displaySinglePublication(communityResource1);
        });

        communityResourceButton2.click(function () {
            activateSingleButton(communityResourceButton2);
            displaySinglePublication(communityResource2);
        });
    }
)

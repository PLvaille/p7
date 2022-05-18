function dynamicFeed() {

    let dynamicFeed = document.querySelector('#dynamicFeed');
    let newDiv = document.createElement('div');
    let newh3 = document.createElement('h3');
    let newImg = document.createElement('img');
    let newParagraph = document.createElement('p');




    let newCard = dynamicFeed.appendChild(newDiv).classList.add("card");
    let cardBody = newCard.appendChild(newDiv).classList.add("card-body");
    let cardTitle = cardBody.appendChild(newh3).classList.add("card-title");
    let cardText = cardBody.appendChild(newParagraph).classList.add("card-text");

    cardTitle.textcontent = "bonjour";
    cardText.textcontent = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Explicabo, molestiae."


}

dynamicFeed();

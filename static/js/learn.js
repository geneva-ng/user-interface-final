// JavaScript Document
$(document).ready(function () {
	
	 let title = $('<div/>', {
		text: data.title,
      class: "col-12",
      id: "title",
    });
    $('#titleColumn').append(title);
	
  if (data.leftText1.length > 0) {
    let leftText1 = $('<div/>', {
		html: data.leftText1,
      class: "col-12 mx-1",
      id: "leftText1",
    });
    $('#leftColumn').append(leftText1);
  }

  if (data.leftText2.length > 0) {
    let leftText2 = $('<div/>', {
		html: data.leftText2,
      class: "col-12 mx-1",
      id: "leftText2",
    });
    $('#leftColumn').append(leftText2);
  }
  if (data.leftImage.src.length > 0) {
    let leftImage = $('<img/>', {
      class: "img-fluid mx-1",
      id: "leftImage",
      src: data.leftImage.src,
      alt: data.leftImage.alt,
    });
    $('#leftColumn').append(leftImage);
  }
  if (data.centerImage.src.length > 0) {
    let centerImage = $('<img/>', {
      class: "img-fluid mx-1",
      id: "centerImage",
      src: data.centerImage.src,
      alt: data.centerImage.alt,
    });
    $('#centerColumn').append(centerImage);
  }
  if (data.rightText1.length > 0) {
    let rightText1 = $('<div/>', {
		html: data.rightText1,
      class: "col-12 mx-1",
      id: "rightText1",
    });
    $('#rightColumn').append(rightText1);
  }

  if (data.rightText2.length > 0) {
    let rightText2 = $('<div/>', {
		html: data.rightText2,
      class: "col-12 mx-1",
      id: "rightText2",
    });
    $('#rightColumn').append(rightText2);
  }
	  if (data.rightImage.src.length > 0) {
    let rightImage = $('<img/>', {
      class: "img-fluid mx-3",
      id: "rightImage",
      src: data.rightImage.src,
      alt: data.rightImage.alt,
    });
    $('#rightColumn').append(rightImage);
  }
	  var backButton = $('<a/>', {
			text: 'Back', 
			class: 'btn btn-primary',
			href: "/learn/" + (data.id -1),
			role: 'button' 
  });
	$('#buttonColumn').append(backButton);
	
		  var continueButton = $('<a/>', {
			text: 'Continue', 
			class: 'btn btn-primary',
			href: "/learn/" + (data.id+ 1),
			role: 'button' 
  });
	$('#buttonColumn').append(continueButton);
});

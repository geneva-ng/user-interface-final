// JavaScript Document
$(document).ready(function () {

  var currentState = 'initial';


  let title = $('<div/>', {
    text: data.title,
    class: "col-12 learnTitle",
    id: "title",
  });
  $('#titleColumn').append(title);

  if (data.leftText1.length > 0) {
    let leftText1 = $('<div/>', {
      html: data.leftText1,
      class: "col-12 learnTextPlain",
      id: "leftText1",
    });
    $('#leftColumn').append(leftText1);
  }

  if (data.leftText2.length > 0) {
    let leftText2 = $('<div/>', {
      html: data.leftText2,
      class: "col-12 learnTextPlain",
      id: "leftText2",
    });
    $('#leftColumn').append(leftText2);
  }
  if (data.leftImage.src.length > 0) {
    let leftImage = $('<img/>', {
      class: "img-fluid learnSideImage",
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
      class: "col-12 learnTextPlain",
      id: "rightText1",
    });
    $('#rightColumn').append(rightText1);
  }

  if (data.rightText2.length > 0) {
    let rightText2 = $('<div/>', {
      html: data.rightText2,
      class: "col-12 learnTextPlain",
      id: "rightText2",
    });
    $('#rightColumn').append(rightText2);
  }
  if (data.rightImage.src.length > 0) {
    let rightImage = $('<img/>', {
      class: "img-fluid learnSideImage",
      id: "rightImage",
      src: data.rightImage.src,
      alt: data.rightImage.alt,
    });
    $('#rightColumn').append(rightImage);
  }

  var backButton = $('<a/>', {
    id: 'backButton',
    text: 'Back',
    class: 'btn btn-primary',
    href: "/learn/" + (data.id - 1),
    role: 'button'
  });
  $('#buttonColumn').append(backButton);


  var continueButton = $('<a/>', {
    id: 'continueButton',
    text: 'Continue',
    class: 'btn btn-primary',
    href: "/learn/" + (data.id + 1),
    role: 'button'
  });
  $('#buttonColumn').append(continueButton);
  continueButton.hide();
  //continueButton.show();


  if (data.id == 1) {
    backButton.hide();
    continueButton.css('margin-left', 'auto')
  }


  transitionState();


  function transitionState() {
    const state = data.states[currentState];
    console.log(state);
    if (!state) return;

    switch (state.action) {
      case 'initial':
			if (state.next) {
      currentState = state.next;

    }
			 transitionState();
        break;
      case 'drag':
        setupDragAndDrop(state.source, state.target);
        break;
      case 'click':
        setupClickable(state.target);
        break;
      case 'enable':
		if (!data.lastPage){
	        $(state.target).show();
		}


        break;
      case 'updateSrc':
        updateImageSrc(state.target, state.feedback.newSrc, state.feedback.newAlt);
        currentState = data.states[currentState].next;
        
        break;
    }
    if (state.next) {
      currentState = state.next;

    }
	 

  }


});

// JavaScript Document
$(document).ready(function () {

  var currentState = 'initial';
// This is where the initial containers are added. There are right, center, and left columns. The data for these columns is provided by the json.
  let title = $('<div/>', {
    text: data.title,
    class: "col-12 learnTitle",
    id: "title",
    style: "text-align: center;"
  });
  $('#titleColumn').append(title);


  let leftText1 = $('<div/>', {
    html: data.leftText1, //these all use html instead of .text() so we can use bolded letters
    class: "col-12 learnTextPlain",
    id: "leftText1",
    style: "margin-bottom: 36px;"
  });
  $('#leftColumn').append(leftText1);


  let leftText2 = $('<div/>', {
    html: data.leftText2,
    class: "col-12 learnTextPlain",
    id: "leftText2",
  });
  $('#leftColumn').append(leftText2);


  let leftImage = $('<img/>', {
    class: "img-fluid learnSideImage",
    id: "leftImage",
    src: data.leftImage.src,
    alt: data.leftImage.alt,
  });
  $('#leftColumn').append(leftImage);


  let imageWrapper = $('<div/>', {
    id: "imageWrapper",
    class: "",
    style: "position: relative; display: inline-block; height:700px; width:auto" // I hardcoded the size to control where the buttons end up
  });

  // Create the image element
  let centerImage = $('<img/>', {
    class: " mx-1",
    id: "centerImage",
    src: data.centerImage.src,
    alt: data.centerImage.alt,
    style: "display: block; width: 100%; height: auto;" 
  });


  imageWrapper.append(centerImage);
  if (!data.lastPage) {
    $('#centerColumn').append(imageWrapper);
  }

  let rightText1 = $('<div/>', {
    html: data.rightText1,
    class: "col-12 learnTextPlain",
    id: "rightText1",
    style: "margin-bottom: 44px;"
  });
  $('#rightColumn').append(rightText1);


  let rightText2 = $('<div/>', {
    html: data.rightText2,
    class: "col-12 learnTextPlain",
    id: "rightText2",
  });
  $('#rightColumn').append(rightText2);

  let rightImage = $('<img/>', {
    class: "img-fluid learnSideImage",
    id: "rightImage",
    src: data.rightImage.src,
    alt: data.rightImage.alt,
  });
  $('#rightColumn').append(rightImage);

  var backButton = $('<a/>', {
    id: 'backButton',
    text: 'Back',
    class: 'btn btn-primary active',
    href: "/learn/" + (data.id - 1),
    role: 'button'
  });
  $('#buttonColumn').append(backButton);


  var continueButton = $('<a/>', {
    id: 'continueButton',
    text: 'Continue',
    class: 'btn btn-primary active',
    href: "/learn/" + (data.id + 1),
    role: 'button'
  });
  $('#buttonColumn').append(continueButton);
  continueButton.hide();


  if (data.id == 1) {
    backButton.hide();
    continueButton.css('margin-left', 'auto')
  }


  transitionState();

// this is the state machine. The state info comes from the json. It just goes from one state to the next with handler functions to perform different actions.
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
        setupDragAndDrop(state.source, state.target, state.next); // Pass the next state to the setup function
        break;
      case 'changeImage':
        changeImage(state.target, state.url);
        currentState = state.next;
        transitionState();
        break;
      case 'changeText':
        changeText(state.target, state.text);
        currentState = state.next;
        transitionState();
        break;
      case 'clickableArea':
        setupClickableArea(state.target, state.area, state.next);
        break;
      case 'lastPage':
        handleLastPage(state);
        break;
      case 'enable':
        if (!data.lastPage) {
          $(state.target).show();
        }
        break;

    }
    if (state.next) {
      currentState = state.next;
    }
  }

// generates last page with stuff in the center column
  function handleLastPage(state) {
    $('#centerColumn').append(state.centerText);
    $('#centerColumn').append(state.centerButton);
    $('#centerColumn').append(state.centerButton2);
  }


  function changeImage(target, url) {
    $(target).show();
    $(target).attr('src', url);
  }

  function changeText(target, text) {
    var $target = $(target);
    if ($target.length === 0) {

      $target = $('<div/>', {
        id: "rightText2",
        class: "col-12 learnTextPlain",
      });
      $('#rightColumn').append($target);
    }
    $target.html(text); 
  }

  function setupClickableArea(target, area, nextState) {
    const container = $(target);

    // Calculate percentage positions based on the container's dimensions
    const topPercent = (area.y / container.height()) * 100;
    const leftPercent = (area.x / container.width()) * 100;
    const widthPercent = (area.width / container.width()) * 100;
    const heightPercent = (area.height / container.height()) * 100;

    // div for the clickable area with circular shape
    const clickableArea = $('<div></div>').css({
      position: 'absolute',
      top: topPercent + '%',
      left: leftPercent + '%',
      width: widthPercent + '%',
      height: heightPercent + '%',
      borderRadius: '50%', // Make the div circular
      cursor: 'pointer',
      backgroundColor: 'rgba(0, 255, 0, 0.2)', 
      zIndex: 10 
    });

    container.append(clickableArea);

    // Bind click event to the clickable area
    clickableArea.click(function (event) {
      clickableArea.hide();
      event.preventDefault(); 
      currentState = nextState;
      transitionState(); 

    });
  }

  function setupDragAndDrop(source, target, nextState) {
    $(source).draggable({
      revert: true,
      revertDuration: 0,
      zIndex: 1000, 
      cursor: 'default' 
    }).hover(
      function () {
        $(this).css('cursor', 'grab'); // Change cursor on hover
      },
      function () {
        $(this).css('cursor', 'default'); // Reset cursor
      }
    );

    $(target).droppable({
      over: function (event, ui) {
        // Change opacity on hover
        $(this).css("opacity", "0.7"); 
      },
      out: function (event, ui) {
        // Restore opacity
        $(this).css("opacity", "1"); 
      },
      drop: function (event, ui) {
        ui.draggable.hide();

        var $droppable = $(this);
        $droppable.css("opacity", "1"); 
        currentState = nextState;
        transitionState();
      }
    });
  }


});

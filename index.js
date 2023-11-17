let addBtn = document.querySelector(".add-btn");
let modalCont = document.querySelector(".modal-box");
let allPriorityColors = document.querySelectorAll(".priority-color");
let textAreaCont = document.querySelector(".textarea-cont");
let mainTicketCont = document.querySelector(".main-ticket-cont");
let removeBtn = document.querySelector(".remove-btn");

let toolBoxColors = document.querySelectorAll(".color");
let modalPriorityColor = "lightpink"; //color selected in modal priority cont
let addTaskFlag = false;
let removeTaskFlag = false;
let lockIconClass = "fa-lock";
let unlockIconClass = "fa-lock-open";
let colorArray = ["lightpink", "lightgreen", "lightblue", "black"];
let ticketArray = [];

addBtn.addEventListener("click", (event) => {
  addTaskFlag = !addTaskFlag;

  if (addTaskFlag == true) {
    //show
    modalCont.style.display = "flex";
  } else {
    modalCont.style.display = "none";
  }
});

// selecting ticket color
for (let i = 0; i < allPriorityColors.length; i++) {
  allPriorityColors[i].addEventListener("click", (e) => {
    ///remove active class from all divs
    //console.log(e);
    for (let j = 0; j < allPriorityColors.length; j++) {
      allPriorityColors[j].classList.remove("active");
    }
    //add active to the clicked div
    allPriorityColors[i].classList.add("active");
    modalPriorityColor = allPriorityColors[i].classList[0];
    //console.log(modalPriorityColor);
  });
}

//creating ticket
modalCont.addEventListener("keydown", (event) => {
  let key = event.key;
  if (key === "Shift") {
    ///create Ticket
    let ticketDesc = textAreaCont.value;
    //let ticketId = shortid();
    //console.log('calling create ticket')
    createTicket(modalPriorityColor, ticketDesc);
    //close modal box
    modalCont.style.display = "none";
    addTaskFlag = !addTaskFlag;
    //clear text Area
    textAreaCont.value = "";
  }
});

function createTicket(ticketColor, ticketContent, ticketId) {
  //console.log('inside function')
  let id = ticketId || shortid();
  let ticketCont = document.createElement("div");
  ticketCont.classList.add("ticket-cont");
  ticketCont.innerHTML = `<div class="ticket-color ${ticketColor}"></div><div class="ticket-id">${id}</div><div class="task-area">${ticketContent}</div><div class="ticket-lock"><i class="fa-solid fa-lock"></i></div>`;
  //console.log('ticket container')
  mainTicketCont.appendChild(ticketCont);
  let TicketMetaData = {
    ticketColor,
    ticketId: id,
    ticketContent,
  };
  // if freshly created ticket, push it into ticket array
  // if recreated one dont push
  if (!ticketId) {
    ticketArray.push(TicketMetaData);
    localStorage.setItem("tickets", JSON.stringify(ticketArray));
  }

  //console.log(ticketArray);
  handleRemove(ticketCont);
  handleLock(ticketCont);
  handleColor(ticketCont);
}

//Remove Button
removeBtn.addEventListener("click", (event) => {
  //console.log("remove button clicked");
  removeTaskFlag = !removeTaskFlag;
  if (removeTaskFlag == true) {
    //show Alert
    alert("delete mode is Activated");
    // change the icon color to red
    removeBtn.style.color = "red";
  } else {
    removeBtn.style.color = "white";
  }
});

function handleRemove(ticket) {
  ticket.addEventListener("click", (event) => {
    if (removeTaskFlag == true) {
      let ticketId = ticket.children[1].innerText;
      let ticketIndex = ticketArray.findIndex((t) => {
        return t.ticketId == ticketId;
      });
      ticketArray.splice(ticketIndex, 1);
      //handle local storage 
      localStorage.setItem("tickets", JSON.stringify(ticketArray));
      ticket.remove();
    }
  });
}

//handling lock
function handleLock(ticket) {
  let ticketLockEle = ticket.querySelector(".ticket-lock");
  let ticketLockIcon = ticketLockEle.children[0];
  let ticketTextArea = ticket.querySelector(".task-area");
  ticketLockIcon.addEventListener("click", (event) => {
    if (ticketLockIcon.classList.contains(lockIconClass)) {
      //remove locked class
      ticketLockIcon.classList.remove(lockIconClass);
      //add unlock class
      ticketLockIcon.classList.add(unlockIconClass);
      //make ticket Editable
      ticketTextArea.setAttribute("contenteditable", "true");
    } else {
      //remove unlock class
      ticketLockIcon.classList.remove(unlockIconClass);
      //add lock class
      ticketLockIcon.classList.add(lockIconClass);
      //make ticket uneditable
      ticketTextArea.setAttribute("contenteditable", "false");
      // updating text Area value after editing ticket
      let ticketId = ticket.children[1].innerText;

      ticketArray.forEach((t) => {
        if (t.ticketId == ticketId) {
          t.ticketContent = ticketTextArea.innerText;
        }
        //console.log(ticketArray);
        
      });
      localStorage.setItem("tickets", JSON.stringify(ticketArray));
    }
  });
}

//handle color
function handleColor(ticket) {
  let ticketColorBand = ticket.querySelector(".ticket-color");
  ticketColorBand.addEventListener("click", () => {
    let currentColor = ticketColorBand.classList[1];
    let currentColorIndex = colorArray.findIndex((color) => {
      return color == currentColor;
    });
    currentColorIndex++;
    let newColorIndex = currentColorIndex % colorArray.length;
    let newColor = colorArray[newColorIndex];
    //remove current color class

    ticketColorBand.classList.remove(currentColor);
    // add new color class
    ticketColorBand.classList.add(newColor);

    let ticketid = ticket.children[1].innerText;
    ticketArray.forEach((t) => {
      if (t.ticketId == ticketid) {
        t.ticketColor = newColor;
      }
      //console.log(ticketArray);
      
    });
    // update local storage
    localStorage.setItem('tickets', JSON.stringify(ticketArray))
  });
}

//Handle Filter
toolBoxColors.forEach((toolboxcolor) => {
  toolboxcolor.addEventListener("click", () => {
    let selectedToolboxColor = toolboxcolor.classList[0];
    //console.log(selectedToolboxColor);
    // filtering using HOF

    let filteredTickets = ticketArray.filter((ticket) => {
      return selectedToolboxColor == ticket.ticketColor;
    });
    //console.log(filteredTickets);
    let allTickets = document.querySelectorAll(".ticket-cont");
    //console.log(allTickets);
    //remove all tickets
    allTickets.forEach((ticket) => {
      ticket.remove();
    });
    //check if ticket with particular if is existing

    // recreate tickets with filtered array
    filteredTickets.forEach((filteredTicket) => {
      createTicket(
        filteredTicket.ticketColor,
        filteredTicket.ticketContent,
        filteredTicket.ticketId
      );
    });
  });
  toolboxcolor.addEventListener("dblclick", () => {
    let allTickets = document.querySelectorAll(".ticket-cont");
    allTickets.forEach((ticket) => {
      ticket.remove();
    });

    ticketArray.forEach((ticket) => {
      createTicket(ticket.ticketColor, ticket.ticketContent, ticket.ticketId);
    });
  });
});

// local storage
let ticketsLocalStr = localStorage.getItem("tickets");
if(ticketsLocalStr) 
{
  ticketArray = JSON.parse(ticketsLocalStr);
  ticketArray.forEach((ticket) => {
    createTicket(ticket.ticketColor, ticket.ticketContent, ticket.ticketId);
  });
}

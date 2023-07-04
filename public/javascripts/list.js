async function copyToClipboard() {
    var copyText = document.getElementById("list_id");
    try {
        await navigator.clipboard.writeText(copyText.innerText);
        alert('List ID to clipboard');
    } catch (err) {
        alert(err);
    }
}

class ListState {
    constructor() {
        this.saved_state = true;
        this.state_element = document.getElementById("list_state");
    }
    
    renderState() {
        if (this.saved_state) {
            this.state_element.innerText = "Saved to Cloud";
            this.state_element.setAttribute('class', 'badge badge-success');
        } else {
            this.state_element.innerText = "Saving...";
            this.state_element.setAttribute('class', 'badge badge-warning');
        }
    }

    setState(newState) {
        this.saved_state = newState;
        this.renderState();
    }
}

list_state = new ListState();

// Click button when pressing enter
var input = document.getElementById("new_item_text");
input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("item_submit").click();
  }
});

function appendNewItem() {
    new_item_text_box = document.getElementById("new_item_text");
    list = document.getElementById('shopping_list_items');
    newListElement = document.createElement('li');
    newListElement.setAttribute('class', 'list-group-item');
    newListElement.innerHTML = `<div class="row"><div class="col" onInput="handleInput(event)" onBlur="saveChanges(event)">${new_item_text.value}</div><div class="col-auto"><button class="btn bg-transparent btn-sm float-right" onclick="deleteListItem(this)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="13" height="13"><path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"></path></svg></button></div></div>`;
    list.appendChild(newListElement);

    new_item_text_box.value = '';
    new_item_text.focus();

    list_state.setState(false);

    saveChanges();

    setTimeout(
        function() {
            list_state.setState(true);
        }, 500
    );
}

function saveChanges() {
    var new_list_html = Array.from(document.getElementById('shopping_list_items').children);
    var new_list_text = [];
    new_list_html.forEach( (item_html)  => {
        if (item_html.innerText) {
            new_list_text.push(item_html.innerText.trim());
        }
    })
    console.log(`New list state:`);
    console.log(new_list_text)

    list_id = document.getElementById("list_id").innerText;

    fetch('/list/update_list', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "list_id": list_id, "new_list_contents": new_list_text })
    })
    return
}

function deleteListItem(btn) {
    console.log('pressed delete')
    btn.closest('.list-group-item').remove();
    saveChanges();
}

async function copyToClipboard() {
    var copyText = document.getElementById("list_id");
    try {
        await navigator.clipboard.writeText(copyText.innerText);
        alert('List ID to clipboard');
    } catch (err) {
        alert(err);
    }
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

window.onload = function() {
var list = document.getElementById('shopping_list_items');
for (var i = 0; i < list.children.length; i++) {
    addEnterListener(list.children[i]);
}
}

function addEnterListener(element) {
    element.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            var nextElement = getNextElement(element);
            if (nextElement) {
                nextElement.focus();
            } else {
                addListItem();
            }
        }
    });
}

function addListItem() {
    var list = document.getElementById('shopping_list_items');
    var newListElement = document.createElement('li');
    newListElement.contentEditable = 'true';
    newListElement.innerText = '';
    newListElement.classList.add('list-group-item');
    addEnterListener(newListElement);
    list.appendChild(newListElement);
    newListElement.onblur = saveChanges;
    newListElement.focus();
}

function getNextElement(element) {
    do {
        element = element.nextSibling;
    } while (element && element.nodeType !== 1);
    return element;
}

function deleteListItem(btn) {
    console.log('pressed delete')
    btn.closest('.list-group-item').remove();
    saveChanges();
}

function handleInput(event) {
    if (event.target.innerText.trim() === '') {
        // Ensure we always have a non-breaking space when the li is empty
        event.target.innerHTML = '&nbsp;';
    }
}
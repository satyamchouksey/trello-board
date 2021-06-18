let addListButton = document.getElementById("add-list-button");
let addItemButton = document.querySelectorAll(".item-button");
let listContainer = document.querySelector(".lists");
let listCollections = document.querySelectorAll(".list-items");
let itemCollections = document.querySelectorAll(".item-card");
let activeDraggedItem = null;
let activeDraggedImage = null;
const isSessionEmpty = ()=>{
    return !sessionStorage.getItem("trello")
}

const updateItems = (updatedList)=>{
    sessionStorage.setItem("trello",JSON.stringify(updatedList))
}
const getItems = ()=>{
    if(!isSessionEmpty()){
        return sessionStorage.getItem("trello")
    }
    return false;
}
// updateItems(list);
let store = getItems();
let draggedToList = 0,draggedFromList=0,draggedItem=0;
console.log("store",store)
store=JSON.parse(store);
let listIndex=store&&store.listIndex?store.listIndex:0;
let listInfo = store?store:{};
const addTitle=(event, listId)=>{
    listInfo[listId].title=event.target.value;
    console.log("listObj",listInfo)
}
const addContent=(event, child)=>{
    let listId = child.parentElement.id;
    let itemId = event.target.id;
    listInfo[listId].content[itemId]=event.target.value;
    console.log("listObj",listInfo)
}
const renderElement=()=>{
    if(listInfo!={}){
        for(var key in listInfo) {
            renderList(listInfo[key]);
        }
    }
}
const renderList=(list)=>{
    let item = document.createElement('div');
    item.setAttribute("class","list-card")
    item.setAttribute("id",list.listIndex);
    console.log("renderd",renderItem(list.content))
    var newDiv = 
			`<input value="${list.title}"class="list-header"/>
            ${renderItem(list.content)}
            <button class="list-button item-button">+</button>`;
        item.innerHTML = newDiv;
        listContainer.prepend(item);
}
const renderItem=(items)=>{
    let el = document.createElement('div');
    el.setAttribute('class','list-items')
    let testList=[];
    for(var key in items) {
        testList.push(`<textarea class="item-card" draggable="true" cols="30" rows="10" spellcheck="false" id=${key}>
                        ${items[key]}
                        </textarea>`)
    }
    let str=testList.map((el)=>{el}).join('');
    el.innerHTML=str;
    return el;
}
const addList = () => {
    listIndex++;
    listInfo[listIndex]= {
        "listIndex":listIndex,
        "items":1,
        "title":"",
        "content":{}
    }
    const textareaClasses = {"class": "item-card", "cols": "30", "rows":"10", "spellcheck":"false","draggable":"true","id":0}
    let listItem = document.createElement('div');
    let buttonContainer = document.createElement('div');
    let inputField = document.createElement('input');
    let textAreaField = document.createElement('textarea');
    let itemButton = document.createElement('button');
    let buttonDeleteList = document.createElement('button');
    let deleteItemImg = document.createElement('button');
    deleteItemImg.setAttribute('class','list-button item-button in-list-button')
    let listItemTextArea = document.createElement('div');
    setAttributes(textAreaField, textareaClasses)
    setAttributes(listItem, {"class": "list-card", "id": listIndex})
    setAttributes(itemButton, {"class": "list-button item-button in-list-button"})
    setAttributes(buttonDeleteList, {"class": "list-button item-button in-list-button"})
    listItemTextArea.setAttribute('class', 'list-items')
    buttonContainer.setAttribute('class', 'button-container')
    inputField.setAttribute('class', 'list-header');
    inputField.setAttribute('spellcheck', 'false');
    // itemButton.setAttribute('onclick', 'addItem()');
    //TODO add content to session
    inputField.onchange=(event)=>{
        addTitle(event, event.target.parentElement.id);
    }
    textAreaField.onchange=(event)=>{
        addContent(event, event.target.parentElement)
    }
    itemButton.onclick=(event)=>{
        addItem(listItemTextArea, event.target.parentElement.parentElement.id)
    }
    buttonDeleteList.onclick=(event)=>{
        console.log("toDelete",event.target.parentElement.parentElement)
        deleteList(event.target.parentElement.parentElement)
    }
    deleteItemImg.onclick=(event)=>{
        deleteItem(textAreaField, event.target.parentElement.parentElement.id)
        deleteItem(deleteItemImg, event.target.parentElement.parentElement.id)
    }
    itemButton.innerHTML='Add Item';
    buttonDeleteList.innerHTML='Delete List';
    deleteItemImg.innerHTML='Delete Item'
    listItemTextArea.append(textAreaField,deleteItemImg)
    buttonContainer.append(itemButton, buttonDeleteList)
    listItem.append(inputField,listItemTextArea, buttonContainer);
    listEventListeners(listItem, listIndex)
    itemEventListener(textAreaField)
    listContainer.prepend(listItem);
};
const listEventListeners = (list, listIndex)=>{
    console.log("List",list.childNodes[1])
    list=list.childNodes[1];
    list.addEventListener('dragover',(event)=>{
        event.preventDefault();
    })
    list.addEventListener('dragenter',(event)=>{
        event.preventDefault();
    })
    list.addEventListener('drop',(event)=>{
        console.log("to",list.parentElement.id);
        draggedToList=list.parentElement.id;
        console.log("dragListIdTook",event.target);
        list.append(activeDraggedItem);
        list.append(activeDraggedImage);
        //update element in new list obj
        listInfo[draggedToList].items+=1;
        listInfo[draggedToList].content[listInfo[draggedToList].items]=listInfo[draggedFromList].content[draggedItem]
        listInfo[draggedFromList].items-=1;
        delete listInfo[draggedFromList].content[draggedItem]
        console.log("event Dropped", event.target)
        console.log("finalList", listInfo);
        console.log("Body",listContainer)
        // renderElement();
    })
}
const itemEventListener = (item)=>{
    item.addEventListener('dragstart', (event)=>{
        activeDraggedItem = item;
        activeDraggedImage = item.nextSibling;
        console.log("from",item);
        draggedFromList=item.parentElement.parentElement.id;
        draggedItem=item.id;
        setTimeout(()=>{
            item.style.display='none';
        },0)
        console.log("Dragstarted", event.target);
    })
    item.addEventListener('dragend', (event)=>{
            setTimeout(()=>{
                item.style.display='block';
                activeDraggedItem = null;
                activeDraggedImage = null;
            },0)
            console.log("Dragended",event.target);
    })
}
const addItem = (textAreaCollection, id)=>{
    let itemIndex=listInfo[id].items;
    itemIndex++;
    let deleteItemImg = document.createElement('button');
    deleteItemImg.setAttribute('class','list-button item-button in-list-button')
    deleteItemImg.innerHTML='Delete Item'
    const textareaClasses = {"class": "item-card", "cols": "30", "rows":"10", "spellcheck":"false","draggable":"true","id":itemIndex}
    let textAreaField = document.createElement('textarea');
    setAttributes(textAreaField, textareaClasses)
    deleteItemImg.onclick=(event)=>{
        deleteItem(textAreaField)
        deleteItem(deleteItemImg)
    }
    textAreaCollection.append(textAreaField);
    textAreaCollection.append(deleteItemImg);
    //TODO add item content on change 
    textAreaField.onchange=(event)=>{
        addContent(event,event.target.parentElement)
    }
    itemEventListener(textAreaField);
    listInfo[id].items=itemIndex;
}
const deleteItem=(item, id)=>{
    console.log("Items",item)
    item.remove();
}
const deleteList = (item)=>{
    listInfo[item.id].index--;
    delete listInfo[item.id]
    item.remove()
}
const setAttributes=(el, attrs)=> {
    for(var key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
}

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

/* -----create an object and add Firebase database reference URL ---- */
const appSettings = {
    databaseURL : "https://playground-ec290-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

/* -----connect the project with firebase ---- */
const app = initializeApp(appSettings)

/* -----connect the database ---- */
const database = getDatabase(app)

/* -----create reference ---- */
const shoppingListInDB = ref(database, "shoppingList") // shoppingList is the name given to the database

const inputData = document.getElementById("input-field")
const addItem = document.getElementById("add-button")
const shoppingListItems = document.getElementById("shopping-list")

/* -----listen to the click on the button to add data to database ---- */
addItem.addEventListener('click',function()
{
    let inputValue = inputData.value

    /* ---- use push function of firebase to add data to the databse */
    push(shoppingListInDB,inputValue)

    clearInputField()          
})

/* -----fetch database items in realtime ---- */
onValue(shoppingListInDB, function(snapshot){

    /* -----fetch snapshot from database only if items are present ---- */

    if(snapshot.exists())
    {
        let itemsArray = Object.entries(snapshot.val())  

        clearShoppingList()
           
        for (let i = 0; i < itemsArray.length; i++) {
    
            /* ---- get the item Id and Item value */  
            let currentItem = itemsArray[i]
    
            /* ---- add the items to the unordered list */        
              addItemtoShoppingList(currentItem)
        }
    }
    else{
        shoppingListItems.innerHTML = 'No items exists in the database yet'
    }

})

/* -----refactoring functions ---- */
function clearShoppingList()
{
    shoppingListItems.innerHTML = ""
}

function clearInputField()
{
    inputData.value = " "
}

function addItemtoShoppingList(item)
{ 
    /* -----get the id and value from the array ---- */
    let itemId = item[0]
    let itemValue = item[1]
  
/* -----create a list element and add it to the unordered list ---- */
   let newItem = document.createElement("li")
   newItem.textContent = itemValue

/* -----listen to the click on the list and remove the item  ---- */   
   newItem.addEventListener('click',function()
   {
      let exactLocationOfItemInDb = ref(database, `shoppingList/${itemId}`)
      remove(exactLocationOfItemInDb)
   })



   shoppingListItems.append(newItem)
}
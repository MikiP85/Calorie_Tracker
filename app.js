// ===================================================================================
// STORAGE CONTROLLER
// ===================================================================================

const StorageCtrl = (function() {
  // Public methods
  return {
    storeItem: function(item) {
      let items = [];
      // Check if any items in local storage
      if (localStorage.getItem("items") === null) {
        items = [];
        // Push new items
        items.push(item);
        // Set ls items
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        // Get what is already in ls
        items = JSON.parse(localStorage.getItem("items"));
        // Push new item
        items.push(item);
        // Reset ls
        localStorage.setItem("items", JSON.stringify(items));
      }
    },
    getItemsFromStorage: function() {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },
    updateItemStorage: function(updatedItem) {
      let items = JSON.parse(localStorage.getItem("items"));
      items.forEach((item, index) => {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });

      localStorage.setItem("items", JSON.stringify(items));
    },
    deleteItemFromStorage: function(id) {
      let items = JSON.parse(localStorage.getItem("items"));
      items.forEach((item, index) => {
        if (id === item.id) {
          items.splice(index, 1);
        }
      });

      localStorage.setItem("items", JSON.stringify(items));
    },
    clearItemsFromStorage: function() {
      localStorage.removeItem("items");
    }
  };
})();

// ===================================================================================
// ITEM CONTROLLER
// ===================================================================================

const ItemCtrl = (function() {
  // Item constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // Data Structure / STATE
  const data = {
    // items: [
    //   // { id: 0, name: "Stake dinner", calories: 1200 },
    //   // { id: 1, name: "Cookie", calories: 400 },
    //   // { id: 2, name: "Eggs", calories: 700 }
    // ],
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  };

  // Public method
  return {
    getItems: function() {
      return data.items;
    },
    // Add item to state (generate id, parse calories to num, add to items array, and return)
    addItem: function(name, calories) {
      // Generate ID (auto increment by 1)
      let ID;
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      // Calories to number
      calories = parseInt(calories);
      //  Create new item
      newItem = new Item(ID, name, calories);
      // Add to items array
      data.items.push(newItem);

      return newItem;
    },
    getItemById: function(id) {
      let found = 0;
      data.items.forEach(function(item) {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: function(name, calories) {
      // Calories to number
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function(item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem: function(id) {
      // Get ids, return array of ids from map
      const ids = data.items.map(function(item) {
        return item.id;
      });

      // Get index
      const index = ids.indexOf(id);

      // Remove item
      data.items.splice(index, 1);
    },
    clearAllItems: function() {
      data.items = [];
    },
    setCurrentItem: function(itemToEdit) {
      data.currentItem = itemToEdit;
    },
    getCurrentItem: function() {
      return data.currentItem;
    },
    getTotalCalories: function() {
      let total = 0;
      // Loop through items and add cals
      data.items.forEach(function(item) {
        total += item.calories;
      });
      // Set total cals in data structure / state
      data.totalCalories = total;

      // Return total
      return data.totalCalories;
    },

    logData: function() {
      return data;
    }
  };
})();

// ===================================================================================
// UI CONTROLLER
// ===================================================================================

const UICtrl = (function() {
  const UISelectors = {
    itemList: "#item-list",
    listItems: "#item-list li",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    clearBtn: ".clear-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories"
  };

  // Public method
  return {
    populateItemList: function(items) {
      let html = "";
      items.forEach(item => {
        html += `<li class="collection-item" id="item-${item.id}">
              <strong>${item.name}:</strong> <em>${item.calories} calories</em>
              <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
            </li>`;
      });
      //   Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      };
    },
    addListItem: function(item) {
      // Show the list
      document.querySelector(UISelectors.itemList).style.display = "block";
      // Create li element
      const li = document.createElement("li");
      // Add class
      li.className = "collection-item";
      // Add ID
      li.id = `item-${item.id}`;
      // Add HTML
      li.innerHTML = `<strong>${item.name}:</strong> <em>${
        item.calories
      } calories</em>
      <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
      // Insert item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    updateListItem: function(item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Node list loop
      // Turn node list to array
      listItems = Array.from(listItems);

      listItems.forEach(function(listItem) {
        const itemID = listItem.getAttribute("id");
        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `<strong>${
            item.name
          }:</strong> <em>${item.calories} calories</em>
          <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
        }
      });
    },
    deleteListItem: function(id) {
      // Item selector
      const itemID = `#item-${id}`;
      // Select element by id
      const item = document.querySelector(itemID);
      item.remove();
    },
    clearInput: function() {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    addItemToForm: function() {
      document.querySelector(
        UISelectors.itemNameInput
      ).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(
        UISelectors.itemCaloriesInput
      ).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    removeItems: function() {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      // turn node list to array
      listItems = Array.from(listItems);
      listItems.forEach(item => {
        item.remove();
      });
    },
    showTotalCalories: function(totalCalories) {
      document.querySelector(
        UISelectors.totalCalories
      ).textContent = totalCalories;
    },
    clearEditState: function() {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },
    showEditState: function() {
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },
    getSelectors: function() {
      return UISelectors;
    }
  };
})();

// ===================================================================================
// APP CONTROLLER
// ===================================================================================

const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
  // LOAD EVENT LISTENERS (called in return App.init)

  const loadEventListeners = function() {
    // Get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    // Add Item Event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    // Disable submit on Enter press

    document.addEventListener("keypress", function(e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    // Edit Icon click
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemEditClick);

    // Update item event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", itemUpdateSubmit);

    // Delete item event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", itemDeleteSubmit);

    // Back Button event
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", function(e) {
        UICtrl.clearEditState();
        e.preventDefault();
      });

    // Clear All button event
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", clearAllSubmit);
  };

  // Add item submit
  const itemAddSubmit = function(e) {
    // Get form input from UI Controller
    const input = UICtrl.getItemInput();
    // console.log(input);

    // Check for name and calories input
    if (input.name !== "" && input.calories !== "") {
      //  Add item to state
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      // Add item to UI List
      UICtrl.addListItem(newItem);

      // Get Total Calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Show total cals in UI
      UICtrl.showTotalCalories(totalCalories);

      // Store in Local Storage

      StorageCtrl.storeItem(newItem);

      // Clear fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  };

  // Edit item click
  const itemEditClick = function(e) {
    if (e.target.classList.contains("edit-item")) {
      // Get list item id (item-0, item-1)
      const listId = e.target.parentNode.parentNode.id;

      // Break into an array
      const listIdArray = listId.split("-");

      // Get the actual id
      const id = parseInt(listIdArray[1]);
      console.log(id);

      // Get item
      const itemToEdit = ItemCtrl.getItemById(id);
      console.log(itemToEdit);

      // Set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to form
      UICtrl.addItemToForm();
    }

    e.preventDefault();
  };

  // Update item submit

  const itemUpdateSubmit = function(e) {
    // Get item input
    const input = UICtrl.getItemInput();

    // Update item in state
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
    // Update item in UI
    UICtrl.updateListItem(updatedItem);

    // Get Total Calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Show total cals in UI
    UICtrl.showTotalCalories(totalCalories);

    // Update local storage
    StorageCtrl.updateItemStorage(updatedItem);

    UICtrl.clearEditState();

    e.preventDefault();
  };

  // Delete button submit

  const itemDeleteSubmit = function(e) {
    let currentItem = ItemCtrl.getCurrentItem();

    // Remove item from state
    ItemCtrl.deleteItem(currentItem.id);

    // Remove item from UI list
    UICtrl.deleteListItem(currentItem.id);

    // Get Total Calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Show total cals in UI
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();

    // // Remove list (line) - TOTALY unnecessary!
    // let items = ItemCtrl.getItems();
    // if (items.length === 0) {
    //   UICtrl.hideList();
    // }

    // Delete from local storage
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    e.preventDefault();
  };

  // Clear All items event
  const clearAllSubmit = function(e) {
    // Delete all items from state
    ItemCtrl.clearAllItems();

    // Get Total Calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Show total cals in UI
    UICtrl.showTotalCalories(totalCalories);

    // Delete items from UI
    UICtrl.removeItems();

    // Clear all from storage
    StorageCtrl.clearItemsFromStorage();

    // Hide Ul
    UICtrl.hideList();

    e.preventDefault();
  };

  // When return from module its PUBLIC METHOD
  return {
    init: function() {
      // Clear edit state / set initial state
      UICtrl.clearEditState();

      // Fetch items from data structure / state
      const items = ItemCtrl.getItems();
      // Check ih any items are in the list to hide/show list aka line visible in DOM
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // Populate list with items
        UICtrl.populateItemList(items);
      }

      // Get Total Calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Show total cals in UI
      UICtrl.showTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
    }
  };
})(ItemCtrl, StorageCtrl, UICtrl);

// Initialize App

App.init();

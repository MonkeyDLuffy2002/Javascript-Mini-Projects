// Storage Controller
const StorageCtrl = (function() {
    // Public methods
    return {
        storeItem: function(item) {
            let items = [];
            if (localStorage.getItem("items") === null) {
                items.push(item);

                // Set ls
                localStorage.setItem("items", JSON.stringify(items));
            } else {
                items = JSON.parse(localStorage.getItem("items"));
                items.push(item);
                localStorage.setItem("items", JSON.stringify(items));
            }
        },

        getItemsFromLS: function() {
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

            items.forEach(function(item, index) {
                if (updatedItem.id === item.id) {
                    items.splice(index, 1, updatedItem);
                }
            });
            localStorage.setItem("items", JSON.stringify(items));
        },

        deleteItemFromLS: function(id) {
            let items = JSON.parse(localStorage.getItem("items"));

            items.forEach(function(item, index) {
                if (id === item.id) {
                    items.splice(index, 1);
                }
            });
            localStorage.setItem("items", JSON.stringify(items));
        },

        clearItemsFromLS: function() {
            localStorage.removeItem("items");
        }
    }
})();


// Item Controller
const ItemCtrl = (function() {
    // Item Constructor
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structure / State
    const data = {
        items: StorageCtrl.getItemsFromLS(),
        currentItem: null,
        totalCalories: 0
    }

    return {
        getItems: function() {
            return data.items;
        },

        addItem: function(name, calories) {
            let id;

            // Create ID num
            if (data.items.length > 0) {
                id = data.items[data.items.length - 1].id + 1;
            } else {
                id = 0;
            }

            // Calories to num
            calories = parseInt(calories);

            // Create new item
            newItem = new Item(id, name, calories);
            data.items.push(newItem);

            return newItem;
        },

        getItemById: function(id) {
            let found = null;
            data.items.forEach(function(item) {
                if (item.id === id) {
                    found = item;
                }
            });
            return found;
        },

        updatedItem: function(name, calories) {
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
            // Get ids
            ids = data.items.map(function(item) {
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

        setCurrentItem: function(item) {
            data.currentItem = item;
        },

        getCurrentItem: function() {
            return data.currentItem;
        },

        getTotalCalories: function() {
            let total = 0;

            data.items.forEach(function(item) {
                total += item.calories;
            });

            data.totalCalories = total;
            return data.totalCalories
        },

        logData: function() {
            return data;
        }
    }
})();

// UI Controller    
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
    }

    return {
        populateItemList: function(items) {
            let html = ``;

            items.forEach(function(item) {
                html += `
                    <li class="collection-item" id="item-${item.id}">
                        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
                    </li>
                `;
            });

            // Insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },

        getItemInput: function() {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },

        getSelectors: function() {
            return UISelectors;
        },

        addListItem: function(item) {
            document.querySelector(UISelectors.itemList).style.display = "block";
            const li = document.createElement("li");
            li.className = "collection-item";
            li.id = `item-${item.id}`;
            li.innerHTML = `
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
            `;
            document.querySelector(UISelectors.itemList).insertAdjacentElement("beforeend", li);
        },

        updateListItem: function(item) {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Turn node list into array
            listItems = Array.from(listItems);
            
            listItems.forEach(function(listItem) {
                const itemID = listItem.getAttribute("id");

                if (itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `
                    <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
                    `;
                }
            });

        },

        deleteListItem: function(id) {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },

        clearInput: function() {
            document.querySelector(UISelectors.itemNameInput).value = "";
            document.querySelector(UISelectors.itemCaloriesInput).value = "";
        },

        addItemToForm: function() {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },

        removeItems: function() {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Turn Node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(item) {
                item.remove;
            });
        },
        
        hideList: function() {
            document.querySelector(UISelectors.itemList).style.display = "none";
        },

        showTotalCalories: function(totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
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
    }

})();

// App Controller
const App = (function(ItemCtrl, UICtrl, StorageCtrl) {

    // Load event listeners
    const loadEventListeners = function() {
        const UISelectors = UICtrl.getSelectors();

        // Add item event
        document.querySelector(UISelectors.addBtn).addEventListener("click", itemAddSubmit);

        // Disable submit on enter
        document.addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                e.preventDefault();
                return false
            }
        });

        // Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener("click", itemEditClick);

        // Update item event
        document.querySelector(UISelectors.updateBtn).addEventListener("click", itemUpdateSubmit);

        // Delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener("click", itemDeleteSubmit);

        // Back button event
        document.querySelector(UISelectors.backBtn).addEventListener("click", UICtrl.clearEditState);

        // Clear items event
        document.querySelector(UISelectors.clearBtn).addEventListener("click", clearAllItemsClick);
    }

    // Add item submit
    const itemAddSubmit = function(e) {
        // Get from input from UI controller
        const input = UICtrl.getItemInput();
        if (input.name !== "" && input.calories !== "") {
            // Add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            UICtrl.addListItem(newItem);
            
            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            UICtrl.showTotalCalories(totalCalories);
            
            // Store in LS
            StorageCtrl.storeItem(newItem);
            UICtrl.clearInput();
        }

        e.preventDefault();
    }

    // Click edit item
    const itemEditClick = function(e) {
        if (e.target.classList.contains("edit-item")) {
            // Get list item id
            const listId = e.target.parentNode.parentNode.id;

            // Break into array
            const listArr = listId.split("-");

            // Get the actual id
            const id = parseInt(listArr[1]);

            //Get item
            const itemToEdit = ItemCtrl.getItemById(id);

            // Set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            // Add item to form
            UICtrl.addItemToForm();
        }

        e.preventDefault();
    }

    // Update item submit
    const itemUpdateSubmit = function(e) {
        // Get item input
        const input = UICtrl.getItemInput();

        // Update item
        const updatedItem = ItemCtrl.updatedItem(input.name, input.calories);

        // Update UI
        UICtrl.updateListItem(updatedItem);
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);

        // Update lS
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    // Delete button event
    const itemDeleteSubmit = function(e) {
        // Get current item
        const currentItem = ItemCtrl.getCurrentItem();

        // Delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        // Delete from UI
        UICtrl.deleteListItem(currentItem.id);

        // Delete from LS
        StorageCtrl.deleteItemFromLS(currentItem.id);

        // Update calories
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);
        UICtrl.clearEditState();

        e.preventDefault();
    }

    // Clear all items event
    const clearAllItemsClick = function() {
        // Delete all items from data structure
        ItemCtrl.clearAllItems();

        // Remove from UI
        UICtrl.removeItems();

        // Remove from LS
        StorageCtrl.clearItemsFromLS();

        // Update calories
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.showTotalCalories(totalCalories);

        // Hide UI
        UICtrl.hideList();
    }

    // Public methods
    return {
        init: function() {
            // Clear edit state
            UICtrl.clearEditState();

            const items = ItemCtrl.getItems();

            if (items.length === 0) {
                UICtrl.hideList();
            } else {
                UICtrl.populateItemList(items);
            }

            const totalCalories = ItemCtrl.getTotalCalories();
            UICtrl.showTotalCalories(totalCalories);

            // Load event listeners
            loadEventListeners();
        }
    }

})(ItemCtrl, UICtrl, StorageCtrl);

// Initialize App
App.init();
const searchBox = document.getElementById("search-box")
const tabList = document.getElementById("tab-list")

let openTabs = []



chrome.tabs.query({}, function(tabs){
    tabs.forEach(tab => {
        openTabs.push(tab)
        const li = document.createElement('li')
        const spanElement = document.createElement('span')
        spanElement.className = 'close-btn';
        spanElement.innerText = '✕';
        li.innerText = tab.title
        ? (tab.title.length < 50 ? tab.title : tab.title.slice(0, 50))
        : '';
        li.appendChild(spanElement)
        li.addEventListener('click', () => {         
            chrome.tabs.update(tab.id, { active: true })
          })
        
        
       
        spanElement.addEventListener('click', (event)=>{
            event.stopPropagation();
            spanElement.parentElement.remove();
            chrome.tabs.remove(tab.id)
        })
        tabList.appendChild(li)
    });
})

//i will have all the opentabs in openTabs array.












const filterSearch = () =>{
    tabList.innerHTML = "" //We are clearing the tablist
    const searchBoxValue = searchBox.value //We are getting the keyword from the searchbox
    openTabs.map((openTab) =>{ //We are iterating over every single open tab here
        if (
            openTab.title.toLowerCase().includes(searchBoxValue.toLowerCase()) ||
            openTab.url.toLowerCase().includes(searchBoxValue.toLowerCase())
          ){ //We are checking if any of those opentabs title include the searchbox value
            const li = document.createElement('li') //if there is a match we create list eleement
            li.innerText = openTab.title
            li.addEventListener('click', () => {         
                chrome.tabs.update(openTab.id, { active: true })
              })
            tabList.appendChild(li)
        }else{
            return;
        }
    })

}

searchBox.addEventListener('input', filterSearch) //Now whenever there is a change in the value of searchBox, we will run filterSearch function

let selectedIndex = -1;
//Now i have to add keyboard navigation for the list items
document.addEventListener('keydown', (e) => {
    const allListItems = Array.from(document.querySelectorAll('#tab-list li'));
    if (allListItems.length === 0) return;

    if (e.key === 'ArrowDown') {
        selectedIndex = (selectedIndex + 1) % allListItems.length;
    } else if (e.key === 'ArrowUp') {
        selectedIndex = (selectedIndex - 1 + allListItems.length) % allListItems.length;
    } else if (e.key === 'Enter') {
        const selectedItem = allListItems[selectedIndex];
        if (selectedItem) {
            selectedItem.click(); // triggers tab activation
        }
    }

    allListItems.forEach((listItem, index) => {
        if (index === selectedIndex) {
            listItem.classList.add('selected');
            listItem.scrollIntoView({ block: 'nearest' }); // Optional: keep in view
        } else {
            listItem.classList.remove('selected');
        }
    });
});


searchBox.focus()


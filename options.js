/**
* ---------------------------------------------------------------------------------
* | 옵션 |
* ---------------------------------------------------------------------------------
**/

// variable define
const extensionListName = 'blackExtensionList';
const domainListName = 'blackDomainList';
const blackListName = 'googleBlackList';
const whiteListName = 'googleWhiteList';

let blackList = [];
let whiteList = [];
let domainList = [];
let extensionList = [];

// A. element define
const extensionTextBox = document.getElementById('extension');
const addExtensionButton = document.getElementById('addExtension');
const extensionListBox = document.getElementById('extensionList');
const domainTextBox = document.getElementById('domain');
const addDomainButton = document.getElementById('addDomain');
const domainListBox = document.getElementById('domainList');
const blackListBox = document.getElementById('blackList');
const whiteListBox = document.getElementById('whiteList');

// C. common function define
// C.1. element 를 추가하는 함수
function addElement(element, text) {
  const li = document.createElement('li');
  li.textContent = text;
  element.appendChild(li);
}

// C.2. element 를 제거하는 함수
function removeElement(element, text) {
  const li = element.querySelector('li');
  if (li && li.textContent === text) {
    element.removeChild(li);
  }
}

// C.3. chrome.storage 기능
// C.3.1 chrome.storage 에서 가져오는 함수
function getStorage(key, callback) {
  chrome.storage.sync.get(key, function (data) {
    callback(data[key]);
  });
}

// C.3.2 chrome.storage 에 저장하는 함수
function setStorage(key, value) {
  chrome.storage.sync.set({ [key]: value });
}

// C.4. chrome.storage 에서 가져오는 함수
function getLocalVarFromStorage(key, listVar, callback) {
  chrome.storage.sync.get(key, function (data) {
    listVar = data[key];
    callback();
  });
}

// C.5. chrome.storage 에 저장하는 함수
function setLocalVarToStorage(key, listVar) {
  chrome.storage.sync.set({ [key]: listVar });
}

//////////////////////////////////////////////////////////


// B. function define
// B-1. extension list 를 가져오는 함수
function getExtensionList() {
  getStorage(extensionListName, function (data) {
    extensionList.value = data;
  });
}

// B-2. extension list 를 저장하는 함수
function setExtensionList() {
  setStorage(extensionListName, extensionList.value);
}

// B-3. extension list 에 추가하는 함수
function addExtensionList(extension) {
  extensionList.value += extension + ';';
  setExtensionList();
}

// B-4. extension list 에서 제거하는 함수
function removeExtensionList(extension) {
  extensionList.value = extensionList.value.replace(extension + ';', '');
  setExtensionList();
}

// B-5. extension list 인지 확인하는 함수
function isExtensionList(extension) {
  if(extensionList === undefined || extensionList.value === undefined){
    return false;
  }else{
    return extensionList.value.indexOf(extension) !== -1;
  }
}

// B-6. domain list 를 가져오는 함수
function getDomainList() {
  getStorage(domainListName, function (data) {
    domainList.value = data;
  });
}

// B-7. domain list 를 저장하는 함수
function setDomainList() {
  setStorage(domainListName, domainList.value);
}

// B-8. domain list 에 추가하는 함수
function addDomainList(domain) {
  domainList.value += domain + ';';
  setDomainList();
}

// B-9. domain list 에서 제거하는 함수
function removeDomainList(domain) {
  domainList.value = domainList.value.replace(domain + ';', '');
  setDomainList();
}

// B-10. domain list 인지 확인하는 함수
function isDomainList(domain) {
  if(domainList === undefined || domainList.value === undefined){
    return false;
  }else{
    return domainList.value.indexOf(domain) !== -1;
  }
}

// B-11. black list 를 가져오는 함수
function getBlackList() {
  getStorage(blackListName, function (data) {
    blackList.value = data;
  });
}

// B-12. black list 를 저장하는 함수
function setBlackList() {
  setStorage(blackListName, blackList.value);
}

// B-13. white list 를 가져오는 함수
function getWhiteList() {
  getStorage(whiteListName, function (data) {
    whiteList.value = data;
  });
}

// B-14. white list 를 저장하는 함수
function setWhiteList() {
  setStorage(whiteListName, whiteList.value);
}

// C. event define
// C-1. extension list 에 추가 버튼을 클릭하였을 경우
addExtensionButton.addEventListener('click', function () {
  let extension = extensionTextBox.value;
  if (extension !== '') {
    if (!isExtensionList(extension)) {
      addExtensionList(extension);
    }
    extensionTextBox.value = '';
  }
});


// C-3. domain list 에 추가 버튼을 클릭하였을 경우
addDomainButton.addEventListener('click', function () {
  let domain = domainTextBox.value;
  if (domain !== '') {
    if (!isDomainList(domain)) {
      addDomainList(domain);
    }
    domainTextBox.value = '';
  }
});

// C-5. black list 를 출력하는 함수
function printBlackList() {
  chrome.storage.sync.get(blackListName, function (data) {
    let blackList = data.blackList;
    let blackListArray = blackList.split(';');
    let blackListHtml = '';
    for (let i = 0; i < blackListArray.length; i++) {
      if (blackListArray[i] !== '') {
        blackListHtml += '<li>' + blackListArray[i] + '<button>제거</button></li>';
      }
    }
    blackListBox.innerHTML = blackListHtml;

    // C-9. black list 에 추가 버튼을 먼저 찾아서 (blackListBox기준으로 찾음), 이벤트를 등록
    let blackListAddButton = blackListBox.querySelectorAll('button');
    for (let i = 0; i < blackListAddButton.length; i++) {
      blackListAddButton[i].addEventListener('click', function () {
        let domain = blackListAddButton[i].previousSibling.textContent;
        if (!isDomainList(domain)) {
          addDomainList(domain);
        }
        removeBlackList(domain);
      });
    }
  });
}

// C-7. white list 를 출력하는 함수
function printWhiteList() {
  chrome.storage.sync.get(whiteListName, function (data) {
    let whiteList = data.whiteList;
    let whiteListArray = whiteList.split(';');
    let whiteListHtml = '';
    for (let i = 0; i < whiteListArray.length; i++) {
      if (whiteListArray[i] !== '') {
        whiteListHtml += '<li>' + whiteListArray[i] + '<button>제거</button></li>';
      }
    }
    whiteListBox.innerHTML = whiteListHtml;

    // C-10. white list 에 추가 버튼을 먼저 찾아서 (whiteListBox기준으로 찾음), 이벤트를 등록
    let whiteListAddButton = whiteListBox.querySelectorAll('button');
    for (let i = 0; i < whiteListAddButton.length; i++) {
      whiteListAddButton[i].addEventListener('click', function () {
        let domain = whiteListAddButton[i].previousSibling.textContent;
        if (!isDomainList(domain)) {
          addDomainList(domain);
        }
        removeWhiteList(domain);
      });
    }
  });
}

// D. init
// D-1. extension list 를 가져온다.
getExtensionList();

// D-2. domain list 를 가져온다.
getDomainList();

// D-3. black list 를 가져온다.
getBlackList();

// D-4. white list 를 가져온다.
getWhiteList();

// E. test
// E-1. extension list 에 추가
// addExtensionList('test');
// ... 
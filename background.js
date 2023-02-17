/************************************************************
 * google.com 에서 검색시 이상한 불필요한 수집용 사이트는 
 * black list에 추가 하여 구글 검색결과에 더 이상 나오지 않도록 한다.
 ************************************************************/

//////////////////////////////////////////////
// 기존 사용자가 option 에서 설정 한 값을 들고옴
//////////////////////////////////////////////


// variable define
const extensionListName = 'blackExtensionList';
const domainListName = 'blackDomainList';
const blacklistName = "googleBlackList";
const whitelistName = "googleWhiteList";
var blackList = [];
var whiteList = [];

// black list 를 가져오는 함수
function getBlackList() {
    chrome.storage.sync.get(blacklistName, function (data) {
        blackList = data.blackList;
    });
}

// black list 를 저장하는 함수
function setBlackList() {
    chrome.storage.sync.set({blackList: blackList});
}

// black list 에 추가하는 함수
function addBlackList(url) {
    blackList.push(url);
    setBlackList();
}

// black list 에서 제거하는 함수
function removeBlackList(url) {
    blackList = blackList.filter(function (item) {
        return item !== url;
    });
    setBlackList();
}

// 기존 black list 인지 확인하는 함수
function isBlackList(url) {
    return blackList.includes(url);
}

// 지금 사이트가 구글 검색 페이지인지 확인하는 함수
function isGoogleSearch() {
  try{
    if(window){
      return window.location.href.indexOf("google.com/search") !== -1;
    }else{
      return false;
    }
  }catch(e){
    return false;
  }
}

// 검색된 페이지 목록을 조회
function getSearchResult() {
    return document.querySelectorAll("div.g");
}

function isWhiteList(url) {
    return whiteList.includes(url);
}

// 가짜 혹은 수집용, chatgpt 가 만든 사이트인지 확인하는 함수
function checkIsTrashSite(url) {

  // 0. white list 인지 확인
  if (isWhiteList(url)) {
    return false;
  }

  // 1. extension list 인지 확인
  let extension = url.split(".").pop();
  if (isExtensionList(extension)) {
    return true;
  }

  // 2. domain list 인지 확인
  let domain = url.split("/")[2];
  if (isDomainList(domain)) {
    return true;
  }

  // 3. black list 인지 확인
  if (isBlackList(url)) {
    return true;
  }

  // 4. 추가로 확인
  // 4.1 도메인 URL에서 . 으로 구분된 문자열 중 오직 숫자로만 구성된 문자열이 있으면
  //     이상한 사이트로 판단
  let domainArray = domain.split(".");
  for (let i = 0; i < domainArray.length; i++) {
    if (domainArray[i].match(/^[0-9]+$/)) {
      return true;
    }
  }

  // 4.2 쿠키에 chatgpt 가 있으면 이상한 사이트로 판단
  let cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    if (cookies[i].indexOf("chatgpt") !== -1) {
      return true;
    }
  }

}

// 검색된 페이지(리스트)에서 이상한 사이트를 찾는 함수
function findBlackList() {
  var findTrashCount = 0;
    let searchResult = getSearchResult();
    searchResult.forEach(function (item) {
        let url = item.querySelector("a").href;
        if (checkIsTrashSite(url)) {
            findTrashCount++;
            // A. 기존 black list 인지 확인
            if (isBlackList(url)) {
                // A-1. 기존 black list 이면 해당 검색결과를 숨김
                item.style.display = "none";
            } else {  
                // A-2. 기존 black list 가 아니면 black list 추가
                addBlackList(url);
            }
        }
    });
    // 작업이 끝나면 확인을 위해 console 에 출력
    console.log("findTrashCount : " + findTrashCount);
}

// 검색이 완료되면 실행
function run() {
    if (isGoogleSearch()) {
        findBlackList();
    }
}

chrome.runtime.onInstalled.addListener(function () {
    // 기존 사용자가 option 에서 설정 한 값을 들고옴
    chrome.storage.sync.get([blacklistName, whitelistName], function (data) {
        blackList = data.blackList;
        whiteList = data.whiteList;
    });

    // 검색이 완료되면 실행
    run();
});

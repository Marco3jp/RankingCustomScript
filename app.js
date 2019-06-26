// ==UserScript==
// @name         nicovideo ranking custom script
// @namespace    http://tampermonkey.net/
// @homepage     https://marco.plus
// @version      0.1.3
// @description  delete useless column xd
// @author       Marco
// @match        https://www.nicovideo.jp/ranking*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    const deleteColumnNumbers = [6];
    let fixedChunkCounter = 0;
    init();

    function init() {
        let deleteElmList = [];
        let head = document.querySelector(".RankingMainContainer-header");
        for (let i = 0; i < deleteColumnNumbers.length; i++) {
            deleteElmList.push(head.querySelector(`div:nth-child(${deleteColumnNumbers[i]})`));
        }
        deleteNodes(deleteElmList);

        let watchElm = document.querySelector(".RankingMainContainer");
        let config = {attributes: false, childList: true, subtree: true};
        let observer = new MutationObserver(searchNodes);
        observer.observe(watchElm, config);
    }

    function searchNodes(_, observer) {
        let deleteElmList = [];
        let rows = document.querySelectorAll(".RankingMatrixVideosRow");
        for (let i = 0; i < rows.length; i++) {
            for (let j = 0; j < deleteColumnNumbers.length; j++) {
                let elm = rows[i].querySelector(`div:nth-child(${deleteColumnNumbers[j] + 1})`);
                if (elm !== null) {
                    deleteElmList.push(elm);
                }
            }
        }
        deleteNodes(deleteElmList);
        if (fixedChunkCounter >= 100 * deleteColumnNumbers.length + deleteColumnNumbers.length) { // rows + header * deleteColumnNumber
            observer.disconnect();
        }
    }

    function deleteNodes(nodes) {
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i] !== null) {
                nodes[i].parentNode.removeChild(nodes[i]);
                fixedChunkCounter++;
            }
        }
    }
})();
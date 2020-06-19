import "../scss/dataviz.scss";
import { getEntities, clearDataset } from "./api";
import { createTreeData, drawD3Tree } from "./tree";
import { cleanData } from "./dataMap";
import { output } from "./dataMap";
import { menuOptions } from "./options";

init();

function init() {
    toggleLoading();
    menuOptions();
    getEntities()
        .then(data => {
            const cleanJSON = cleanData(data);
            const treeData = createTreeData(cleanJSON);
            drawD3Tree(treeData);
            toggleLoading();
        })
        .catch(err => {
            console.error(err);
        });
    document.querySelector(".clear-store").addEventListener("submit", e => {
        clearDataset();
        e.preventDefault();
    });

    if (document.getElementsByClassName("graphButtons")) {
        document
            .getElementsByClassName("graphButtons")[0]
            .addEventListener("change", event => {
                const visualisation = document.getElementsByClassName(
                    "visualisation"
                )[0];
                if (visualisation.hasAttribute("data-attribute")) {
                    const data = visualisation.getAttribute("data-attribute");
                    output(JSON.parse(data));
                }
            });
    }
}


function toggleLoading() {
    const main = document.querySelector("main");
    const loading = document.querySelector(".loading");
    main.classList.toggle("blurred");
    loading.classList.toggle("inactive");
    loading.classList.toggle("active");
}

import * as d3 from "d3";
import {createPackedCircle} from "./packedCircle";
import {createForceGraph} from "./forceGraph";
import {createSunburst} from "./sunburst";

export function output(data) {
    const message = document.getElementById("visualisationMessage");
    message.style.display = "flex";
    d3.select(".visualisation")
        .select("svg")
        .remove();

    if (!data) {
        message.textContent = "There is no data to display. Pick an item on the left"
        const visualisation = document.getElementsByClassName("visualisation")[0];
        visualisation.setAttribute("data-attribute", "");
        return
    }
    if (!data.children) {
        message.textContent = "Item has no children to display in a visualisation"
        const visualisation = document.getElementsByClassName("visualisation")[0];
        visualisation.setAttribute("data-attribute", "");
        return
    }
    if (data.children.length > 100) {
        message.textContent = "Data has over 100 children. Please pick a smaller item"
        const visualisation = document.getElementsByClassName("visualisation")[0];
        visualisation.setAttribute("data-attribute", "");
        return
    }
    if (data.children) {
        message.textContent = "";
        message.style.display = "none";
        const visualisation = document.getElementsByClassName("visualisation")[0];
        visualisation.setAttribute("data-attribute", JSON.stringify(data));
        const checkedBox = document.querySelectorAll("input[name=graph]:checked")[0]
            .id;

        switch (checkedBox) {
            case "packedcircle":
                createPackedCircle(data);
                break;
            case "forcegraph":
                createForceGraph(data);
                break;
            case "sunburst":
                createSunburst(data);
                break;
        }
    }
}

export function cleanData(data) {
    let cleanedData = data.map(item => {
        return {
            name: item.name ? item.name : false,
            id: item.uri ? sanitizeString(item.uri) : false,
            parent: item.parentURI
                ? sanitizeString(item.parentURI)
                : "Structured Vocabulary",
            note: item.note ? item.note : false,
            keywords: item.keywords ? item.keywords : false
        };
    });

    cleanedData.push({
        name: "Structured Vocabulary",
        id: "Structured Vocabulary",
        parent: false,
        note: false,
        keywords: false
    });

    return cleanedData;
}

function sanitizeString(string) {
    string = string.match("([^/]+$)") ? string.match("([^/]+$)")[0] : string; //Grab everything behind the last "/"
    string = string.replace(/_/g, " "); //Replace "_" with space
    string = string.replace(/-/g, " "); //Replace "-" with space
    string = string //Capitalize each word
        .toLowerCase()
        .split(" ")
        .map(s => s.charAt(0).toUpperCase() + s.substring(1))
        .join(" ");

    return string;
}

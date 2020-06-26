import * as d3 from "d3";

import {output} from "./dataMap";
import {addEntitiy} from "./api";

export function createTreeData(data) {
    const dataMap = data.reduce(function (map, node) {
        map[node.id] = node;
        return map;
    }, {});

    const treeData = [];
    data.forEach(function (node) {
        // add to parent
        const parent = dataMap[node.parent];
        if (parent) {
            node.size = node.children ? false : 12;
            parent.size = false;
            // create child array if it doesn't exist
            (parent.children || (parent.children = []))
                // add node to child array
                .push(node);
        } else {
            // parent is null or missing
            treeData.push(node);
        }
    });

    return treeData;
}

function collapse(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
    }
}

export function drawD3Tree(param) {
    const data = param[0];
    let margin = {top: 10, right: 20, bottom: 30, left: 20},
        width = 900,
        height = 1000,
        barHeight = 30;

    let i = 0,
        duration = 200,
        root;

    let nodeEnterTransition = d3
        .transition()
        .duration(750)
        .ease(d3.easeLinear);

    let svg = d3
        .select(".tree--container")
        .append("svg")
        .attr("class", "tree")
        .attr("width", width) // + margin.left + margin.right)
        .attr("height", height)
        .append("g")
        .attr("class", "treenodes")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    root = d3.hierarchy(data);

    root.children.forEach(collapse);

    root.x0 = 0;
    root.y0 = 0;
    update(root);

    function update(source) {
        // Compute the flattened node list.
        const nodes = root.descendants();

        const height = Math.max(
            500,
            nodes.length * barHeight + margin.top + margin.bottom
        );

        const width = Math.max(500, nodes.width);

        d3.select(".tree")
            .transition()
            .attr("height", height)
            .attr("background", "#ffffff");

        function addButtonClick() {
            if (document.getElementById("dataCreator")) {
                const dataCreator = document.getElementById("dataCreator");
                dataCreator.remove();
            }
            const selectedNode = d3.select(".selectedNode").node(),
                index = document.getElementsByClassName("index")[0];
            let dataCreator = document.createElement("div"),
                header = document.createElement("h2"),
                input = document.createElement("input"),
                button = document.createElement("input");

            dataCreator.id = "dataCreator";
            header.textContent = "Parent: " + selectedNode.__data__.data.name;
            input.type = "text";
            input.autocomplete = 'off';
            input.id = "childInput";
            input.placeholder = "Enter name of child here";
            button.type = "submit";
            button.id = "addButton";
            button.value = "Add";
            button.setAttribute("data-name", selectedNode.__data__.data.name);
            button.setAttribute("data-id", selectedNode.__data__.data.id);

            dataCreator.appendChild(header);
            dataCreator.appendChild(input);
            dataCreator.appendChild(button);
            index.appendChild(dataCreator);

            button = document.getElementById("addButton");
            button.addEventListener("click", function (event) {
                event.preventDefault();
                const name = document.getElementById("childInput").value;
                let parent;
                if (event.target.attributes[3].value === "Structured Vocabulary") {
                    parent = null;
                } else {
                    parent = event.target.attributes[3].value;
                }

                //Send to API
                addEntitiy({
                    name: name,
                    parentName: parent,
                    parentURI: event.target.attributes[4].value,
                    keywords: null,
                    note: null
                });
                dataCreator.remove();
            });
        }

        function editButtonClick() {
            if (document.getElementById("dataCreator")) {
                const dataCreator = document.getElementById("dataCreator");
                dataCreator.remove();
            }
            const selectedNode = d3.select(".selectedNode").node(),
                index = document.getElementsByClassName("index")[0];
            let dataCreator = document.createElement("div"),
                header = document.createElement("h2"),
                input = document.createElement("input"),
                button = document.createElement("input");

            dataCreator.id = "dataCreator";
            header.textContent = "Editing: " + selectedNode.__data__.data.name;
            input.type = "text";
            input.value = selectedNode.__data__.data.name;
            input.id = "childInput";
            input.autocomplete = 'off';
            input.placeholder = "Enter new name here";
            button.type = "submit";
            button.id = "editButton";
            button.value = "Edit";
            button.setAttribute("data-name", selectedNode.__data__.data.name);
            button.setAttribute("data-id", selectedNode.__data__.data.id);

            dataCreator.appendChild(header);
            dataCreator.appendChild(input);
            dataCreator.appendChild(button);
            index.appendChild(dataCreator);

            button = document.getElementById("editButton");
            button.addEventListener("click", function (event) {
                event.preventDefault();
                const name = document.getElementById("childInput").value;
                let parent;
                if (event.target.attributes[3].value == "Structured Vocabulary") {
                    parent = "";
                } else {
                    parent = event.target.attributes[3].value;
                }

                //Send to API
                console.log({
                    name: parent,
                    uri: event.target.attributes[4].value
                });
                dataCreator.remove();
            });
        }

        let index = -1;
        root.eachBefore(n => {
            n.x = ++index * barHeight;
            n.y = n.depth * 20;
        });

        // Update the nodes…
        const node = svg.selectAll(".node").data(nodes, d => d.id || (d.id = ++i));

        const nodeEnter = node
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", () => "translate(" + source.y0 + "," + source.x0 + ")")
            .on("mouseover", function (d) {
                mouse(d, this);
            })
            .on("click", click);

        function mouse(d, node) {
            d3.select(".svgEditButton").remove();
            d3.select(".svgAddButton").remove();
            let selectedNode = d3.select(".selectedNode").node();
            d3.select(".selectedNode rect").style("fill", "transparent");
            d3.select(selectedNode).classed("selectedNode", false);
            d3.select(node).classed("selectedNode", true);
            selectedNode = d3.select(".selectedNode").node();
            d3.select(".selected").classed("selected", false);
            d3.select(node.children[3]).classed("selected", true);
            d3.select(node.children[0]).style("fill", "rgba(0, 0, 0, 0.04)");
            const textBox = selectedNode.children[3].getBBox();
            d3.select(".tree")
                .append("svg:image")
                .attr("class", "svgAddButton")
                .attr("width", "1.875em")
                .attr("height", "1.875em")
                .attr("x", "-10%")
                .attr("y", "-10%")
                .attr("x", textBox.width + selectedNode.__data__.y + 48)
                .attr("y", selectedNode.__data__.x - 6)
                .attr("xlink:href", "svg/add.svg")
                .on("click", addButtonClick);
            d3.select(".tree")
                .append("svg:image")
                .attr("class", "svgEditButton")
                .attr("width", "1.875em")
                .attr("height", "1.875em")
                .attr("x", "-10%")
                .attr("y", "-10%")
                .attr("x", textBox.width + selectedNode.__data__.y + 90)
                .attr("y", selectedNode.__data__.x - 6)
                .attr("xlink:href", "svg/edit.svg")
                .on("click", editButtonClick);
        }

        nodeEnter
            .append("rect")
            .attr("class", "nodeBox")
            .attr("x", "-10%")
            .attr("y", "-1em")
            .style("fill", "transparent")
            .attr("width", "120%")
            .attr("height", "1.875em");

        // adding arrows
        nodeEnter
            .append("text")
            .attr("x", -20)
            .attr("y", 2)
            .attr("fill", "grey")
            .attr("font-size", "12px")
            .text(d => (d.children ? "➖" : d._children ? "➕" : ""));

        // adding file or folder
        nodeEnter
            .append("text")
            .attr("x", -10)
            .attr("y", 2)
            .attr("fill", d => (d.children || d._children ? "#e60000" : "#ff4d4d"))
            .attr("font-size", "12px")
            .text(d => (d.children || d._children ? "🔹" : "🔸"));

        // adding file or folder names
        nodeEnter
            .append("text")
            .attr("dy", 3.5)
            .attr("dx", 5.5)
            .text(
                d =>
                    `${d.data.name} ${
                        d.data.children
                            ? `[${d.data.children.length}]`
                            : d.data._children
                            ? `[${d.data._children.length}]`
                            : ""
                    }`
            );

        // Transition nodes to their new position.
        nodeEnter
            .transition(nodeEnterTransition)
            .attr("transform", d => "translate(" + d.y + "," + d.x + ")")
            .style("opacity", 1);

        node
            .transition()
            .duration(duration)
            .attr("transform", d => "translate(" + d.y + "," + d.x + ")")
            .style("opacity", 1);

        // Transition exiting nodes to the parent's new position.
        node
            .exit()
            .transition()
            .duration(duration)
            .attr("transform", () => "translate(" + source.y + "," + source.x + ")")
            .style("opacity", 0)
            .remove();

        // Stash the old positions for transition.
        root.each(d => {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    // Toggle children on click.
    function click(d) {
        output(d.data);
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        d3.select(this).remove();
        update(d);

        if (document.getElementsByClassName("clickBox")) {
            d3.selectAll(".clickBox").remove();
        }
        d3.select(".tree")
            .insert("rect", ".treenodes")
            .attr("class", "clickBox")
            .attr("width", "120%")
            .attr("height", "1.875em")
            .attr("x", "-10%")
            .attr("y", d.x - 6)
            .style("fill", "rgba(0, 0, 0, 0.08)");
    }
}

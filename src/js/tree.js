import * as d3 from "d3";

init();

function init() {
    getEntities().then(data => {
        const cleanJSON = cleanData(data);
        const treeData = createTreeData(cleanJSON);
        drawD3Tree(treeData);
    })
}

function getEntities() {
    return new Promise((resolve, reject) => {
        fetch('/data/getentities')
            .then(res => {
                if (res.ok){
                    return res.json();
                } else {
                    console.error(res.error());
                    reject('Fetch failed')
                }
            })
            .then(data => {
                resolve(data);
            })
    })
}


function createTreeData(data) {
    const dataMap = data.reduce(function(map, node) {
        map[node.id] = node;
        return map;
    }, {});

    const treeData = [];
    data.forEach(function(node) {
        // add to parent
        const parent = dataMap[node.parent];
        if (parent) {
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

function drawD3Tree(param) {
    const data = param[0]
    let margin = {top: 10, right: 20, bottom: 30, left: 20},
        width = 960,
        height = 1000,
        barHeight = 20;

    let i = 0,
        duration = 200,
        root;

    let nodeEnterTransition = d3.transition()
        .duration(750)
        .ease(d3.easeLinear);


    let svg = d3.select(".tree")
        .append("svg")
        .attr("width", width) // + margin.left + margin.right)
        .attr("height",height)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    root = d3.hierarchy(data);
    root._children = root.children;
    root.children = null
    root.x0 = 0;
    root.y0 = 0;
    update(root);



    function update(source) {

        // Compute the flattened node list.
        var nodes = root.descendants();

        var height = Math.max(500, nodes.length * barHeight + margin.top + margin.bottom);

        d3.select("svg").transition()
            .attr("height", height)
            .attr("background", '#ffffff')

        var index = -1;
        root.eachBefore((n) => {
            n.x = ++index * barHeight;
            n.y = n.depth * 20;
        });

        // Update the nodes…
        var node = svg.selectAll(".node")
            .data(nodes, (d) => d.id || (d.id = ++i));

        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .attr("transform", () => "translate(" + source.y0 + "," + source.x0 + ")")
            .on("click", click)
        ;

        // adding arrows
        nodeEnter.append('text')
            .attr('x', -20)
            .attr('y', 2)
            .attr('fill', 'grey')
            .attr('font-size', '12px')
            .text((d) => d.children ? '➖' : d._children ? '➕' : "");

        // adding file or folder
        nodeEnter.append('text')
            .attr('x', -10)
            .attr('y', 2)
            .attr('fill', (d) => d.children || d._children ? '#e60000' : '#ff4d4d')
            .attr('font-size', '12px')
            .text((d) => d.children || d._children ? '🔹' : '🔸');

        // adding file or folder names
        nodeEnter.append("text")
            .attr("dy", 3.5)
            .attr("dx", 5.5)
            .text((d) => `${d.data.name} ${d.data.children ? `[${d.data.children.length}]` : d.data._children ? `[${d.data._children.length}]` : ''}`)
            .on("mouseover", function (d) {
                d3.select(this).classed("selected", true);
            })
            .on("mouseout", function (d) {
                d3.selectAll(".selected").classed("selected", false);
            });


        // Transition nodes to their new position.
        nodeEnter.transition(nodeEnterTransition)
            .attr("transform", (d) => "translate(" + d.y + "," + d.x + ")")
            .style("opacity", 1);

        node.transition()
            .duration(duration)
            .attr("transform", (d) => "translate(" + d.y + "," + d.x + ")")
            .style("opacity", 1);


        // Transition exiting nodes to the parent's new position.
        node.exit().transition()
            .duration(duration)
            .attr("transform", () => "translate(" + source.y + "," + source.x + ")")
            .style("opacity", 0)
            .remove();


        // Stash the old positions for transition.
        root.each((d) => {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    };

    // Toggle children on click.
    function click(d) {
        output(d.data)
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        d3.select(this).remove()
        update(d);
    }
}

function output(data) {
    console.log(data);
}

function cleanData(data) {
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
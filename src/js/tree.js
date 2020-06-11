import * as d3 from "d3";
import "../scss/dataviz.scss";

init();

function init() {
  getEntities().then(data => {
    const cleanJSON = cleanData(data);
    const treeData = createTreeData(cleanJSON);
    drawD3Tree(treeData);
  });

  if (document.getElementsByClassName("graphButtons")) {
    document
      .getElementsByClassName("graphButtons")[0]
      .addEventListener("change", event => {
        const data = document.body.getAttribute("data-attribute");
        output(JSON.parse(data));
      });
  }
}

function getEntities() {
  return new Promise((resolve, reject) => {
    fetch("/data/getentities")
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          console.error(res.error());
          reject("Fetch failed");
        }
      })
      .then(data => {
        resolve(data);
      });
  });
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

function collapse(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  }
}

function drawD3Tree(param) {
  const data = param[0];
  let margin = { top: 10, right: 20, bottom: 30, left: 20 },
    width = 960,
    height = 1000,
    barHeight = 20;

  let i = 0,
    duration = 200,
    root;

  let nodeEnterTransition = d3
    .transition()
    .duration(750)
    .ease(d3.easeLinear);

  let svg = d3
    .select(".tree")
    .append("svg")
    .attr("class", "tree")
    .attr("width", width) // + margin.left + margin.right)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  root = d3.hierarchy(data);

  root.children.forEach(collapse);

  root.x0 = 0;
  root.y0 = 0;
  update(root);

  function update(source) {
    // Compute the flattened node list.
    var nodes = root.descendants();

    var height = Math.max(
      500,
      nodes.length * barHeight + margin.top + margin.bottom
    );

    d3.select("svg")
      .transition()
      .attr("height", height)
      .attr("background", "#ffffff");

    var index = -1;
    root.eachBefore(n => {
      n.x = ++index * barHeight;
      n.y = n.depth * 20;
    });

    // Update the nodes…
    var node = svg.selectAll(".node").data(nodes, d => d.id || (d.id = ++i));

    var nodeEnter = node
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", () => "translate(" + source.y0 + "," + source.x0 + ")")
      .on("click", click);
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
      )
      .on("mouseover", function(d) {
        d3.select(this).classed("selected", true);
      })
      .on("mouseout", function(d) {
        d3.selectAll(".selected").classed("selected", false);
      });

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
  }
}

function output(data) {
  if (data.children) {
    d3.select(".visualisation")
      .select("svg")
      .remove();

    document.body.setAttribute("data-attribute", JSON.stringify(data));

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

function cleanData(data) {
  let cleanedData = data.map(item => {
    return {
      name: item.name ? item.name : false,
      id: item.uri ? sanitizeString(item.uri) : false,
      parent: item.parentURI
        ? sanitizeString(item.parentURI)
        : "Structured Vocabulary",
      note: item.note ? item.note : false,
      keywords: item.keywords ? item.keywords : false,
      size: 1
    };
  });

  cleanedData.push({
    name: "Structured Vocabulary",
    id: "Structured Vocabulary",
    parent: false,
    note: false,
    keywords: false,
    size: 1
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

function createPackedCircle(data) {
  var svg = d3
      .select(".visualisation")
      .append("svg")
      .attr("class", "packedcircle")
      .attr("width", "100%")
      .attr("height", "100%"),
    width = 800,
    margin = 20,
    diameter = +width,
    g = svg
      .append("g")
      .attr(
        "transform",
        "translate(" + diameter / 2 + "," + diameter / 2 + ")"
      );

  var color = d3
    .scaleLinear()
    .domain([-1, 5])
    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
    .interpolate(d3.interpolateHcl);

  var pack = d3
    .pack()
    .size([diameter - margin, diameter - margin])
    .padding(2);

  let root = d3
    .hierarchy(data)
    .sum(function(d) {
      return d.size;
    })
    .sort(function(a, b) {
      return b.value - a.value;
    });

  var focus = root,
    nodes = pack(root).descendants(),
    view;

  var circle = g
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("class", function(d) {
      return d.parent
        ? d.children
          ? "node"
          : "node node--leaf"
        : "node node--root";
    })
    .style("fill", function(d) {
      return d.children ? color(d.depth + 1) : null;
    })
    .on("click", function(d) {
      if (focus !== d) zoom(d), d3.event.stopPropagation();
    });

  var text = g
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("class", "label")
    .style("fill-opacity", function(d) {
      return d.parent === root ? 1 : 0;
    })
    .style("display", function(d) {
      return d.parent === root ? "inline" : "none";
    })
    .text(function(d) {
      return d.data.name;
    });

  var node = g.selectAll("circle,text");

  svg.on("click", function() {
    zoom(root);
  });
  zoomTo([root.x, root.y, root.r * 2 + margin]);

  function zoom(d) {
    var focus = d;

    var transition = d3
      .transition()
      .duration(d3.event.altKey ? 7500 : 750)
      .tween("zoom", function(d) {
        var i = d3.interpolateZoom(view, [
          focus.x,
          focus.y,
          focus.r * 2 + margin
        ]);
        return function(t) {
          zoomTo(i(t));
        };
      });

    transition
      .selectAll("text")
      .filter(function(d) {
        return d.parent === focus || this.style.display === "inline";
      })
      .style("fill-opacity", function(d) {
        return d.parent === focus ? 1 : 0;
      })
      .on("start", function(d) {
        if (d.parent === focus) this.style.display = "inline";
      })
      .on("end", function(d) {
        if (d.parent !== focus) this.style.display = "none";
      });
  }

  function zoomTo(v) {
    var k = diameter / v[2];
    view = v;
    node.attr("transform", function(d) {
      return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
    });
    circle.attr("r", function(d) {
      return d.r * k;
    });
  }
}

function createSunburst(data) {
  const format = d3.format(",d");
  const width = 1000;
  const radius = width / 6;

  const arc = d3
    .arc()
    .startAngle(d => d.x0)
    .endAngle(d => d.x1)
    .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
    .padRadius(radius * 1.5)
    .innerRadius(d => d.y0 * radius)
    .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1));

  const partition = data => {
    const root = d3
      .hierarchy(data)
      .sum(d => d.size)
      .sort((a, b) => b.value - a.value);
    return d3.partition().size([2 * Math.PI, root.height + 1])(root);
  };

  const root = partition(data);
  const color = d3
    .scaleOrdinal()
    .range(d3.quantize(d3.interpolateRainbow, data.children.length + 1));

  root.each(d => (d.current = d));

  const svg = d3
    .select(".visualisation")
    .append("svg")
    .attr("viewBox", `0 0 1000 1000`)
    .style("width", "100%")
    .style("height", "100%")
    .style("font", "10px sans-serif");

  const g = svg
    .append("g")
    .attr("transform", `translate(${width / 2},${width / 2})`)
    .call(
      d3.zoom().on("zoom", function() {
        svg.attr("transform", d3.event.transform); // Needs debugging
      })
    );

  const path = g
    .append("g")
    .selectAll("path")
    .data(root.descendants().slice(1))
    .join("path")
    .attr("fill", d => {
      while (d.depth > 1) d = d.parent;
      return color(d.data.name);
    })
    .attr("fill-opacity", d =>
      arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0
    )
    .attr("d", d => arc(d.current));

  path
    .filter(d => d.children)
    .style("cursor", "pointer")
    .on("click", clicked);

  path.append("title").text(
    d =>
      `${d
        .ancestors()
        .map(d => d.data.name)
        .reverse()
        .join("/")}\n${format(d.value)}`
  );

  const label = g
    .append("g")
    .attr("pointer-events", "none")
    .attr("text-anchor", "middle")
    .style("user-select", "none")
    .selectAll("text")
    .data(root.descendants().slice(1))
    .join("text")
    .attr("dy", "0.35em")
    .attr("fill-opacity", d => +labelVisible(d.current))
    .attr("transform", d => labelTransform(d.current))
    .text(d => d.data.name);

  const parent = g
    .append("circle")
    .datum(root)
    .attr("r", radius)
    .attr("fill", "none")
    .attr("pointer-events", "all")
    .on("click", clicked);

  function clicked(p) {
    parent.datum(p.parent || root);

    root.each(
      d =>
        (d.target = {
          x0:
            Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) *
            2 *
            Math.PI,
          x1:
            Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) *
            2 *
            Math.PI,
          y0: Math.max(0, d.y0 - p.depth),
          y1: Math.max(0, d.y1 - p.depth)
        })
    );

    const t = g.transition().duration(750);
    path
      .transition(t)
      .tween("data", d => {
        const i = d3.interpolate(d.current, d.target);
        return t => (d.current = i(t));
      })
      .filter(function(d) {
        return +this.getAttribute("fill-opacity") || arcVisible(d.target);
      })
      .attr("fill-opacity", d =>
        arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0
      )
      .attrTween("d", d => () => arc(d.current));

    label
      .filter(function(d) {
        return +this.getAttribute("fill-opacity") || labelVisible(d.target);
      })
      .transition(t)
      .attr("fill-opacity", d => +labelVisible(d.target))
      .attrTween("transform", d => () => labelTransform(d.current));
  }

  function arcVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
  }

  function labelVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
  }

  function labelTransform(d) {
    const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
    const y = ((d.y0 + d.y1) / 2) * radius;
    return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
  }
}

function createForceGraph(data) {
  const flatData = new Array();
  flatData.push({
    name: data.name,
    id: data.id,
    parent: data.parent,
    group: 0
  });
  flatten(data); // Not the best way to do this
  const arrowArray = getArrows(flatData);
  var graph = {
    nodes: flatData,
    links: arrowArray
  };

  function flatten(node) {
    node.children.map(item => {
      if (item.children) {
        flatten(item);
        delete item["children"];
      }
      flatData.push(item);
    });
  }

  function getArrows(data) {
    const arrowArray = new Array();
    data.map(item => {
      data.map(node => {
        if (item.parent == node.id) {
          arrowArray.push({
            source: item.id,
            target: node.id,
            group: 1
          });
        }
      });
    });
    return arrowArray;
  }

  createGraph(graph);

  function createGraph(graph) {
    var width = 800;
    var height = 600;
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var label = {
      nodes: [],
      links: []
    };

    graph.nodes.forEach(function(d, i) {
      label.nodes.push({ node: d });
      label.nodes.push({ node: d });
      label.links.push({
        source: i * 2,
        target: i * 2 + 1
      });
    });

    var labelLayout = d3
      .forceSimulation(label.nodes)
      .force("charge", d3.forceManyBody().strength(-50))
      .force(
        "link",
        d3
          .forceLink(label.links)
          .distance(0)
          .strength(2)
      );

    var graphLayout = d3
      .forceSimulation(graph.nodes)
      .force("charge", d3.forceManyBody().strength(-3000))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX(width / 2).strength(1))
      .force("y", d3.forceY(height / 2).strength(1))
      .force(
        "link",
        d3
          .forceLink(graph.links)
          .id(function(d) {
            return d.id;
          })
          .distance(50)
          .strength(1)
      )
      .on("tick", ticked);

    var adjlist = [];

    graph.links.forEach(function(d) {
      adjlist[d.source.index + "-" + d.target.index] = true;
      adjlist[d.target.index + "-" + d.source.index] = true;
    });

    function neigh(a, b) {
      return a == b || adjlist[a + "-" + b];
    }

    var svg = d3
      .select(".visualisation")
      .append("svg")
      .attr("class", "forcegraph")
      .attr("width", width)
      .attr("height", height);
    var container = svg.append("g");

    svg.call(
      d3
        .zoom()
        .scaleExtent([0.1, 4])
        .on("zoom", function() {
          container.attr("transform", d3.event.transform);
        })
    );

    var link = container
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(graph.links)
      .enter()
      .append("line")
      .attr("stroke", "#aaa")
      .attr("stroke-width", "1px");

    var node = container
      .append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(graph.nodes)
      .enter()
      .append("circle")
      .attr("r", 5)
      .attr("fill", function(d) {
        return color(d.group);
      });

    node.on("mouseover", focus).on("mouseout", unfocus);

    node.call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );

    var labelNode = container
      .append("g")
      .attr("class", "labelNodes")
      .selectAll("text")
      .data(label.nodes)
      .enter()
      .append("text")
      .text(function(d, i) {
        return i % 2 == 0 ? "" : d.node.name;
      })
      .style("fill", "#555")
      .style("font-family", "Arial")
      .style("font-size", 12)
      .style("pointer-events", "none"); // to prevent mouseover/drag capture

    node.on("mouseover", focus).on("mouseout", unfocus);

    function ticked() {
      node.call(updateNode);
      link.call(updateLink);

      labelLayout.alphaTarget(0.3).restart();
      labelNode.each(function(d, i) {
        if (i % 2 == 0) {
          d.x = d.node.x;
          d.y = d.node.y;
        } else {
          var b = this.getBBox();

          var diffX = d.x - d.node.x;
          var diffY = d.y - d.node.y;

          var dist = Math.sqrt(diffX * diffX + diffY * diffY);

          var shiftX = (b.width * (diffX - dist)) / (dist * 2);
          shiftX = Math.max(-b.width, Math.min(0, shiftX));
          var shiftY = 16;
          this.setAttribute(
            "transform",
            "translate(" + shiftX + "," + shiftY + ")"
          );
        }
      });
      labelNode.call(updateNode);
    }

    function fixna(x) {
      if (isFinite(x)) return x;
      return 0;
    }

    function focus(d) {
      var index = d3.select(d3.event.target).datum().index;
      node.style("opacity", function(o) {
        return neigh(index, o.index) ? 1 : 0.1;
      });
      labelNode.attr("display", function(o) {
        return neigh(index, o.node.index) ? "block" : "none";
      });
      link.style("opacity", function(o) {
        return o.source.index == index || o.target.index == index ? 1 : 0.1;
      });
    }

    function unfocus() {
      labelNode.attr("display", "block");
      node.style("opacity", 1);
      link.style("opacity", 1);
    }

    function updateLink(link) {
      link
        .attr("x1", function(d) {
          return fixna(d.source.x);
        })
        .attr("y1", function(d) {
          return fixna(d.source.y);
        })
        .attr("x2", function(d) {
          return fixna(d.target.x);
        })
        .attr("y2", function(d) {
          return fixna(d.target.y);
        });
    }

    function updateNode(node) {
      node.attr("transform", function(d) {
        return "translate(" + fixna(d.x) + "," + fixna(d.y) + ")";
      });
    }

    function dragstarted(d) {
      d3.event.sourceEvent.stopPropagation();
      if (!d3.event.active) graphLayout.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) graphLayout.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }
}

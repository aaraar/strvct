import * as d3 from "d3";

export function createForceGraph(data) {
  function flatten(node) {
    return new Promise((resolve, reject) => {
      let flatArray = [];
      flatArray.push({
        name: data.name,
        id: data.id,
        parent: data.parent,
        group: 0
      });
      recursiveFlatten(node);
      function recursiveFlatten(node) {
        node.children.map(item => {
          if (item.children) {
            recursiveFlatten(item);
            delete item["children"];
            flatArray.push(item);
          } else {
            flatArray.push(item);
            resolve(flatArray);
          }
        });
      }
    });
  }

  flatten(data).then(arr => {
    cleanDataAndDraw(arr);
  }); // Not the best way to do this

  function cleanDataAndDraw(flatData) {
    const arrowArray = getArrows(flatData);
    const graph = {
      nodes: flatData,
      links: arrowArray
    };

    function getArrows(data) {
      const arrowArray = [];
      data.map(item => {
        data.map(node => {
          if (item.parent === node.id) {
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

    drawForceGraph(graph);

    function drawForceGraph(graph) {
      const width = 1000;
      const height = 1000;
      const color = d3.scaleOrdinal(d3.schemeCategory10);

      const label = {
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

      const labelLayout = d3
        .forceSimulation(label.nodes)
        .force("charge", d3.forceManyBody().strength(-50))
        .force(
          "link",
          d3
            .forceLink(label.links)
            .distance(0)
            .strength(2)
        );

      const graphLayout = d3
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
            .distance(150)
            .strength(1)
        )
        .on("tick", ticked);

      const adjlist = [];

      graph.links.forEach(function(d) {
        adjlist[d.source.index + "-" + d.target.index] = true;
        adjlist[d.target.index + "-" + d.source.index] = true;
      });

      function neigh(a, b) {
        return a === b || adjlist[a + "-" + b];
      }

      const svg = d3
        .select(".visualisation")
        .append("svg")
        .attr("viewBox", `0 0 1000 1000`)
        .attr("class", "forcegraph")
        .attr("width", "100%")
        .attr("height", "100%");
      const container = svg.append("g");

      svg.call(
        d3
          .zoom()
          .scaleExtent([0.1, 4])
          .on("zoom", function() {
            container.attr("transform", d3.event.transform);
          })
      );

      const link = container
        .append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter()
        .append("line")
        .attr("stroke", "#aaa")
        .attr("stroke-width", "2px");

      const node = container
        .append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(graph.nodes)
        .enter()
        .append("circle")
        .attr("r", 10)
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

      const labelNode = container
        .append("g")
        .attr("class", "labelNodes")
        .selectAll("text")
        .data(label.nodes)
        .enter()
        .append("text")
        .text(function(d, i) {
          return i % 2 === 0 ? "" : d.node.name;
        })
        .style("fill", "#333")
        .style("font-family", "Arial")
        .style("font-size", 32)
        .style("pointer-events", "none"); // to prevent mouseover/drag capture

      node.on("mouseover", focus).on("mouseout", unfocus);

      function ticked() {
        node.call(updateNode);
        link.call(updateLink);

        labelLayout.alphaTarget(0.3).restart();
        labelNode.each(function(d, i) {
          if (i % 2 === 0) {
            d.x = d.node.x;
            d.y = d.node.y;
          } else {
            const b = this.getBBox();

            const diffX = d.x - d.node.x;
            const diffY = d.y - d.node.y;

            const dist = Math.sqrt(diffX * diffX + diffY * diffY);

            let shiftX = (b.width * (diffX - dist)) / (dist * 2);
            shiftX = Math.max(-b.width, Math.min(0, shiftX));
            const shiftY = 16;
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
        const index = d3.select(d3.event.target).datum().index;
        node.style("opacity", function(o) {
          return neigh(index, o.index) ? 1 : 0.1;
        });
        labelNode.attr("display", function(o) {
          return neigh(index, o.node.index) ? "block" : "none";
        });
        link.style("opacity", function(o) {
          return o.source.index === index || o.target.index === index ? 1 : 0.1;
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
}
